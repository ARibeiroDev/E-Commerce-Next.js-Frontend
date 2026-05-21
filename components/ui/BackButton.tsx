"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({ styles }: { styles?: string }) => {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/shop")} className={styles}>
      <ArrowLeftIcon />
      Go back
    </button>
  );
};

export default BackButton;
