'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout 
      title="NextChat" 
      subtitle="Get started with your new account"
    >
      <SignupForm />
    </AuthLayout>
  );
}