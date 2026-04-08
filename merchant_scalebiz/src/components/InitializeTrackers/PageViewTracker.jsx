// src/components/PageViewTracker.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactPixel from 'react-facebook-pixel';
// Removed import for react-tiktok-pixel as it's now manually integrated

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // This will run on the initial load and every time the URL changes
    
    // GTM dataLayer push for pageview
    window.dataLayer?.push({
      event: 'pageview',
      page: location.pathname + location.search
    });

    // Facebook Pixel pageview
    ReactPixel.pageView();

    // NEW: TikTok Pixel pageview
    if (window.ttq) {
      window.ttq.page();
    }

  }, [location]); // Re-run the effect when location changes

  return null;
};

export default PageViewTracker;