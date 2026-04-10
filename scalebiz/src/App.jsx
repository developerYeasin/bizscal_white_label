import { Toaster } from "@/components/ui/toaster.jsx";
import { Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary.jsx";

// Import public pages (Index, Login, Register, NotFound)
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

// Import admin pages (existing admin portal)
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import CreateOrder from "./pages/CreateOrder.jsx";
import Products from "./pages/Products.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Categories from "./pages/Categories.jsx";
import Customers from "./pages/Customers.jsx";
import ManageShop from "./pages/ManageShop.jsx";
import ThemeMarketplace from "./pages/ThemeMarketplace.jsx";
import PromoCodes from "./pages/PromoCodes.jsx";
import UsersAndPermissions from "./pages/UsersAndPermissions.jsx";
import Settings from "./pages/Settings.jsx";
import Analytics from "./pages/Analytics.jsx";
import Billing from "./pages/Billing.jsx";
import Subscription from "./pages/Subscription.jsx";
import ZatiqAcademy from "./pages/ZatiqAcademy.jsx";
import VendorDashboard from "./pages/vendor/VendorDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ProductViewPage from "./pages/products/ProductViewPage.jsx";
import ProductEditPage from "./pages/products/ProductEditPage.jsx";
import SubscribeFormPage from "./pages/SubscribeFormPage.jsx";
import CreateStorePage from "./pages/CreateStorePage.jsx";
import ProductLandingPageSettings from "./pages/products/ProductLandingPageSettings.jsx";
import ProductLandingPageViewPage from "./pages/products/ProductLandingPageViewPage.jsx";
import ThemeBuilder from "./pages/ThemeBuilder.jsx";
import ThemeManagement from "./pages/ThemeManagement.jsx";

// Import shop settings pages (nested under SettingsLayout)
import SettingsLayout from "./pages/shop-settings/SettingsLayout.jsx";
import ShopSettingsPage from "./pages/shop-settings/ShopSettingsPage.jsx";
import ShopDomainPage from "./pages/shop-settings/ShopDomainPage.jsx";
import ShopPolicyPage from "./pages/shop-settings/ShopPolicyPage.jsx";
import DeliverySupportPage from "./pages/shop-settings/DeliverySupportPage.jsx";
import PaymentGatewayPage from "./pages/shop-settings/PaymentGatewayPage.jsx";
import SeoMarketingPage from "./pages/shop-settings/SeoMarketingPage.jsx";
import SmsSupportPage from "./pages/shop-settings/SmsSupportPage.jsx";
import ChatSupportPage from "./pages/shop-settings/ChatSupportPage.jsx";
import SocialLinksPage from "./pages/shop-settings/SocialLinksPage.jsx";
import FooterSettingsPage from "./pages/shop-settings/FooterSettingsPage.jsx";
import HeaderSettingsPage from "./pages/shop-settings/HeaderSettingsPage.jsx";

// Import storefront pages and layout
import StorefrontLayout from "./layouts/StorefrontLayout.jsx";
import StorefrontHomePage from "./pages/storefront/HomePage.jsx";
import ProductsPage from "./pages/storefront/ProductsPage.jsx";
import ProductDetailPage from "./pages/storefront/ProductDetailPage.jsx";
import CategoryPage from "./pages/storefront/CategoryPage.jsx";
import CartPage from "./pages/storefront/CartPage.jsx";
import CheckoutPage from "./pages/storefront/CheckoutPage.jsx";
import PageViewPage from "./pages/storefront/PageViewPage.jsx";

// Contexts & Providers
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { StoreConfigurationProvider } from "./contexts/StoreConfigurationContext.jsx";
import { ThemeSettingsProvider } from "./contexts/ThemeSettingsContext.jsx";
import LoadingProgressBar from "./components/LoadingProgressBar.jsx";
import { ThemeProvider } from "next-themes";
import { setUnauthorizedLogoutHandler } from "./utils/api.js";
import { useHasStore } from "./hooks/use-has-store.js";
import RootRedirect from "./components/RootRedirect.jsx";
import Builder from "./pages/builder/Builder.jsx";

const queryClient = new QueryClient();

// ProtectedRoute component
const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
}) => {
  const {
    isAuthenticated,
    loading: authLoading,
    hasPermission,
    hasRole,
  } = useAuth();
  const { hasStore, isLoading: storeLoading } = useHasStore();
  const location = useLocation();

  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading authentication and store status...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Hook to detect mode based on hostname and port
const useMode = () => {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    // Development: allow override via localStorage or query param
    const urlParams = new URLSearchParams(window.location.search);
    const override = urlParams.get("mode") || localStorage.getItem("app_mode");

    if (override === "admin" || override === "storefront") {
      setMode(override);
      return;
    }

    // Port-based detection (primary method)
    const port = window.location.port;
    if (port === "8085") {
      setMode("admin");
      return;
    }
    if (port === "8080") {
      setMode("storefront");
      return;
    }

    // Hostname-based detection fallback
    const hostname = window.location.hostname;
    // Treat subdomains starting with 'admin.' as admin mode.
    // Also, if hostname is exactly 'admin.localhost' for local development.
    const isAdmin =
      hostname.startsWith("admin.") ||
      hostname === "admin.localhost" ||
      hostname === "localhost";
    setMode(isAdmin ? "admin" : "storefront");
  }, []);

  return mode;
};

