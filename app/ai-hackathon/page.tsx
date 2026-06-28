"use client";

import { useRouter } from "next/navigation";
import { TopNav } from "@/components/board/TopNav";
import { Story } from "@/components/board/Story";
import { SellerProvider } from "@/components/board/SellerContext";

export default function AiHackathonPage() {
  const router = useRouter();
  return (
    <SellerProvider>
      <TopNav />
      <Story onPivot={() => router.push("/")} />
    </SellerProvider>
  );
}
