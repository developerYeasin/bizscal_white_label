"use client";

import React, { Suspense, lazy, useEffect } from "react"; // Import useEffect
import { MadeWithMaxbles } from "@/components/made-with-Maxbles"; // Updated import
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/context/StoreContext.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import { useTranslation } from "react-i18next"; // Import useTranslation

const ComponentResolver = lazy(() =>
  import("@/components/ComponentResolver.jsx")
);
const CategorySidebar = lazy(() => import("@/components/CategorySidebar.jsx"));
const AllProductsSection = lazy(() => import("@/components/AllProductsSection.jsx")); // New: Import AllProductsSection

const Index = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { storeConfig, isLoading, error } = useStore();
  const navigate = useNavigate(); // Initialize useNavigate
  const getPath = useStorePath(); // Initialize useStorePath

  useEffect(() => {
    if (!isLoading && (error || !storeConfig || !storeConfig.storeConfiguration || !storeConfig.layout)) {
      console.error("Store configuration failed to load or is incomplete:", error || "No config data.");
      navigate(getPath("/404")); // Redirect to NotFound page
    }
  }, [isLoading, error, storeConfig, navigate, getPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('loading_store')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            {t('please_wait_store_config')}
          </p>
        </div>
      </div>
    );
  }

  // If we reach here and there's an error, it means the useEffect already triggered a redirect.
  // So, we only proceed if storeConfig is valid.
  if (!storeConfig || !storeConfig.storeConfiguration || !storeConfig.layout) {
    return null; // Or a minimal loading/error state if the redirect hasn't fully processed yet
  }

  const { layout, pages, storeConfiguration } = storeConfig;
  const themeId = storeConfiguration?.themeId;

  let landingPageComponents =
    [
      ...pages?.landingPage?.components,
      { data: [], type: "categorySidebar" },
    ] || [];

  // Apply theme-specific overrides for productCardStyle
  if (themeId === "premium" || themeId === "diamond") {
    landingPageComponents = landingPageComponents.map((component) => {
      if (component.type === "productSection") {
        return {
          ...component,
          data: { ...component.data, productCardStyle: "multiView" },
        };
      }
      return component;
    });
  }

  // Separate HeroSlider and CategorySidebar for the premium theme's specific layout
  const heroSliderComponent = landingPageComponents.find(
    (comp) => comp.type === "heroBannerSlider"
  );
  const categorySidebarComponent = landingPageComponents.find(
    (comp) => comp.type === "categorySidebar"
  );
  const otherLandingPageComponents = landingPageComponents.filter(
    (comp) =>
      comp.type !== "heroBannerSlider" && comp.type !== "categorySidebar"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        layout={layout}
        storeName={storeConfiguration.storeName}
        logoUrl={storeConfiguration.logoUrl}
        themeId={themeId}
      />
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <p className="text-lg text-gray-500">{t('loading_page_content')}</p>
            </div>
          }
        >
          {/* Render HeroSlider and CategorySidebar in a specific layout for Premium theme */}
          {themeId === "premium" &&
          (heroSliderComponent || categorySidebarComponent) ? (
            <div className=" px-0 lg:px-6">
              <div className="container mx-auto !px-0 lg:px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4">
                {/* Left Column: Category Sidebar */}
                <div className="hidden lg:block lg:col-span-1 border-l border-b border-border">
                  {categorySidebarComponent && (
                    <ComponentResolver
                      type={categorySidebarComponent.type}
                      data={categorySidebarComponent.data}
                    />
                  )}
                </div>
                {/* Right Column: Hero Slider */}
                <div className="col-span-full lg:col-span-3">
                  {heroSliderComponent && (
                    <ComponentResolver
                      type={heroSliderComponent.type}
                      data={heroSliderComponent.data}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            // If not premium theme, or premium theme without these specific components,
            // render heroSliderComponent if it exists, outside the grid layout.
            heroSliderComponent && (
              <ComponentResolver
                type={heroSliderComponent.type}
                data={heroSliderComponent.data}
              />
            )
          )}

          {/* Conditional rendering for 'primary' theme with empty components */}
          {themeId === "primary" && otherLandingPageComponents.length === 0 ? (
            <AllProductsSection productCardStyle={storeConfig.theme?.productCardStyle} />
          ) : (
            // Render all other landing page components as usual
            otherLandingPageComponents.map((component, index) => (
              <ComponentResolver
                key={index}
                type={component.type}
                data={component.data}
              />
            ))
          )}
        </Suspense>
      </main>
      <Footer
        layout={layout.footer}
        copyrightText={layout.footer.copyrightText}
        socialLinks={layout.footer.socialLinks}
        logoUrl={storeConfiguration.logoUrl}
        storeName={storeConfiguration.storeName}
      />
      {/* <MadeWithMaxbles /> */}
    </div>
  );
};

export default Index;