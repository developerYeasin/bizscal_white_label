"use client";

import React, { useState, useEffect } from "react";

const AnnouncementBar = ({ message, backgroundColor, textColor }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem('announcementDismissed');
    if (!hasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('announcementDismissed', 'true');
  };

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className="announcement-bar flex justify-between items-center py-1.5 px-4 text-sm font-medium" style={{ backgroundColor: backgroundColor, color: textColor }}>
      <span className="announcement-text flex-grow text-center">{message}</span>
      <button onClick={handleClose} className="close-button bg-transparent border-none text-current text-xl leading-none cursor-pointer p-0 opacity-80 hover:opacity-100 transition-opacity" aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
};

export default AnnouncementBar;