import RegisterForm from "@/components/forms/auth/RegisterForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <main className="animate-appear flex flex-1 flex-col justify-center items-center gap-4 px-[5vw] lg:px-[10vw] my-8">
      <h2 className="text-3xl">Sign Up</h2>
      <RegisterForm />
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </p>
    </main>
  );
};

export default RegisterPage;
