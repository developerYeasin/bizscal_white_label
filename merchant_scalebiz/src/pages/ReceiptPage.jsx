"use client";

import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderById } from "@/lib/api.js";
import { useStore } from "@/context/StoreContext.jsx";
import { useTranslation } from "react-i18next";
import { formatPrice, formatDate } from "@/lib/utils";
import ThemedButton from "@/components/ThemedButton";

const ReceiptPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const { storeConfig, isLoading: isStoreLoading, currentCurrency, currencyConversionRate } = useStore();
  const qrCodeRef = useRef(null);

  const {
    data: order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  });

  // Dynamically load QRCode.js library
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.QRCode) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.onload = () => {
        // console.log("QRCode.js loaded successfully.");
        // Attempt to generate QR code after script loads and order data is available
        if (order && qrCodeRef.current) {
          generateQrCode(order.order_number);
        }
      };
      script.onerror = (e) => console.error("Failed to load QRCode.js:", e);
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else if (order && qrCodeRef.current) {
      // If script is already loaded, generate QR code directly
      generateQrCode(order.order_number);
    }
  }, [order]);

  const generateQrCode = (text) => {
    if (window.QRCode && qrCodeRef.current) {
      // Clear previous QR code if any
      qrCodeRef.current.innerHTML = ''; 
      new window.QRCode(qrCodeRef.current, {
        text: text,
        width: 170,
        height: 170,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H,
      });
    }
  };

  if (isStoreLoading || isOrderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-lg text-gray-500">{t('loading_order_details')}</p>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900 p-4">
        <p className="text-lg text-red-600">{t('order_not_found')}</p>
        <Link to="/" className="ml-4">
          <ThemedButton>{t('back_to_home')}</ThemedButton>
        </Link>
      </div>
    );
  }
// console.log("storeConfig?.storeConfiguration?.logoUrl:", storeConfig);
  const invoiceData = {
    logo: storeConfig?.storeConfiguration?.logoUrl || "https://placehold.co/144x40/e2e8f0/64748b?text=Logo",
    invoiceNumber: order.order_number,
    date: formatDate(order.created_at),
    ownerName: storeConfig?.storeConfiguration?.storeName || "Your Store Name",
    ownerAddress: storeConfig?.layout?.footer?.storeInfo?.address || "123 Store St, City, Country",
    ownerEmail: storeConfig?.layout?.footer?.storeInfo?.email || "info@yourstore.com",
    customerName: order.user_name || order.customer_email,
    customerAddress: `${order.shipping_address?.address || 'N/A'}, ${order.shipping_address?.city || 'N/A'}, ${order.shipping_address?.state || 'N/A'}, ${order.shipping_address?.country || 'N/A'}`,
    customerEmail: order.customer_email,
    items: order.items.map(item => ({
      id: item.product_id,
      name: item.name,
      image: item.image_url || PLACEHOLDER_IMAGE_URL,
      quantity: item.quantity,
      price: parseFloat(item.price_at_purchase || 0),
      variants: item.selected_variants?.map(v => `${v.type}: ${v.value}`).join(', ') || '',
    })),
    subtotal: parseFloat(order.subtotal_amount || 0),
    delivery_cost: parseFloat(order.shipping_cost || 0),
    totalAmount: parseFloat(order.total_amount || 0),
    qr_url: order.order_number, // QR code will encode the order number
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="print-container max-w-4xl mx-auto bg-white p-6 sm:p-10 shadow-lg rounded-lg border border-gray-200">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start pb-6 mb-8 border-b border-gray-200">
          {/* Logo */}
          <div className="mb-6 sm:mb-0">
            <img
              src={storeConfig?.storeConfiguration?.logoUrl}
              // src={invoiceData.logoUrl}
              alt={`${invoiceData.ownerName} Logo`}
              className="w-36"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/144x40/e2e8f0/64748b?text=Logo"; }}
            />
          </div>

          {/* Invoice Title and Details */}
          <div className="text-left sm:text-right">
            <h2 className="text-4xl font-bold uppercase text-gray-800 tracking-tight">
              {t('invoice')}
            </h2>
            <div className="mt-4 text-gray-600 space-y-1">
              <p className="flex sm:justify-end items-center">
                <span className="font-semibold w-28 text-gray-500">{t('invoice_hash')}:</span>
                <span className="font-medium text-gray-800">{invoiceData.invoiceNumber}</span>
              </p>
              <p className="flex sm:justify-end items-center">
                <span className="font-semibold w-28 text-gray-500">{t('date')}:</span>
                <span className="font-medium text-gray-800">{invoiceData.date}</span>
              </p>
            </div>
          </div>
        </header>

        {/* From/To Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              {t('from')}:
            </h3>
            <p className="text-lg font-bold text-gray-800">{invoiceData.ownerName}</p>
            <p className="text-gray-600 text-sm">{invoiceData.ownerAddress}</p>
            <p className="text-gray-600 text-sm">{invoiceData.ownerEmail}</p>
          </div>
          <div className="sm:text-right">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              {t('bill_to')}:
            </h3>
            <p className="text-lg font-bold text-gray-800">{invoiceData.customerName}</p>
            <p className="text-gray-600 text-sm">{invoiceData.customerAddress}</p>
            <p className="text-gray-600 text-sm">{invoiceData.customerEmail}</p>
          </div>
        </section>

        {/* Items Table */}
        <section>
          <div className="flow-root border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    {t('item')}
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    {t('qty')}
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    {t('unit_price')}
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    {t('total')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/e2e8f0/64748b?text=No+Image"; }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.variants && (
                            <div className="text-xs text-gray-500">
                              {item.variants}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            ID: {item.id}
                          </div>
                          {/* Mobile-only details */}
                          <div className="sm:hidden text-gray-600 text-xs mt-1">
                            {t('qty')}: {item.quantity} @ {formatPrice(item.price, currentCurrency, currencyConversionRate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-right text-sm text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-right text-sm text-gray-600">
                      {formatPrice(item.price, currentCurrency, currencyConversionRate)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-gray-800">
                      {formatPrice(item.quantity * item.price, currentCurrency, currencyConversionRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals Section */}
        <section className="mt-8">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            {/* QR Code */}
            <div className="mt-6 sm:mt-0 flex-shrink-0">
              <div
                id="qrcode"
                ref={qrCodeRef}
                className="w-40 h-40 flex items-center justify-center border border-gray-200 p-2 rounded-lg"
              ></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 max-w-xl ml-auto">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">{t('subtotal')}</span>
                  <span className="font-medium">{formatPrice(invoiceData.subtotal, currentCurrency, currencyConversionRate)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">{t('delivery_cost')}</span>
                  <span className="font-medium">{formatPrice(invoiceData.delivery_cost, currentCurrency, currencyConversionRate)}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>{t('total')}</span>
                  <span className="text-indigo-600">{formatPrice(invoiceData.totalAmount, currentCurrency, currencyConversionRate)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer / Notes */}
        <footer className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-start">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {t('thank_you_business')}
            </h4>
            <p className="text-sm text-gray-500 max-w-md">
              {t('payment_info')}
            </p>
          </div>
          <div className="mt-6 sm:mt-0 no-print">
            <ThemedButton onClick={handlePrint}>
              {t('print_invoice')}
            </ThemedButton>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReceiptPage;