"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import ThemedButton from "@/components/ThemedButton.jsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/context/StoreContext.jsx";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { fetchOrderById, generateInvoicePdf } from "@/lib/api"; // Import fetchOrderById and generateInvoicePdf
import { showLoading, dismissToast, showError, showSuccess } from "@/utils/toast"; // Import toast utilities
import { formatDate } from "@/lib/utils"; // Import formatDate

const OrderConfirmation = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { storeConfig, isLoading: isStoreConfigLoading } = useStore();
  const getPath = useStorePath(); // Initialize useStorePath
  const location = useLocation(); // Get location to read state

  const orderConfirmationPage = storeConfig?.pages?.order_confirmation_page;

  // Extract orderId from location state, if available (e.g., passed from checkout)
  const orderId = location.state?.orderId;

  // Fetch order details if orderId is present
  const {
    data: order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["orderConfirmation", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId, // Only fetch if orderId exists
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (isStoreConfigLoading || isOrderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-lg text-gray-500">{t('loading_order_details')}</p>
      </div>
    );
  }

  if (!storeConfig) {
    return <div>{t('error_loading_store_config')}</div>;
  }

  const handleGeneratePdf = async (actionType) => {
    if (!order || !storeConfig || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    const toastId = showLoading(t('generating_invoice'));

    try {
      const customerAddressParts = [
        order.shipping_address?.address,
        order.shipping_address?.city,
        order.shipping_address?.state,
        order.shipping_address?.zip,
        order.shipping_address?.country,
      ].filter(Boolean);

      const invoiceData = {
        invoiceNumber: order.order_number,
        date: formatDate(order.created_at, 'YYYY-MM-DD'), // Format date for API
        customerName: order.user_name || order.customer_email,
        customerAddress: customerAddressParts.join(", "),
        customerEmail: order.customer_email,
        ownerName: storeConfig.storeConfiguration?.storeName || "Your Store Name",
        ownerAddress: storeConfig.layout?.footer?.storeInfo?.address || "456 Business Ave, Cityville, USA", // Use store config or default
        ownerEmail: storeConfig.layout?.footer?.storeInfo?.email || "info@yourstore.com", // Use store config or default
        logo: storeConfig.storeConfiguration?.logoUrl || "https://res.cloudinary.com/dfsqtffsg/image/upload/v1760101942/kbyfg0vrk8kfbq2jd33k.png",
        qr_url: storeConfig.storeConfiguration?.hostname
          ? `https://${storeConfig.storeConfiguration.hostname}`
          : `https://store.bizscal.com/merchant/${storeConfig.storeConfiguration?.storeId}`,
        items: order.items.map((item) => ({
          image: item.image_url,
          name: item.name,
          quantity: item.quantity,
          id: item.product_id,
          price: parseFloat(item.price_at_purchase),
          variants: item.selected_variants?.map(v => `${v.type}: ${v.value}`).join(', ') || '', // Map variants to string
        })),
        subtotalAmount: parseFloat(order.subtotal_amount),
        taxAmount: parseFloat(order.tax_amount),
        totalAmount: parseFloat(order.total_amount),
        delivery_cost: parseFloat(order.shipping_cost || 0),
      };

      const response = await generateInvoicePdf(order.id, invoiceData);

      if (!response.error && response.pdfUrl) {
        dismissToast(toastId);
        showSuccess(t('invoice_generated_successfully'));
        if (actionType === "download") {
          const link = document.createElement('a');
          link.href = response.pdfUrl;
          link.setAttribute('download', `invoice-${order.order_number}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (actionType === "view") {
          window.open(response.pdfUrl, '_blank');
        }
      } else {
        dismissToast(toastId);
        showError(response.message || t('failed_to_generate_invoice'));
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      dismissToast(toastId);
      showError(t('unexpected_error_generating_invoice'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {storeConfig && (
        <Header layout={storeConfig.layout} storeName={storeConfig.storeConfiguration.storeName} logoUrl={storeConfig.storeConfiguration.logoUrl} />
      )}
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center bg-card p-6 sm:p-8 rounded-lg shadow-md max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dynamic-primary-color" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {orderConfirmationPage?.title || t('order_confirmed')}
          </h1>
          <p className="text-lg text-foreground mb-6">
            {orderConfirmationPage?.description || t('thank_you_purchase')}
          </p>
          {orderConfirmationPage?.is_mail_send && (
            <p className="text-muted-foreground mb-8">
              {t('email_confirmation_sent')}
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 flex-wrap"> {/* Adjusted gap and added flex-wrap */}
            <Link to={getPath("/")}>
              <ThemedButton>
                {t('continue_shopping')}
              </ThemedButton>
            </Link>
            {orderId && (
              <>
                <Link to={getPath(`/receipt/${orderId}`)}>
                  <ThemedButton variant="outline">
                    {t('view_order')}
                  </ThemedButton>
                </Link>
                <ThemedButton
                  onClick={() => handleGeneratePdf("view")}
                  disabled={isGeneratingPdf || !order}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isGeneratingPdf ? t('generating_invoice') : t('view_invoice_pdf')}
                </ThemedButton>
                <ThemedButton
                  onClick={() => handleGeneratePdf("download")}
                  disabled={isGeneratingPdf || !order}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isGeneratingPdf ? t('generating_invoice') : t('download_invoice_pdf')}
                </ThemedButton>
              </>
            )}
          </div>
        </div>
      </main>
      {storeConfig && (
        <Footer layout={storeConfig.layout.footer} copyrightText={storeConfig.layout.footer.copyrightText} socialLinks={storeConfig.layout.footer.socialLinks} logoUrl={storeConfig.storeConfiguration.logoUrl} storeName={storeConfig.storeConfiguration.storeName} />
      )}
    </div>
  );
};

export default OrderConfirmation;