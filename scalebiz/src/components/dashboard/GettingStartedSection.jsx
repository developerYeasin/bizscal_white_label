"use client";

import React from "react";
import GettingStartedCard from "./GettingStartedCard.jsx";
import { Package, Settings, Store } from "lucide-react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useProducts } from "@/hooks/use-products.js";
import { useHasStore } from "@/hooks/use-has-store.js";

const GettingStartedSection = () => {
  const { config, isLoading: configLoading } = useStoreConfig();
  const { products, isLoading: productsLoading } = useProducts();
  const { hasStore, isLoading: hasStoreLoading } = useHasStore();

  const isLoading = configLoading || productsLoading || hasStoreLoading;

  // Derived states for completion status
  const isStoreCreated = hasStore;
  const isProductAdded = products && products.length > 0;
  const isDeliverySetup = config && (
    (config.delivery_settings?.default_charge && parseFloat(config.delivery_settings.default_charge) > 0) ||
    (config.delivery_settings?.zones && config.delivery_settings.zones.length > 0)
  );

  if (isLoading) {
    return (
      <div className="mb-6 space-y-4">
        <GettingStartedCard
          icon={Store}
          title="Loading..."
          description="Checking store status..."
          buttonText="Loading"
          isCompleted={false}
          onActionClick={() => {}}
          disabled={true}
        />
      </div>
    );
  }

  // If products are added, hide the entire Getting Started section
  if (isProductAdded) {
    return null;
  }

  const cardsToRender = [];

  // 1. "Create your store" card - always visible as it's the first step
  cardsToRender.push(
    <GettingStartedCard
      key="create-store"
      icon={Store}
      title={isStoreCreated ? "Your store is ready!" : "Create your store"}
      description={isStoreCreated ? "View your store's basic information and settings." : "Enter key details about your business to get started."}
      buttonText={isStoreCreated ? "View" : "Create"}
      buttonLink={isStoreCreated ? "/manage-shop/shop-settings" : "/create-store"}
      isCompleted={isStoreCreated}
    />
  );

  // 2. "Add your first product" card - only visible if store is created AND no products are added yet
  // This card will always be shown if isProductAdded is false (due to the early return above)
  cardsToRender.push(
    <GettingStartedCard
      key="add-product"
      icon={Package}
      title="Add your first product"
      description="List your first product and start selling in minutes."
      buttonText="Add"
      buttonLink="/products/add"
      isCompleted={false}
    />
  );

  // 3. "Setup delivery charge" card - only visible if store is created AND delivery is not set up yet
  if (isStoreCreated && !isDeliverySetup) {
    cardsToRender.push(
      <GettingStartedCard
        key="setup-delivery"
        icon={Settings}
        title="Setup delivery charge"
        description="Define shipping rates and delivery options for your customers."
        buttonText="Setup"
        buttonLink="/manage-shop/delivery-support"
        isCompleted={false}
      />
    );
  } else if (isStoreCreated && isDeliverySetup) {
    // If delivery is set up, show a completed card for it
    cardsToRender.push(
      <GettingStartedCard
        key="delivery-setup"
        icon={Settings}
        title="Delivery setup"
        description="Your delivery charges and options are configured."
        buttonText="View"
        buttonLink="/manage-shop/delivery-support"
        isCompleted={true}
      />
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {cardsToRender}
    </div>
  );
};

export default GettingStartedSection;