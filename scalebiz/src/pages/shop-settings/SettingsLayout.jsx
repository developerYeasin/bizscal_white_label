"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
// Removed StoreConfigurationProvider and ThemeSettingsProvider as they are now in App.jsx

const SettingsLayout = () => {
  return (
    <Outlet />
  );
};

export default SettingsLayout;