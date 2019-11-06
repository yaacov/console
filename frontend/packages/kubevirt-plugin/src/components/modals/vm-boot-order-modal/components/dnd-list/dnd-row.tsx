import * as React from 'react';
import { MinusCircleIcon } from '@patternfly/react-icons';
import {
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
} from '@patternfly/react-core';
import { useDrag, useDrop } from 'react-dnd';

const DNDRowTypeName = 'dnd-row';
const DNDRowDragHandleStyle = { cursor: 'move' };
const DNDRowDeleteStyle = { cursor: 'pointer' };

export const DNDRow: React.FC<DNDRowProps> = ({ Component, icon, index, onDelete, onMove }) => {
  const [, drag, preview] = useDrag({
    item: { type: DNDRowTypeName, id: `${DNDRowTypeName}-${index}`, index },
  });

  const [{ opacity }, drop] = useDrop({
    accept: DNDRowTypeName,
    collect: (monitor) => ({
      opacity: monitor.isOver() ? 0 : 1,
    }),
    hover(item: any) {
      if (item.index === index) {
        return;
      }

      onMove(item.index, index);
      item.index = index;
    },
  });

  return (
    <div ref={(node) => preview(drop(node))} style={{ opacity }}>
      <DataListItem
        aria-labelledby="dnd list item"
      >
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell
                isFilled={false}
                key="dnd icon"
              >
                <div ref={drag} style={DNDRowDragHandleStyle}>
                  {icon}
                </div>
              </DataListCell>,
              <DataListCell width={1} key="item">
                <Component index={index} />
              </DataListCell>,
              <DataListCell
                isFilled={false}
                alignRight
                key="delete icon"
                onClick={() => onDelete(index)}
                style={DNDRowDeleteStyle}
              >
                <MinusCircleIcon />
              </DataListCell>,
            ]}
          />
        </DataListItemRow>
      </DataListItem>
    </div>
  );
};

export type DNDRowProps = {
  Component: React.FC<{ index: number }>;
  index: number;
  icon: React.ReactNode;
  onDelete: (index: number) => void;
  onMove: (index: number, toIndex: number) => void;
};
