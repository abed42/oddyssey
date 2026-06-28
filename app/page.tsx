"use client";

import { useRouter } from "next/navigation";
import { Ticker } from "@/components/board/Ticker";
import { Board } from "@/components/board/Board";
import { SellerProvider } from "@/components/board/SellerContext";

export default function Home() {
  const router = useRouter();
  return (
    <SellerProvider>
      <Ticker />
      <Board onColdOpen={() => router.push("/ai-hackathon")} />
    </SellerProvider>
  );
}
