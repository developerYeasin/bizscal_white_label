import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";
import React, { useState, useEffect } from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const Root = () => {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setI18nReady(true);
    } else {
      i18n.on('initialized', () => {
        setI18nReady(true);
      });
    }
    return () => {
      i18n.off('initialized');
    };
  }, []);

  if (!i18nReady) {
    return <div>Loading translations...</div>;
  }

  return (
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </React.StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Root />);