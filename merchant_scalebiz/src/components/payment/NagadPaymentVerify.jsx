"use client";

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api'; // Use existing apiClient
import { showSuccess, showError } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { useStorePath } from '@/hooks/use-store-path';
import { useCart } from '@/context/CartContext';
import ThemedButton from '@/components/ThemedButton';

// Helper hook to get URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NagadPaymentVerify = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPath = useStorePath();
  const { clearCart } = useCart();
  const [statusMessage, setStatusMessage] = useState(t('verifying_payment_wait'));
  const [isError, setIsError] = useState(false);
  const query = useQuery();

  useEffect(() => {
    const verifyNagadPayment = async () => {
      const paymentRefId = query.get('payment_ref_id');
      const nagadStatus = query.get('status');
      const orderId = query.get('order_id'); // Assuming backend passes orderId back

      if (nagadStatus !== 'Success' || !paymentRefId || !orderId) {
        setIsError(true);
        setStatusMessage(t('payment_not_successful_or_cancelled'));
        showError(t('nagad_payment_failed'));
        return;
      }

      try {
        const { data } = await apiClient.post('/payment/nagad/verify-payment', {
          paymentRefId: paymentRefId,
          orderId: orderId, // Pass orderId for backend verification
        });

        if (data.success) {
          setStatusMessage(t('payment_verified_successfully'));
          showSuccess(t('nagad_payment_success'));
          clearCart(); // Clear cart on successful payment
          navigate(getPath(`/order-confirmation`), { state: { orderId: orderId } });
        } else {
          setIsError(true);
          setStatusMessage(data.error || t('payment_verification_failed'));
          showError(data.error || t('nagad_payment_verification_failed'));
        }
      } catch (err) {
        setIsError(true);
        const apiError = err.response?.data?.error || t('verification_failed');
        setStatusMessage(apiError);
        showError(apiError);
      }
    };

    verifyNagadPayment();
  }, [query, navigate, getPath, clearCart, t]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">{t('nagad_payment_status')}</h2>
        <h3 className={`text-xl font-semibold ${isError ? 'text-red-600' : 'text-green-600'} mb-6`}>{statusMessage}</h3>
        {isError && (
          <ThemedButton onClick={() => navigate(getPath('/checkout'))}>
            {t('try_again')}
          </ThemedButton>
        )}
      </div>
    </div>
  );
};

export default NagadPaymentVerify;