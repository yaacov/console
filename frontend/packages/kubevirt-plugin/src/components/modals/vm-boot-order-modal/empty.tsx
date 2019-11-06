import * as React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
  Alert,
} from '@patternfly/react-core';

export const Empty: React.FC<EmptyProps> = ({
  onAdd,
  addItemMessage,
  addItemIsDisabled,
  addItemDisabledMessage: disableAddItemMessage,
}) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <Title headingLevel="h5" size="lg">
      No resource selected
    </Title>
    <EmptyStateBody>
      VM will attempt to boot from disks by order of apearance in YAML file
    </EmptyStateBody>
    {!addItemIsDisabled ? (
      <Button variant="primary" onClick={onAdd}>
        {addItemMessage}
      </Button>
    ) : (
      <Alert variant="info" title={disableAddItemMessage} />
    )}
  </EmptyState>
);

export type EmptyProps = {
  onAdd: () => void;
  addItemMessage: string;
  addItemIsDisabled: boolean;
  addItemDisabledMessage?: string;
};
