import RegisterForm from "@/components/forms/auth/RegisterForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

const RegisterPage = () => {
  return (
    <main className="animate-appear flex flex-1 flex-col justify-center items-center gap-4 px-[5vw] lg:px-[10vw] my-8">
      <h2 className="text-3xl">Sign Up</h2>
      <RegisterForm />
      <section className="flex flex-col items-center gap-2">
        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
        <p className="text-center">
          Didn&apos;t receive a verification email?{" "}
          <Link href="/resend-verification" className="text-blue-500">
            Resend Verification
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;
