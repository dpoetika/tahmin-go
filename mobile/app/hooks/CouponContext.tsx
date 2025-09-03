// CouponContext.tsx
import React, { createContext, ReactNode, useState } from "react";

export type Match = {
  id: string;
  taraflar: string;
  iddaa:string;
  oran: string;
  tahmin: string;
};

type CouponContextType = {
  coupon: Match[];
  addToCoupon: (match: Match) => void;
  removeFromCoupon: (id: string) => void;
  resetCoupon:() => void;
};

export const CouponContext = createContext<CouponContextType>({
  coupon: [],
  addToCoupon: () => {},
  removeFromCoupon: () => {},
  resetCoupon: () => {},
});

const CouponProvider = ({ children }: { children: ReactNode }) => {
  const [coupon, setCoupon] = useState<Match[]>([]);

  const addToCoupon = (match: Match) => {
    setCoupon((prev) => {
      // Aynı maç id'si olan kuponu bul
      const sameId = prev.find((m) => m.id === match.id);
  
      if (sameId) {
        if (sameId.iddaa === match.iddaa) {
          if (sameId.tahmin === match.tahmin) {
            // Aynı iddaa ve tahmin → sil, ekleme yok
            return prev.filter((m) => m.id !== match.id);
          } else {
            // Aynı iddaa, farklı tahmin → sil, yeniyi ekle
            return [...prev.filter((m) => m.id !== match.id), match];
          }
        } else {
          // Farklı iddaa → sil, yeniyi ekle
          return [...prev.filter((m) => m.id !== match.id), match];
        }
      }
  
      // Aynı id yok → direkt ekle
      return [...prev, match];
    });
  };
  
  const removeFromCoupon = (id: string) => {
    setCoupon(coupon.filter((m) => m.id !== id));
  };

  const resetCoupon = () => {
    setCoupon([]);
  };

  return (
    <CouponContext.Provider value={{ coupon, addToCoupon, resetCoupon,removeFromCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};
export default CouponProvider;
