"use client";

import { resendVerification } from "@/lib/api/auth";
import EmailForm from "@/components/forms/email/EmailForm";

export default function ResendVerificationPage() {
  return (
    <EmailForm
      title="Resend Verification"
      description="Didn't receive your email? Enter your address to request a new one."
      buttonText="Resend Email"
      backToLoginText="Return to login"
      onSubmitAction={resendVerification}
    />
  );
}
