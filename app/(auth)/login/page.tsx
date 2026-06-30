import LoginForm from "@/components/forms/auth/LoginForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <main className="animate-appear flex flex-1 flex-col justify-center items-center gap-4 px-[5vw] lg:px-[10vw] my-8">
      <h2 className="text-3xl">Sign In</h2>
      <LoginForm />
      <section className="flex flex-col items-center gap-2">
        <p>
          <Link href="/forgot-password" className="text-blue-500">
            Forgot Password?
          </Link>
        </p>
        <p className="text-center">
          Dont have an account?{" "}
          <Link href="/register" className="text-blue-500">
            Create Account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
