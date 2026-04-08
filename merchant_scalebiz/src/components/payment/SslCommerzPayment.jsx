"use client";

import React, { useState } from 'react';
import { apiClient } from '@/lib/api'; // Use existing apiClient
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import ThemedButton from '@/components/ThemedButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStorePath } from '@/hooks/use-store-path';

const SslCommerzPayment = ({ amount, orderId, customerInfo, onPaymentSuccess, onPaymentFailure }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPath = useStorePath();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    const toastId = showLoading(t('initiating_sslcommerz_payment'));
    try {
      const { data } = await apiClient.post('/payment/init', { // Assuming /payment/init is for SSLCommerz
        amount: amount,
        orderId: orderId, // Pass the temporary orderId from checkout form submission
        customerName: customerInfo.firstName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        // Add other necessary customer/shipping info for SSLCommerz
        shippingAddress: customerInfo.address,
        shippingCity: customerInfo.city,
        shippingState: customerInfo.state,
        shippingZip: customerInfo.zip,
        shippingCountry: customerInfo.country,
        successUrl: `${window.location.origin}${getPath('/payment/success')}`,
        failUrl: `${window.location.origin}${getPath('/payment/fail')}`,
        cancelUrl: `${window.location.origin}${getPath('/payment/fail')}`, // Use fail for cancel too
      });

      dismissToast(toastId);

      if (data.gatewayURL) {
        window.location.href = data.gatewayURL; // Redirect to SSLCommerz payment page
      } else {
        showError(t('could_not_initiate_sslcommerz_payment'));
        onPaymentFailure();
      }
    } catch (err) {
      dismissToast(toastId);
      const errorMessage = err.response?.data?.error || t('sslcommerz_payment_initiation_failed');
      showError(errorMessage);
      onPaymentFailure();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedButton 
      onClick={handlePayment} 
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isLoading ? t('processing') : t('pay_with_card_mobile')}
    </ThemedButton>
  );
};

export default SslCommerzPayment;