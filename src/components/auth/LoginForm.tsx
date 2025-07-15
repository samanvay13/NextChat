import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GoogleIcon } from './GoogleIcon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const { isDarkMode, themeClasses } = useTheme();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signInWithEmail(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setError('');
      alert('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    }
    
    setLoading(false);
  };

  if (showForgotPassword) {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          isDarkMode={isDarkMode}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            isLoading={loading}
            isDarkMode={isDarkMode}
          >
            Send Reset Email
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowForgotPassword(false)}
            isDarkMode={isDarkMode}
          >
            Back to Login
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="google"
        onClick={handleGoogleLogin}
        isLoading={loading}
        className="flex items-center justify-center"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${themeClasses.border}`} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-2 ${themeClasses.bg} ${themeClasses.textMuted}`}>
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          isDarkMode={isDarkMode}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          isDarkMode={isDarkMode}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          isLoading={loading}
          isDarkMode={isDarkMode}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className={`text-sm ${themeClasses.neonAccent} hover:underline`}
        >
          Forgot your password?
        </button>
        
        <p className={`text-sm ${themeClasses.textMuted}`}>
          Don't have an account?{' '}
          <Link href="/auth/signup" className={`${themeClasses.neonAccent} hover:underline font-medium`}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};