"use client";

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { useTranslation } from 'react-i18next';
import { useStorePath } from '@/hooks/use-store-path';
import { useCart } from '@/context/CartContext';
import ThemedButton from '@/components/ThemedButton';

const SslCommerzStatus = ({ status }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPath = useStorePath();
  const { clearCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get('orderId'); // Assuming backend passes orderId

    if (status === 'success') {
      showSuccess(t('sslcommerz_payment_success'));
      clearCart(); // Clear cart on successful payment
      if (orderId) {
        navigate(getPath(`/order-confirmation`), { state: { orderId: orderId } });
      } else {
        navigate(getPath('/order-confirmation')); // Fallback if orderId not available
      }
    } else {
      showError(t('sslcommerz_payment_failed'));
    }
  }, [status, navigate, getPath, clearCart, location.search, t]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === 'success' ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">{t('payment_successful')}</h1>
            <p className="text-lg text-gray-700 mb-6">{t('payment_verified_by_server')}</p>
            <ThemedButton onClick={() => navigate(getPath('/'))}>
              {t('continue_shopping')}
            </ThemedButton>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">{t('payment_failed')}</h1>
            <p className="text-lg text-gray-700 mb-6">{t('payment_not_completed_or_cancelled')}</p>
            <ThemedButton onClick={() => navigate(getPath('/checkout'))}>
              {t('try_again')}
            </ThemedButton>
          </>
        )}
      </div>
    </div>
  );
};

export default SslCommerzStatus;