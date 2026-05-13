import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="flex flex-1 flex-col justify-center items-center gap-4 px-[5vw] lg:px-[10vw] my-8">
      <h2 className="text-3xl">Sign In</h2>
      <LoginForm />
      <p className="text-center">
        Dont have an account?{" "}
        <Link href="/register" className="text-blue-500">
          Create Account
        </Link>
      </p>
    </main>
  );
};

export default LoginPage;
