import * as _ from 'lodash';
import { getName, getNamespace, getOwnerReferences } from '@console/shared/src/selectors';
import { PodKind } from '@console/internal/module/k8s';
import { buildOwnerReference, compareOwnerReference } from '../../utils';
import { VMIKind, VMKind } from '../../types/vm';
import { VMMultiStatus, VMLikeEntityKind } from '../../types';
import {
  VM_STATUS_IMPORTING,
  VM_STATUS_V2V_CONVERSION_IN_PROGRESS,
} from '../../statuses/vm/constants';
import { isVMRunning, getDisks, getInterfaces } from './selectors';
import { asVM } from './vmlike';

const IMPORTING_STATUSES = new Set([VM_STATUS_IMPORTING, VM_STATUS_V2V_CONVERSION_IN_PROGRESS]);

export const isVMImporting = (status: VMMultiStatus): boolean =>
  status && IMPORTING_STATUSES.has(status.status);

export const isVMRunningWithVMI = ({ vm, vmi }: { vm: VMKind; vmi: VMIKind }): boolean =>
  isVMRunning(vm) && !_.isEmpty(vmi);

export const findConversionPod = (vm: VMKind, pods: PodKind[]) => {
  if (!pods) {
    return null;
  }

  const vmOwnerReference = buildOwnerReference(vm);

  return pods.find((pod) => {
    const podOwnerReferences = getOwnerReferences(pod);
    return (
      getNamespace(pod) === getNamespace(vm) &&
      getName(pod).startsWith('kubevirt-v2v-conversion') &&
      podOwnerReferences &&
      podOwnerReferences.some((podOwnerReference) =>
        compareOwnerReference(podOwnerReference, vmOwnerReference),
      )
    );
  });
};

export const getDevices = (vm: VMLikeEntityKind) => {
  const disks = getDisks(asVM(vm)).map((disk) => ({
    type: 'disk',
    typeLabel: _.has(disk, 'cdrom') ? 'CD-ROM' : 'Disc',
    value: disk,
  }));
  const nics = getInterfaces(asVM(vm)).map((nic) => ({
    type: 'interface',
    typeLabel: 'NIC',
    value: nic,
  }));

  return [...disks, ...nics];
};

export const getBootableDevices = (vm: VMLikeEntityKind) => {
  const devices = getDevices(vm).filter((device) => device.value.bootOrder);
  return [...devices];
};

export const getUnBootableDevices = (vm: VMLikeEntityKind) => {
  const devices = getDevices(vm).filter((device) => !device.value.bootOrder);
  return [...devices];
};

export const getBootableDevicesInOrder = (vm: VMLikeEntityKind) =>
  getBootableDevices(vm).sort((a, b) => a.value.bootOrder - b.value.bootOrder);
