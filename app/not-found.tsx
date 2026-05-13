/* eslint-disable react/no-unescaped-entities */
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="animate-appear grid place-content-center gap-6 flex-1 text-center">
      <div className="flex flex-col justify-center items-center gap-4">
        <Frown className="w-20 h-20" />
        <h2 className="text-3xl">Oops, this is embarrassing...</h2>
      </div>

      <p>The page you're looking for couldn't be found!</p>
      <Link href="/" className="text-blue-400 text-lg">
        Return Home
      </Link>
    </main>
  );
}
