"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({ styles }: { styles?: string }) => {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      className={styles}
    >
      <ArrowLeftIcon aria-hidden="true" />
      Go back
    </button>
  );
};

export default BackButton;
