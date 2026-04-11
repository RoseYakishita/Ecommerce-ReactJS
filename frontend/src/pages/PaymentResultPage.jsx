import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import api from '../services/api';
import useStore from '../store/useStore';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [paidOrderId, setPaidOrderId] = useState(null);

  const resultCode = searchParams.get('resultCode');
  const message = searchParams.get('message');

  useEffect(() => {
    // In a real application, you might want to call the backend here 
    // to synchronously verify the payment state if you don't fully rely on the webhook.
    // However, our backend endpoint `/payment/momo/callback` acts as a Webhook or synchronous redirect target.
    // For this simple demo, we will call the GET callback manually to ensure status is updated in DB if the webhook failed for localhost.
    
    const verifyPayment = async () => {
      try {
        if (resultCode == 0) {
          const verifyRes = await api.get(`/payment/momo/callback?${searchParams.toString()}`);
          if (verifyRes?.data?.orderId) {
            setPaidOrderId(verifyRes.data.orderId);
          }
          // New flow: order is created after successful callback, so refresh cart now.
          await useStore.getState().fetchCart();
        }
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, resultCode]);

  const isSuccess = resultCode == 0;

  useEffect(() => {
    if (!verifying && isSuccess) {
      const timer = setTimeout(() => navigate('/'), 2500);
      return () => clearTimeout(timer);
    }
  }, [verifying, isSuccess, navigate]);

  if (verifying) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Verifying Payment...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-lg">
      <div className={`p-8 rounded-xl shadow-lg border ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'} mb-6`}>
          {isSuccess ? (
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2 text-textMain">
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>
        
        <p className="text-textLight mb-8">
          {isSuccess 
            ? `Your order has been paid and is now being processed.${paidOrderId ? ` Order #${paidOrderId}.` : ''} Thank you for shopping with us! Redirecting to home in 2.5 seconds...` 
            : `Transaction could not be completed. Reason: ${message || 'Unknown error'}`}
        </p>

        <div className="space-y-3">
          <Button onClick={() => navigate('/profile')} className="w-full">
            View My Orders
          </Button>
          {!isSuccess && (
            <Button variant="outline" onClick={() => navigate('/checkout')} className="w-full">
              Try Again
            </Button>
          )}
          <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
            Return to Store
          </Button>
        </div>
        
      </div>
    </div>
  );
}
