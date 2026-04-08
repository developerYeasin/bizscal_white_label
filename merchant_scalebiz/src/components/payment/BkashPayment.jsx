"use client";

import React, { useState } from 'react';
import { useBkash } from 'react-bkash';
import { apiClient } from '@/lib/api'; // Use existing apiClient
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import ThemedButton from '@/components/ThemedButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStorePath } from '@/hooks/use-store-path';

const BkashPayment = ({ amount, orderId, customerInfo, onPaymentSuccess, onPaymentFailure }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPath = useStorePath();
  const [isLoading, setIsLoading] = useState(false);

  const { triggerBkash } = useBkash({
    onSuccess: (data) => {
      // console.log('bKash Payment Success!', data);
      showSuccess(t('bkash_payment_successful', { transactionId: data.transactionId }));
      onPaymentSuccess(data.orderId); // Assuming backend returns orderId in execute-payment response
    },
    onClose: () => {
      // console.log('bKash popup closed');
      showError(t('bkash_payment_cancelled'));
      onPaymentFailure();
    },
    onError: (err) => {
      console.error('bKash error:', err);
      showError(err.message || t('bkash_payment_error'));
      onPaymentFailure();
    },
    
    onCreatePayment: async () => {
      setIsLoading(true);
      const toastId = showLoading(t('initiating_bkash_payment'));
      try {
        const { data } = await apiClient.post('/payment/bkash/create-payment', {
          amount: amount,
          orderId: orderId, // Pass the temporary orderId from checkout form submission
          customerInfo: customerInfo, // Pass customer info
        });
        dismissToast(toastId);
        return {
          paymentID: data.paymentID,
          bkashURL: data.bkashURL,
        };
      } catch (err) {
        dismissToast(toastId);
        const errorMessage = err.response?.data?.error || t('failed_to_create_bkash_payment');
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },

    onExecutePayment: async (paymentID) => {
      setIsLoading(true);
      const toastId = showLoading(t('verifying_bkash_payment'));
      try {
        const { data } = await apiClient.post('/payment/bkash/execute-payment', {
          paymentID: paymentID,
        });
        dismissToast(toastId);
        return data; // This data goes to 'onSuccess'
      } catch (err) {
        dismissToast(toastId);
        const errorMessage = err.response?.data?.error || t('failed_to_execute_bkash_payment');
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },

    // Use sandbox script for development, replace with production URL for live
    bkashScriptURL: 'https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js', 
    amount: amount,
  });

  return (
    <ThemedButton 
      onClick={triggerBkash}
      disabled={isLoading}
      className="w-full bg-[#e2136e] hover:bg-[#c70f5e] text-white"
    >
      {isLoading ? t('processing') : t('pay_with_bkash')}
    </ThemedButton>
  );
};

export default BkashPayment;