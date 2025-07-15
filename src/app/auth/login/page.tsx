'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="NextChat" 
      subtitle="Sign in to continue to your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}