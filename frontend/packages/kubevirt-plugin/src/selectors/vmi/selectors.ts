import { VirtualMachineInstanceModel } from '../../models';
import { VMIKind } from '../../types/vm';
import { getConsoleAPIBase } from '../../utils/url';
import { getName, getNamespace } from '../selectors';

export const getVMISubresourcePath = (vmi: VMIKind) =>
  `${getConsoleAPIBase()}/apis/subresources.${vmi.apiVersion}/namespaces/${getNamespace(vmi)}/${
    VirtualMachineInstanceModel.plural
  }/${getName(vmi)}`;
