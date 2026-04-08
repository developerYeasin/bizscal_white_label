"use client";

import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/context/StoreContext.jsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ComponentResolver from "@/components/ComponentResolver";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useStorePath } from "@/hooks/use-store-path";
import { showError } from "@/utils/toast.js";
import { apiClient } from "@/lib/api.js";

const StorePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { storeConfig, isLoading: isStoreLoading } = useStore();
  const getPath = useStorePath();

  // Check if we are previewing a custom page from the page builder
  const previewPage = storeConfig?.preview_custom_page;
  const isPreviewMode = previewPage && previewPage.slug === slug;

  const {
    data: apiPageData,
    isLoading: isPageLoading,
    error: pageError,
  } = useQuery({
    queryKey: ["storePage", slug, { preview: !!previewPage }],
    queryFn: async () => {
      if (isPreviewMode) {
        // In preview mode, don't fetch from API; use the preview data
        return null;
      }
      // Normal mode: fetch from backend
      const response = await apiClient.get(`/store/pages/${slug}`);
      return response.data.data.page;
    },
    enabled: !!slug && !isPreviewMode,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Determine which page data to use
  const pageData = useMemo(() => {
    if (isPreviewMode && previewPage) {
      return previewPage;
    }
    return apiPageData;
  }, [isPreviewMode, previewPage, apiPageData]);

  const isLoading = isStoreLoading || (!isPreviewMode && isPageLoading);
  const error = isPreviewMode ? null : pageError;

  useEffect(() => {
    if (pageError) {
      console.error("Page not found:", pageError);
      showError("Page not found.");
      // Optionally navigate to 404
    }
  }, [pageError]);

  // SEO: set document title and meta description
  useEffect(() => {
    if (pageData) {
      document.title = `${pageData.title} | ${storeConfig?.storeConfiguration.storeName || ''}`.trim();
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', pageData.meta_description || '');
      }
    }
  }, [pageData, storeConfig]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          layout={storeConfig?.layout}
          storeName={storeConfig?.storeConfiguration.storeName}
          logoUrl={storeConfig?.storeConfiguration.logoUrl}
          themeId={storeConfig?.storeConfiguration.themeId}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer
          layout={storeConfig?.layout.footer}
          copyrightText={storeConfig?.layout.footer.copyrightText}
          socialLinks={storeConfig?.layout.footer.socialLinks}
          logoUrl={storeConfig?.storeConfiguration.logoUrl}
          storeName={storeConfig?.storeConfiguration.storeName}
        />
      </div>
    );
  }

  if (pageError || !pageData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          layout={storeConfig?.layout}
          storeName={storeConfig?.storeConfiguration.storeName}
          logoUrl={storeConfig?.storeConfiguration.logoUrl}
          themeId={storeConfig?.storeConfiguration.themeId}
        />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">The page you are looking for does not exist.</p>
          <Button onClick={() => navigate("/")}>Go to Homepage</Button>
        </main>
        <Footer
          layout={storeConfig?.layout.footer}
          copyrightText={storeConfig?.layout.footer.copyrightText}
          socialLinks={storeConfig?.layout.footer.socialLinks}
          logoUrl={storeConfig?.storeConfiguration.logoUrl}
          storeName={storeConfig?.storeConfiguration.storeName}
        />
      </div>
    );
  }

  const blocks = pageData.content?.blocks || [];
  const isLegacyHtml = pageData.content && typeof pageData.content === 'string';

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        layout={storeConfig?.layout}
        storeName={storeConfig?.storeConfiguration.storeName}
        logoUrl={storeConfig?.storeConfiguration.logoUrl}
        themeId={storeConfig?.storeConfiguration.themeId}
      />
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={getPath("/")}>Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Title */}
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: `var(--dynamic-primary-color)` }}>
            {pageData.title}
          </h1>
        </div>

        {/* Render Content */}
        <div className="container mx-auto px-4 pb-12">
          {blocks.length > 0 ? (
            // Modern page with blocks
            <ComponentResolver
              components={blocks}
              themeConfig={storeConfig?.theme}
              isStorefront={true}
            />
          ) : isLegacyHtml ? (
            // Legacy page with HTML content
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          ) : (
            // No content
            <div className="text-center py-12 text-muted-foreground">
              <p>This page has no content yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer
        layout={storeConfig?.layout.footer}
        copyrightText={storeConfig?.layout.footer.copyrightText}
        socialLinks={storeConfig?.layout.footer.socialLinks}
        logoUrl={storeConfig?.storeConfiguration.logoUrl}
        storeName={storeConfig?.storeConfiguration.storeName}
      />
    </div>
  );
};

export default StorePage;
