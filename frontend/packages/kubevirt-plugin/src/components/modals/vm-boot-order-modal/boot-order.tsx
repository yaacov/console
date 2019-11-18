import * as React from 'react';
import * as _ from 'lodash';
import { HandlePromiseProps, withHandlePromise } from '@console/internal/components/utils';
import { ModalComponentProps } from '@console/internal/components/factory';

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

export const BootOrderModal = withHandlePromise((props: BootOrderModalProps) => {
  const { state, setState } = props;
  const [modeState, setModeState] = React.useState<BootOrderModalModeState>({
    isEditMode: false,
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
    setModeState({ isEditMode: false });

    setState({
      sources,
      options: _.orderBy(options, 'type', 'value.name'),
    });
  };

  const onDelete = (index: number) => {
    const item = state.sources[index];
    delete item.value.bootOrder;

    const sources = [...state.sources.slice(0, index), ...state.sources.slice(index + 1)];
    const options = [...state.options, item];

    relaxSources(sources);
    setModeState({ isEditMode: false });

    setState({
      sources,
      options: _.orderBy(options, ['type', 'value.name']),
    });
  };
  const onMove = (index: number, toIndex: number) => {
    const unMovedSources = [...state.sources.slice(0, index), ...state.sources.slice(index + 1)];
    const sources = [
      ...unMovedSources.slice(0, toIndex),
      state.sources[index],
      ...unMovedSources.slice(toIndex),
    ];

    relaxSources(sources);
    setModeState({ isEditMode: false });
    
    setState({ sources, options: state.options });
  };

  const itemRow: React.FC<{ index: number }> = ({ index }) => {
    const item = state.sources[index];
    return <p>{`${item.value.name} (${item.typeLabel})`}</p>;
  };
  const addItemRow: React.FC<any> = AddItemRowFactory(state.options, addByKey);

  return (
    <>
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
    </>
  );
});

type BootOrderModalModeState = {
  isEditMode: boolean;
};

export type BootOrderModalState = {
  sources: any[];
  options: any[];
};

export type BootOrderModalProps = HandlePromiseProps &
  ModalComponentProps & {
    state: BootOrderModalState,
    setState: (BootOrderModalState) => void;
    onClose?: () => void;
  };
