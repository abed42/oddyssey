"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  DEFAULT_SELLER_ID,
  getSeller,
  type SellerContext as Seller,
} from "@/lib/peitho/sellers";

type Ctx = {
  sellerId: string;
  setSellerId: (id: string) => void;
  seller: Seller;
};

const SellerCtx = createContext<Ctx | null>(null);

export function SellerProvider({ children }: { children: ReactNode }) {
  const [sellerId, setSellerId] = useState(DEFAULT_SELLER_ID);
  return (
    <SellerCtx.Provider
      value={{ sellerId, setSellerId, seller: getSeller(sellerId) }}
    >
      {children}
    </SellerCtx.Provider>
  );
}

// Defensive: works even if a component renders outside the provider (defaults).
export function useActiveSeller(): Ctx {
  const c = useContext(SellerCtx);
  if (!c) {
    return {
      sellerId: DEFAULT_SELLER_ID,
      setSellerId: () => {},
      seller: getSeller(DEFAULT_SELLER_ID),
    };
  }
  return c;
}
