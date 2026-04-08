import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Collection from "./pages/Collection.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import PolicyPage from "./pages/PolicyPage.jsx";
import ProductLandingPage from "./pages/ProductLandingPage.jsx";
import SimpleDetailsProductPage from "./pages/SimpleDetailsProductPage.jsx";
import ReceiptPage from "./pages/ReceiptPage.jsx"; // NEW: Import ReceiptPage
import Contact from "./pages/Contact.jsx";
import StorePage from "./pages/StorePage.jsx";
import StoreLayout from "./components/StoreLayout.jsx";
import React, { useState, useEffect } from "react"; // Import useState, useEffect
import InitializeTrackers from "./components/InitializeTrackers/InitializeTrackers.jsx";
import PageViewTracker from "./components/InitializeTrackers/PageViewTracker.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import NagadPaymentVerify from "./components/payment/NagadPaymentVerify.jsx"; // NEW: Import NagadPaymentVerify
import SslCommerzStatus from "./components/payment/SslCommerzStatus.jsx"; // NEW: Import SslCommerzStatus

const queryClient = new QueryClient();

// Function to define all application routes
const getStoreRoutes = () => (
  <React.Fragment>
    <Route index element={<Index />} /> {/* Use index for the default route */}
    <Route path="products/:productId" element={<ProductDetail />} />
    <Route path="collections/:collectionId" element={<Collection />} />
    <Route path="collections" element={<Collection />} />
    <Route path="cart" element={<Cart />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="order-confirmation" element={<OrderConfirmation />} />
    <Route path="policies/:policyKey" element={<PolicyPage />} />
    <Route
      path="single-product/:id"
      element={<ProductLandingPage />}
    />
    <Route path="receipt/:orderId?" element={<ReceiptPage />} />{" "}
    {/* NEW: Receipt Page Route */}
    <Route path="contact" element={<Contact />} />
    <Route path="pages/:slug" element={<StorePage />} />
    <Route path="*" element={<NotFound />} />
  </React.Fragment>
);

const App = () => {
  const [livePreviewConfig, setLivePreviewConfig] = useState(null); // New state for live preview config

  useEffect(() => {
    const handlePreviewMessage = (event) => {
      if (
        event.origin !== "http://localhost:8080" &&
        event.origin !== "http://localhost:8085" &&
        event.origin !== "https://merchant.bizscal.com" &&
        event.origin !== "https://admin.bizscal.com"
      ) {
        return;
      }

      const { type, payload } = event.data;
      // console.log("LIVE_PREVIEW_UPDATE received:", payload.config);
      if (type === "LIVE_PREVIEW_UPDATE") {
        // Update the livePreviewConfig state with the new config
        setLivePreviewConfig(payload.config);
      }
    };

    window.addEventListener("message", handlePreviewMessage);
    return () => window.removeEventListener("message", handlePreviewMessage);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <CartProvider>
        <InitializeTrackers />
        <BrowserRouter>
          <PageViewTracker />
          <ScrollToTop />
          <Routes>
            {/* Routes for payment callbacks, outside StoreLayout */}
            <Route
              path="/payment/nagad/verify"
              element={<NagadPaymentVerify />}
            />
            <Route
              path="/payment/success"
              element={<SslCommerzStatus status="success" />}
            />
            <Route
              path="/payment/fail"
              element={<SslCommerzStatus status="fail" />}
            />

            <Route
              path="/merchant/:storeId/*"
              element={<StoreLayout livePreviewConfig={livePreviewConfig} />}
            >
              {" "}
              {/* Pass livePreviewConfig */}
              {getStoreRoutes()}
            </Route>
            <Route
              path="/*"
              element={<StoreLayout livePreviewConfig={livePreviewConfig} />}
            >
              {" "}
              {/* Pass livePreviewConfig */}
              {getStoreRoutes()}
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
