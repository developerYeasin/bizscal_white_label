"use client";

import React, { useState } from 'react';
import { apiClient } from '@/lib/api'; // Use existing apiClient
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import ThemedButton from '@/components/ThemedButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStorePath } from '@/hooks/use-store-path';

const NagadPayment = ({ amount, orderId, customerInfo, onPaymentSuccess, onPaymentFailure }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPath = useStorePath();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    const toastId = showLoading(t('initiating_nagad_payment'));
    try {
      const { data } = await apiClient.post('/payment/nagad/create-payment', {
        amount: amount,
        orderId: orderId, // Pass the temporary orderId from checkout form submission
        customerInfo: customerInfo, // Pass customer info
        callbackUrl: `${window.location.origin}${getPath('/payment/nagad/verify')}`, // Dynamic callback URL
      });

      dismissToast(toastId);

      if (data.nagadURL) {
        window.location.href = data.nagadURL; // Redirect to Nagad payment page
      } else {
        showError(t('could_not_initiate_nagad_payment'));
        onPaymentFailure();
      }
    } catch (err) {
      dismissToast(toastId);
      const errorMessage = err.response?.data?.error || t('nagad_payment_initiation_failed');
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
      className="w-full bg-[#F58220] hover:bg-[#d66f1c] text-white"
    >
      {isLoading ? t('processing') : t('pay_with_nagad')}
    </ThemedButton>
  );
};

export default NagadPayment;