import * as React from 'react';
import * as PropTypes from 'prop-types';

export const BootOrder = ({ bootableDevices }) => {
  const listItems = bootableDevices.map((dev, idx) => (
    <li>{dev.value.name}</li>
  ));

  return <ol className="kubevirt-boot-order__list">{listItems}</ol>;
};

BootOrder.propTypes = {
  bootableDevices: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};
