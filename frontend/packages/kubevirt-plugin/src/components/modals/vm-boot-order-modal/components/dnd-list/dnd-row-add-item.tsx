import * as React from 'react';
import {
  Button,
  Text,
  TextVariants,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
} from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';

export const DNDRowAddItem: React.FC<DNDRowAddItemProps> = ({
  message,
  Component,
  isDisabled,
  isEditMode,
  setEditMode,
  disabledMessage,
}) => {
  const addItemButtonDisabledCells = [
    <DataListCell width={1} key="add item">
      <Text component={TextVariants.p}>{disabledMessage}</Text>
    </DataListCell>,
  ];
  const addItemButtonCells = [
    <DataListCell width={1} key="add item">
      <Button
        className="pf-m-link--align-left"
        id="vm-cd-add-btn"
        variant="link"
        onClick={() => {
          setEditMode(true);
        }}
        icon={<PlusCircleIcon />}
      >
        {message}
      </Button>
    </DataListCell>,
  ];
  const addItemSelectCells = [
    <DataListCell
      isFilled={false}
      key="drag and drop icon"
    />,
    <DataListCell width={1} key="item">
      <Component />
    </DataListCell>,
    <DataListCell
      isFilled={false}
      alignRight
      key="delete icon"
      onClick={() => {
        setEditMode(true);
      }}
      style={{ cursor: 'pointer' }}
    >
      <MinusCircleIcon />
    </DataListCell>,
  ];

  let dataListCells = [];
  if (isDisabled) {
    dataListCells = addItemButtonDisabledCells;
  } else if (isEditMode) {
    dataListCells = addItemSelectCells;
  } else {
    dataListCells = addItemButtonCells;
  }

  return (
    <DataListItem aria-labelledby="dnd list add item">
      <DataListItemRow>
        <DataListItemCells dataListCells={dataListCells} />
      </DataListItemRow>
    </DataListItem>
  );
};

export type DNDRowAddItemProps = {
  message: string;
  Component: React.FC;
  isDisabled: boolean;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  disabledMessage?: string;
};
