import { useEffect, useState } from 'react';
import { useNavigate, Link, createFileRoute } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { getAccessTokenHelper } from '@/lib/auth';

export const Route = createFileRoute('/payment-verify')({
  component: PaymentVerify,
})

function PaymentVerify() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying payment...');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    let prevPage = params.get('prev') || '/Dashboard/patient';
    // Ensure prevPage is a valid route
    if (!prevPage.startsWith('/')) prevPage = '/Dashboard/patient';
    
    console.log('=== PAYMENT VERIFICATION DEBUG ===');
    console.log('URL params:', Object.fromEntries(params.entries()));
    console.log('Reference:', reference);
    console.log('Prev page:', prevPage);
    console.log('Current URL:', window.location.href);
    
    if (!reference) {
      console.error('No payment reference found in URL');
      setStatus('error');
      setMessage('No payment reference found in URL.');
      return;
    }
    
    // Call backend to verify payment
    const token = getAccessTokenHelper();
    console.log('Access token present:', !!token);
    console.log('API URL:', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/payments/verify/${reference}`);
    
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/payments/verify/${reference}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        console.log('=== BACKEND RESPONSE ===');
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
          const err = await res.text();
          console.error('Backend error response:', err);
          console.error('Response status:', res.status);
          
          // Try to parse as JSON for better error handling
          try {
            const errorData = JSON.parse(err);
            throw new Error(errorData.message || 'Verification failed');
          } catch (parseError) {
            // If not JSON, use the raw text
            throw new Error(err || 'Verification failed');
          }
        }
        
        const responseData = await res.json();
        console.log('Backend success response:', responseData);
        console.log('Payment verification successful!');
        return responseData;
      })
      .then((data) => {
        console.log('=== SUCCESS HANDLING ===');
        console.log('Setting status to success');
        setStatus('success');
        setMessage('Payment verified successfully! Redirecting to dashboard...');
        // Optimistically update orders/payment status in cache
        queryClient.setQueryData(['orders'], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((order: any) =>
              order.paystackReference === reference || order.reference === reference
                ? { ...order, status: 'confirmed' }
                : order
            ),
          };
        });
        // Invalidate orders and payments queries so they refetch on next mount
        console.log('Invalidating queries for fresh data...');
        queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['payments'], exact: false });
        
        console.log('Scheduling redirect to:', prevPage);
        setTimeout(() => {
          console.log('Executing redirect now...');
          navigate({ to: prevPage });
        }, 1000); // Give user a second to see the message
      })
      .catch((err) => {
        console.error('=== ERROR HANDLING ===');
        console.error('Payment verification error:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        setStatus('error');
        
        // Extract error message from the response
        let errorMessage = 'Payment verification failed.';
        if (err.message) {
          if (err.message.includes('not completed')) {
            errorMessage = 'Payment not completed. Please try again.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setMessage(errorMessage);
        setTimeout(() => {
          console.log('Redirecting on error to:', prevPage);
          navigate({ to: prevPage });
        }, 5000);
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
        <>
          <Link to="/Dashboard/patient" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Go to Dashboard</Link>
          <div className="mt-2">If you are not redirected automatically, <button onClick={() => navigate({ to: '/Dashboard/patient' })} className="underline text-blue-600">click here</button>.</div>
        </>
      )}
      {status === 'error' && (
        <div className="mt-2 flex flex-col items-center">
          <div className="text-red-600 font-semibold mb-2">
            {message.includes('not completed') ? (
              <>
                <span>It looks like your payment was not completed or was cancelled.</span>
                <br />
                <span>Please try again or contact support if you were charged.</span>
              </>
            ) : (
              message
            )}
          </div>
          <button
            onClick={() => navigate({ to: '/Dashboard/patient/payments' })}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Retry Payment
          </button>
          <div className="mt-2">If you are not redirected automatically, <button onClick={() => navigate({ to: '/Dashboard/patient' })} className="underline text-blue-600">click here</button>.</div>
        </div>
      )}
    </div>
  );
} 