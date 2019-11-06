import * as React from 'react';
import * as _ from 'lodash';
import { HandlePromiseProps, withHandlePromise } from '@console/internal/components/utils';
import { ModalComponentProps } from '@console/internal/components/factory';
import { k8sPatch } from '@console/internal/module/k8s';
import { Modal, Button } from '@patternfly/react-core';
import { VMLikeEntityKind } from '../../../types';
import { getBootableDevicesInOrder, getUnBootableDevices } from '../../../selectors/vm/combined';
import { getVMLikeModel } from '../../../selectors/vm';
import { PatchBuilder, PatchOperation } from '../../../k8s/utils/patch';
import { getVMLikePatches } from '../../../k8s/patches/vm-template';

import { Empty } from './empty';
import { DNDList } from './components/dnd-list';
import { FormSelect, FormSelectOption } from '@patternfly/react-core';

// Factory to create an "Add item" row component.
const AddItemRowFactory = (
  options: any[],
  addByKey: (key: string) => void,
): React.FC => () => (
  <FormSelect
    value=""
    id="boot-order-select"
    // addByKey moves items from the options list to the sources list,
    // item is itentified by key = "<type>-<name>".
    onChange={addByKey}
  >
    <FormSelectOption label="Please select a boot source" value="" />
    {options.map((option) => (
      <FormSelectOption
        label={`${option.value.name} (${option.typeLabel})`}
        value={`${option.type}-${option.value.name}`}
      />
    ))}
  </FormSelect>
);

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

export const BootOrderModal = withHandlePromise((props: BootOrderModalProps) => {
  const { vmLikeEntity, handlePromise, onClose } = props;
  const [state, setState] = React.useState<BootOrderModalState>({
    sources: getSources(vmLikeEntity),
    options: getOptions(vmLikeEntity),
  });
  const [modeState, setModeState] = React.useState<BootOrderModalModeState>({
    isEditMode: false,
  });
  const [changedState, setChangedState] = React.useState<BootOrderModalChangedState>({
    changed: false,
  });

  // Update component edit mode.
  const setEditMode = (mode: boolean): void => {
    setModeState({
      isEditMode: mode,
    });
  };

  // Move an item form the options list to the sources list, item key is "<type>->name>".
  const addByKey = (key: string): void => {
    const item = _.find(state.options, (option) => `${option.type}-${option.value.name}` === key);

    const options = _.filter(
      state.options,
      (option) => `${option.type}-${option.value.name}` !== key,
    );
    const sources = [...state.sources, item];

    relaxSources(sources);
    setState({
      sources,
      options: _.orderBy(options, 'type', 'value.name'),
    });
    setChangedState({ changed: true });
    setModeState({ isEditMode: false });
  };

  const onDelete = (index: number) => {
    const item = state.sources[index];
    delete item.value.bootOrder;

    const sources = [...state.sources.slice(0, index), ...state.sources.slice(index + 1)];
    const options = [...state.options, item];

    relaxSources(sources);
    setState({
      sources,
      options: _.orderBy(options, ['type', 'value.name']),
    });
    setChangedState({ changed: true });
    setModeState({ isEditMode: false });
  };
  const onMove = (index: number, toIndex: number) => {
    const unMovedSources = [...state.sources.slice(0, index), ...state.sources.slice(index + 1)];
    const sources = [
      ...unMovedSources.slice(0, toIndex),
      state.sources[index],
      ...unMovedSources.slice(toIndex),
    ];

    relaxSources(sources);
    setState({ sources, options: state.options });
    setChangedState({ changed: true });
    setModeState({ isEditMode: false });
  };

  const submit = async (e) => {
    e.preventDefault();

    const getDisks = () => [
      ..._.filter(state.sources, (source) => source.type === 'disk').map((source) => source.value),
      ..._.filter(state.options, (option) => option.type === 'disk').map((option) => option.value),
    ];
    const getInterfaces = () => [
      ..._.filter(state.sources, (source) => source.type === 'interface').map(
        (source) => source.value,
      ),
      ..._.filter(state.options, (option) => option.type === 'interface').map(
        (option) => option.value,
      ),
    ];

    if (changedState.changed) {
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
    } else {
      onClose();
    }
  };

  const itemRow: React.FC<{ index: number }> = ({ index }) => {
    const item = state.sources[index];
    return <p>{`${item.value.name} (${item.typeLabel})`}</p>;
  };
  const addItemRow: React.FC<any> = AddItemRowFactory(state.options, addByKey);

  return (
    <Modal
      title="Virtual machine boot order"
      isOpen
      isSmall
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={submit} isDisabled={!changedState.changed}>
          Save
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
      isFooterLeftAligned
    >
      {_.size(state.sources) === 0 && !modeState.isEditMode ? (
        <Empty
          onAdd={() => {
            setEditMode(true);
          }}
          addItemMessage="Add source"
          addItemDisabledMessage="All sources selected"
          addItemIsDisabled={_.size(state.options) === 0}
        />
      ) : (
        <DNDList
          Component={itemRow}
          size={_.size(state.sources)}
          canAddItem
          ariaLabel="vm boot order"
          onDelete={onDelete}
          onMove={onMove}
          AddItemComponent={addItemRow}
          AddItemIsEditMode={modeState.isEditMode}
          addItemMessage="Add source"
          addItemDisabledMessage="All sources selected"
          addItemIsDisabled={_.size(state.options) === 0}
          addItemSetEditMode={setEditMode}
        />
      )}
    </Modal>
  );
});

type BootOrderModalState = {
  sources: any[];
  options: any[];
};

type BootOrderModalModeState = {
  isEditMode: boolean;
};

type BootOrderModalChangedState = {
  changed: boolean;
};

export type BootOrderModalProps = HandlePromiseProps &
  ModalComponentProps & {
    vmLikeEntity: VMLikeEntityKind;
    onClose?: () => void;
  };
