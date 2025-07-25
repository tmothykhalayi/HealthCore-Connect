import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentVerify() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying payment...');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    const prevPage = params.get('prev') || '/Dashboard/patient';
    console.log('Redirecting to:', prevPage);
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found in URL.');
      return;
    }
    // Call backend to verify payment
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/payments/verify/${reference}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || 'Verification failed');
        }
        return res.json();
      })
      .then(() => {
        setStatus('success');
        setMessage('Payment verified successfully! Redirecting to dashboard...');
        // Optimistically update orders/payment status in cache
        queryClient.setQueryData(['orders'], (oldData: any) => {
          if (!oldData) return oldData;
          // Try to update all orders with status 'pending' to 'confirmed' if they match the reference
          // (Assumes you have access to the reference in the order/payment object)
          return {
            ...oldData,
            data: oldData.data.map((order: any) =>
              order.paystackReference === params.get('reference') || order.reference === params.get('reference')
                ? { ...order, status: 'confirmed' }
                : order
            ),
          };
        });
        // Invalidate orders query so it refetches on next mount
        queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
        setTimeout(() => navigate(prevPage), 0);
      })
      .catch((err) => {
        setStatus('error');
        setMessage('Payment verification failed. ' + (err.message || ''));
        setTimeout(() => navigate(prevPage), 5000);
      });
  }, [navigate, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'loading' && (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      )}
      <div className={`text-xl font-bold mb-2 ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-800'}`}>{message}</div>
      <div className="text-gray-500 text-sm mb-4">You will be redirected shortly...</div>
      {status === 'success' && (
        <Link to="/Dashboard/patient" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Go to Dashboard</Link>
      )}
    </div>
  );
} 