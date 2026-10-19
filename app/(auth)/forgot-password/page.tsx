'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.forgotPassword(email) as { success: boolean; message: string };
      if (response.success) {
        setSuccessMessage(response.message || 'OTP sent to your email address.');
        setStep(2);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.verifyOtp(email, otp) as { success: boolean; message: string; resetToken: string };
      if (response.success && response.resetToken) {
        setResetToken(response.resetToken);
        setSuccessMessage('OTP verified successfully. You can now reset your password.');
        setStep(3);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.resetPassword(resetToken, newPassword) as { success: boolean; message: string };
      if (response.success) {
        setSuccessMessage('Password reset successfully. You will be redirected to login.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError('Failed to reset password. Please try the process again.');
        setStep(1); // Go back to start if token expired or failed at this point
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-emerald-100">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                />
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-bold"
                  isLoading={isLoading}
                >
                  Send OTP
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                  We sent a 6-digit code to <strong>{email}</strong>. It will expire in 5 minutes.
                </div>
                
                <Input
                  label="6-Digit OTP"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only numbers
                  placeholder="------"
                  className="text-center text-2xl tracking-widest font-mono"
                  style={{ letterSpacing: '0.5em' }}
                  disabled={isLoading}
                  required
                />
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-bold"
                  isLoading={isLoading}
                >
                  Verify OTP
                </Button>
                
                <div className="text-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => { setStep(1); setOtp(''); setError(''); setSuccessMessage(''); }}
                    className="text-emerald-700 hover:underline"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                 {successMessage && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded-lg border border-emerald-100 font-medium mb-4">
                    {successMessage}
                  </div>
                )}

                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Must be at least 6 characters"
                  minLength={6}
                  disabled={isLoading}
                  required
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                  disabled={isLoading}
                  required
                />
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
                
                {!successMessage || !successMessage.includes('redirected') ? (
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-bold"
                    isLoading={isLoading}
                  >
                    Reset Password
                  </Button>
                ) : null}
              </form>
            )}

            {step === 1 && (
              <div className="text-center text-sm font-medium text-gray-600 mt-6">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="text-emerald-700 hover:text-emerald-800 underline transition-colors"
                >
                  Log In
                </Link>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
