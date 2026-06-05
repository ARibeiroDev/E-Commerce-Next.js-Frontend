"use client";

import { forgotPassword } from "@/lib/api/auth";
import EmailForm from "@/components/forms/email/EmailForm";

export default function ForgotPasswordPage() {
  return (
    <EmailForm
      title="Forgot Password"
      description="Enter your email and we'll send you a link to reset your password."
      buttonText="Send Reset Link"
      backToLoginText="Back to login"
      onSubmitAction={forgotPassword}
    />
  );
}
