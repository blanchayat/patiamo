"use client";

import { useRouter } from "next/navigation";

export default function FooterDogWalkingEntry() {
  const router = useRouter();

  return (
    <span
      onDoubleClick={() => router.push("/admin")}
      className="cursor-pointer opacity-70 transition hover:opacity-100 hover:underline"
      style={{ color: "var(--text-muted)", textUnderlineOffset: "3px" }}
    >
      Dog Walking
    </span>
  );
}
