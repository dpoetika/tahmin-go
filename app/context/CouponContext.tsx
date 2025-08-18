// CouponContext.tsx
import React, { createContext, ReactNode, useState } from "react";

export type Match = {
  id: string;
  Taraflar: string;
  iddaa:string;
  Oran: string;
  Tahmin: string;
};

type CouponContextType = {
  coupon: Match[];
  addToCoupon: (match: Match) => void;
  removeFromCoupon: (id: string) => void;
};

export const CouponContext = createContext<CouponContextType>({
  coupon: [],
  addToCoupon: () => {},
  removeFromCoupon: () => {},
});

export const CouponProvider = ({ children }: { children: ReactNode }) => {
  const [coupon, setCoupon] = useState<Match[]>([]);

  const addToCoupon = (match: Match) => {
    setCoupon((prev) => {
      // Aynı id varsa önce sil
      const filtered = prev.filter((m) => m.id !== match.id);
      console.log("eklendi")
      return [...filtered, match];
    });
  };
  

  const removeFromCoupon = (id: string) => {
    setCoupon(coupon.filter((m) => m.id !== id));
  };

  return (
    <CouponContext.Provider value={{ coupon, addToCoupon, removeFromCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};
