"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // Import createPortal
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CustomModal = ({ isOpen, onClose, children, className, title, fullScreen = false }) => { // Added fullScreen prop
  const modalRef = useRef(null);
  const portalRoot = useRef(document.createElement('div')); // Create a div for the portal

  useEffect(() => {
    const currentPortalRoot = portalRoot.current;
    document.body.appendChild(currentPortalRoot); // Append the div to body on mount

    return () => {
      document.body.removeChild(currentPortalRoot); // Clean up on unmount
    };
  }, []);

  // Close modal on Escape key press and manage body scrolling
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // When modal is open, prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; // Restore body scrolling
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = ''; // Ensure scrolling is restored on unmount
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContentClasses = cn(
    "relative bg-background shadow-lg flex flex-col",
    fullScreen
      ? "w-screen h-screen max-w-full max-h-full rounded-none" // Full screen styles
      : "w-full h-full max-w-full max-h-full rounded-none sm:max-h-[95vh] sm:rounded-lg", // Default responsive styles
    className 
  );

  // Render the modal using a portal
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose} // Close when clicking outside the modal content
    >
      <div
        ref={modalRef}
        className={modalContentClasses} // Use the computed classes
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        )}
        {!title && ( // If no title prop, still provide a close button
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        )}
        <div className="flex-grow overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    portalRoot.current // Render into the dynamically created div
  );
};

export default CustomModal;