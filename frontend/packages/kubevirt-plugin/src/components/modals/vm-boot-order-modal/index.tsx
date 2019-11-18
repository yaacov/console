import * as React from 'react';
import * as _ from 'lodash';
import { Modal, Button } from '@patternfly/react-core';
import {
  createModal,
  CreateModalLauncher,
  GetModalContainer,
} from '@console/internal/components/factory';
import { BootOrderModal } from './boot-order';
import { getBootableDevicesInOrder, getUnBootableDevices } from '../../../selectors/vm/combined';
import { VMLikeEntityKind } from '../../../types';
import { PatchBuilder, PatchOperation } from '../../../k8s/utils/patch';
import { getVMLikePatches } from '../../../k8s/patches/vm-template';
import { getVMLikeModel } from '../../../selectors/vm';
import { k8sPatch } from '@console/internal/module/k8s';

// Make sure boot order is relaxed.
const relaxSources = (sources: any[]) => {
  sources.forEach((source, i) => {
    source.value.bootOrder = i + 1;
  });
};

// Get bootable devices in order and relax the bootorder indexs to 1..<Length>.
const getSources = (vmLikeEntity: VMLikeEntityKind): any[] => {
  const sources = _.cloneDeep(getBootableDevicesInOrder(vmLikeEntity));
  relaxSources(sources);

  return sources;
};

// Get un bootable devices as options for adding new boot sources.
const getOptions = (vmLikeEntity: VMLikeEntityKind): any[] =>
  _.cloneDeep(getUnBootableDevices(vmLikeEntity));

// NOTE(yaacov): a hack to show PF4 modals, should be replaced once all
// modals use PF4.
const createModalLauncher: CreateModalLauncher = (Component) => (props: any) => {
  const getModalContainer: GetModalContainer = (onClose) => {
    const { vmLikeEntity, handlePromise } = props;

    const [state, setState] = React.useState<BootOrderModalState>({
      sources: getSources(vmLikeEntity),
      options: getOptions(vmLikeEntity),
    });

    const submit = async (e) => {
      e.preventDefault();

      const getDisks = () => [
        ..._.filter(state.sources, (source) => source.type === 'disk').map(
          (source) => source.value,
        ),
        ..._.filter(state.options, (option) => option.type === 'disk').map(
          (option) => option.value,
        ),
      ];
      const getInterfaces = () => [
        ..._.filter(state.sources, (source) => source.type === 'interface').map(
          (source) => source.value,
        ),
        ..._.filter(state.options, (option) => option.type === 'interface').map(
          (option) => option.value,
        ),
      ];

      const patches = [
        new PatchBuilder('/spec/template/spec/domain/devices/disks')
          .setOperation(PatchOperation.REPLACE)
          .setValue(getDisks())
          .build(),
        new PatchBuilder('/spec/template/spec/domain/devices/interfaces')
          .setOperation(PatchOperation.REPLACE)
          .setValue(getInterfaces())
          .build(),
      ];
      const promise = k8sPatch(
        getVMLikeModel(vmLikeEntity),
        vmLikeEntity,
        getVMLikePatches(vmLikeEntity, () => patches),
      );
      handlePromise(promise).then(onClose); // eslint-disable-line promise/catch-or-return
    };

    return (
      <Modal
        title="Virtual machine boot order"
        isOpen
        isSmall
        onClose={onClose}
        actions={[
          <Button key="confirm" variant="primary" onClick={submit}>
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={onClose}>
            Cancel
          </Button>,
        ]}
        isFooterLeftAligned
      >
        <Component {..._.omit({ ...props, onClose }, 'blocking', 'modalClassName') as any} />
      </Modal>
    );
  };
  return createModal(getModalContainer);
};

type BootOrderModalState = {
  sources: any[];
  options: any[];
};

export const VMBootOrderModal = createModalLauncher(BootOrderModal);
