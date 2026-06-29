"use client";

import { useRouter } from "next/navigation";
import { Ticker } from "@/components/board/Ticker";
import { Story } from "@/components/board/Story";

export default function AiHackathonPage() {
  const router = useRouter();
  return (
    <>
      <Ticker />
      <Story onPivot={() => router.push("/")} />
    </>
  );
}
