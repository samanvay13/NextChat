import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GoogleIcon } from './GoogleIcon';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const { isDarkMode, themeClasses } = useTheme();
  const router = useRouter();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name.trim()) {
      setError('First name is required');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { error } = await signUpWithEmail(email, password, name);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-green-600 font-medium">Account created successfully!</p>
          <p className="text-sm text-green-600 mt-1">
            Please check your email to verify your account before signing in.
          </p>
        </div>
        
        <Button
          onClick={() => router.push('/auth/login')}
          isDarkMode={isDarkMode}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="google"
        onClick={handleGoogleSignup}
        isLoading={loading}
        className="flex items-center justify-center cursor-pointer"
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
            Or create account with email
          </span>
        </div>
      </div>

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          isDarkMode={isDarkMode}
        />

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
          placeholder="Create a password"
          required
          isDarkMode={isDarkMode}
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
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
          Create Account
        </Button>
      </form>

      <p className={`text-center text-sm ${themeClasses.textMuted}`}>
        Already have an account?{' '}
        <Link href="/auth/login" className={`${themeClasses.neonAccent} hover:underline font-medium`}>
          Sign in
        </Link>
      </p>
    </div>
  );
};