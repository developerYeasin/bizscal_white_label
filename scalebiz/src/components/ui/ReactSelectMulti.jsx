"use client";

import React from 'react';
import Select from 'react-select';

const ReactSelectMulti = ({ options, value, onChange, placeholder, isLoading, isDisabled, menuPortalTarget, styles, ...props }) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isLoading={isLoading}
      isDisabled={isDisabled}
      menuPortalTarget={menuPortalTarget}
      styles={styles}
      {...props} // Ensure all other props are passed
    />
  );
};

export default ReactSelectMulti;