const AppContent = () => {
  const { logout } = useAuth();
  const mode = useMode();

  console.log("AppContent rendering, mode:", mode);

  useEffect(() => {
    setUnauthorizedLogoutHandler(logout);
  }, [logout]);

  if (mode === null) {
    console.log("Mode is null, showing loading");
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Loading application mode...
          </h1>
          <p className="text-gray-600">Check console for debug info</p>
        </div>
      </div>
    );
  }

  console.log("Mode determined: >>", mode, "rendering routes");

  return (
    <Routes>
      {/* Public routes accessible in both modes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/index" element={<Index />} />

      {/* Admin Mode Routes */}
      {mode === "admin" && (
        <>
          {/* Root redirect for admin */}
          <Route path="/" element={<RootRedirect />} />

          {/* Main Admin Application Layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requiredPermissions={["read_orders"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/create"
              element={
                <ProtectedRoute requiredPermissions={["write_orders"]}>
                  <CreateOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute requiredPermissions={["read_products"]}>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute requiredPermissions={["write_products"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:productId"
              element={
                <ProtectedRoute requiredPermissions={["read_products"]}>
                  <ProductViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:productId/edit"
              element={
                <ProtectedRoute requiredPermissions={["write_products"]}>
                  <ProductEditPage />
                </ProtectedRoute>
              }
            />
            {/* Single Product Landing Pages */}
            <Route
              path="/single-product-pages/edit/:productId"
              element={
                <ProtectedRoute requiredPermissions={["manage_landing_pages"]}>
                  <ProductLandingPageSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/single-product-pages/view/:productId"
              element={
                <ProtectedRoute requiredPermissions={["manage_landing_pages"]}>
                  <ProductLandingPageViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute requiredPermissions={["read_categories"]}>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredPermissions={["read_customers"]}>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-shop"
              element={
                <ProtectedRoute requiredPermissions={["manage_shop_settings"]}>
                  <ManageShop />
                </ProtectedRoute>
              }
            />
            {/* Settings-related Routes with SettingsLayout */}
            <Route element={<SettingsLayout />}>
              <Route
                path="/manage-shop/shop-settings"
                element={
                  <ProtectedRoute requiredPermissions={["edit_shop_settings"]}>
                    <ShopSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/header-settings"
                element={
                  <ProtectedRoute
                    requiredPermissions={["edit_header_settings"]}
                  >
                    <HeaderSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/shop-domain"
                element={
                  <ProtectedRoute requiredPermissions={["edit_shop_domain"]}>
                    <ShopDomainPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/shop-policy"
                element={
                  <ProtectedRoute requiredPermissions={["edit_shop_policy"]}>
                    <ShopPolicyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/delivery-support"
                element={
                  <ProtectedRoute
                    requiredPermissions={["edit_delivery_settings"]}
                  >
                    <DeliverySupportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/payment-gateway"
                element={
                  <ProtectedRoute
                    requiredPermissions={["edit_payment_settings"]}
                  >
                    <PaymentGatewayPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/seo-marketing"
                element={
                  <ProtectedRoute requiredPermissions={["edit_seo_marketing"]}>
                    <SeoMarketingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/sms-support"
                element={
                  <ProtectedRoute requiredPermissions={["edit_sms_settings"]}>
                    <SmsSupportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/chat-support"
                element={
                  <ProtectedRoute requiredPermissions={["edit_chat_settings"]}>
                    <ChatSupportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/social-links"
                element={
                  <ProtectedRoute requiredPermissions={["edit_social_links"]}>
                    <SocialLinksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shop/footer-settings"
                element={
                  <ProtectedRoute
                    requiredPermissions={["edit_footer_settings"]}
                  >
                    <FooterSettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/theme-marketplace"
                element={
                  <ProtectedRoute requiredPermissions={["customize_theme"]}>
                    <ThemeMarketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/theme-builder"
                element={
                  <ProtectedRoute requiredPermissions={["customize_theme"]}>
                    <ThemeBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/themes"
                element={
                  <ProtectedRoute requiredPermissions={["customize_theme"]}>
                    <ThemeManagement />
                  </ProtectedRoute>
                }
              />
              {/* Redirect /single-product-pages to products (landing pages managed from product edit) */}
              <Route
                path="/single-product-pages"
                element={
                  <ProtectedRoute
                    requiredPermissions={["manage_landing_pages"]}
                  >
                    <Navigate to="/products" replace />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="/promo-codes"
              element={
                <ProtectedRoute requiredPermissions={["read_promo_codes"]}>
                  <PromoCodes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users-and-permissions"
              element={
                <ProtectedRoute requiredPermissions={["manage_users"]}>
                  <UsersAndPermissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredPermissions={["access_settings"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute requiredPermissions={["read_analytics"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute requiredPermissions={["read_billing"]}>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute requiredPermissions={["manage_subscription"]}>
                  <Subscription />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscribe-form"
              element={
                <ProtectedRoute requiredPermissions={["manage_subscription"]}>
                  <SubscribeFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/zatiq-academy"
              element={
                <ProtectedRoute requiredPermissions={["access_academy"]}>
                  <ZatiqAcademy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor-dashboard"
              element={
                <ProtectedRoute
                  requiredPermissions={["access_vendor_dashboard"]}
                >
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredPermissions={["access_profile"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-store"
              element={
                <ProtectedRoute>
                  <CreateStorePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </>
      )}

      {/* Custom Pages Route - Outside Layout for full-screen builder experience */}
      <Route
        path="/custom-pages"
        element={
          <ProtectedRoute requiredPermissions={["customize_theme"]}>
            <Builder />
          </ProtectedRoute>
        }
      />

      {/* Storefront Mode Routes */}
      {mode === "storefront" && (
        <React.Fragment>
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<StorefrontHomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pages/:slug" element={<PageViewPage />} />
          </Route>
        </React.Fragment>
      )}

      {/* Global 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LoadingProgressBar />
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <AuthProvider>
            <StoreConfigurationProvider>
              <ThemeSettingsProvider>
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <AppContent />
                </BrowserRouter>
              </ThemeSettingsProvider>
            </StoreConfigurationProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
