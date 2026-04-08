"use client";

import React from 'react';
import NProgress from 'nprogress';
import { useIsFetching } from '@tanstack/react-query';
import 'nprogress/nprogress.css'; // Import NProgress styles

// Configure NProgress (optional, but good for consistency)
NProgress.configure({ showSpinner: false });

const LoadingProgressBar = () => {
  const isFetching = useIsFetching();

  React.useEffect(() => {
    if (isFetching > 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching]);

  return null; // This component doesn't render anything itself, NProgress handles the UI
};

export default LoadingProgressBar;