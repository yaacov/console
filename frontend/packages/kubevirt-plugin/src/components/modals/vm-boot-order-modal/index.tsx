import * as React from 'react';
import * as _ from 'lodash';
import {
  createModal,
  CreateModalLauncher,
  GetModalContainer,
} from '@console/internal/components/factory';
import { BootOrderModal } from './boot-order';

// NOTE(yaacov): a hack to show PF4 modals, should be replaced once all
// modals use PF4.
const createModalLauncher: CreateModalLauncher = (Component) => (props) => {
  const getModalContainer: GetModalContainer = (onClose) => (
    <Component {..._.omit({ ...props, onClose }, 'blocking', 'modalClassName') as any} />
  );
  return createModal(getModalContainer);
};

export const VMBootOrderModal = createModalLauncher(BootOrderModal);
