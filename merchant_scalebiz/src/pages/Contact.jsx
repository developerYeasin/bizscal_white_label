import React from 'react';
import ContactForm from '../components/ContactForm';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useStore } from '../context/StoreContext';

const Contact = () => {
  const { storeConfig } = useStore();

  if (!storeConfig || !storeConfig.storeConfiguration || !storeConfig.layout) {
    return null; // Or a loading spinner
  }

  const { layout, storeConfiguration } = storeConfig;
  const themeId = storeConfiguration?.themeId;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        layout={layout}
        storeName={storeConfiguration.storeName}
        logoUrl={storeConfiguration.logoUrl}
        themeId={themeId}
      />
      <main className="flex-grow">
        <div className="container mx-auto py-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
          <ContactForm />
        </div>
      </main>
      <Footer
        layout={layout.footer}
        copyrightText={layout.footer.copyrightText}
        socialLinks={layout.footer.socialLinks}
        logoUrl={storeConfiguration.logoUrl}
        storeName={storeConfiguration.storeName}
      />
    </div>
  );
};

export default Contact;