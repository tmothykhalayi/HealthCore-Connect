import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createFileRoute } from '@tanstack/react-router';
import { forgotPasswordFn } from '@/api/auth'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await forgotPasswordFn(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200 rounded-xl bg-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Enter your email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading || submitted}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || submitted}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              {error && (
                <p className="text-red-600 text-sm text-center mt-2">{error}</p>
              )}
              {submitted && !error && (
                <p className="text-green-600 text-sm text-center mt-2">
                  If an account with that email exists, a password reset link will be sent.
                </p>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
} 