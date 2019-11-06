import * as React from 'react';
import * as _ from 'lodash';
import { DataList } from '@patternfly/react-core';
import { PficonDragdropIcon } from '@patternfly/react-icons';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DNDRowAddItem } from './dnd-row-add-item';
import { DNDRow } from './dnd-row';

export const DNDList: React.FC<DNDListProps> = ({
  Component,
  size,
  canAddItem,
  ariaLabel='dnd-list',
  onDelete,
  onMove,
  AddItemComponent,
  addItemMessage,
  addItemIsDisabled,
  AddItemIsEditMode,
  addItemDisabledMessage,
  addItemSetEditMode,
}) => (
  <DndProvider backend={HTML5Backend}>
    <DataList aria-label={ariaLabel}>
      {_.range(size).map((index) => (
        <DNDRow
          Component={Component}
          icon={<PficonDragdropIcon />}
          index={index}
          key={`row-${index}`}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
      {canAddItem && (
        <DNDRowAddItem
          Component={AddItemComponent}
          message={addItemMessage}
          key={`row-add-item`}
          disabledMessage={addItemDisabledMessage}
          isDisabled={addItemIsDisabled}
          isEditMode={AddItemIsEditMode}
          setEditMode={addItemSetEditMode}
        />
      )}
    </DataList>
  </DndProvider>
);

export type DNDListProps = {
  Component: React.FC<{ index: number }>;
  size: number;
  canAddItem: boolean;
  ariaLabel?: string;
  onDelete: (index: number) => void;
  onMove: (index: number, toIndex: number) => void;
  AddItemComponent?: React.FC;
  addItemIsDisabled?: boolean;
  AddItemIsEditMode?: boolean;
  addItemMessage?: string;
  addItemDisabledMessage?: string;
  addItemSetEditMode?: (mode: boolean) => void;
};
