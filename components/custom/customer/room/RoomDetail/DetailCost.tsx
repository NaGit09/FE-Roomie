"use client";

import React from "react";
import { useRoomStore } from "@/stores/roomStore";
import formatVND from "@/utils/priceUtils";
import { Zap, Droplet, Settings, ShieldAlert, CircleDollarSign } from "lucide-react";

export default function DetailCost() {
  const { currentRoomDetail } = useRoomStore();

  if (!currentRoomDetail) return null;

  // Parses dynamic key-value cost configurations out of the attributes array
  const rawAttributes = currentRoomDetail.room.attributes || [];
  const parsedCosts = rawAttributes
    .map((attr) => {
      const separatorIdx = attr.indexOf(":");
      if (separatorIdx !== -1) {
        return {
          key: attr.substring(0, separatorIdx).trim(),
          value: attr.substring(separatorIdx + 1).trim(),
        };
      }
      return null;
    })
    .filter(Boolean) as { key: string; value: string }[];

  // Core baseline pricing options
  const baseCosts = [
    {
      key: "Giá thuê hàng tháng",
      value: formatVND(currentRoomDetail.room.price),
    },
    {
      key: "Tiền đặt cọc",
      value: formatVND(currentRoomDetail.room.deposit),
    },
  ];

  // Dynamically matches keywords to relevant visual indicators
  const getCostIcon = (key: string) => {
    const normalized = key.toLowerCase();
    if (
      normalized.includes("điện") ||
      normalized.includes("electricity") ||
      normalized.includes("kwh")
    ) {
      return Zap;
    }
    if (
      normalized.includes("nước") ||
      normalized.includes("water") ||
      normalized.includes("person")
    ) {
      return Droplet;
    }
    if (
      normalized.includes("quản lý") ||
      normalized.includes("dịch vụ") ||
      normalized.includes("management") ||
      normalized.includes("service")
    ) {
      return Settings;
    }
    if (normalized.includes("cọc") || normalized.includes("deposit")) {
      return ShieldAlert;
    }
    return CircleDollarSign;
  };

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-extrabold text-slate-900">Chi phí & Dịch vụ</h3>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-100/50">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Loại Chi Phí</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Mức Giá</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100/80">
            {/* 1. Base Costs (Rent & Deposit) */}
            {baseCosts.map((cost) => {
              const IconComponent = getCostIcon(cost.key);
              return (
                <tr key={cost.key} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-extrabold text-slate-800">{cost.key}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-extrabold text-primary text-base">{cost.value}</span>
                  </td>
                </tr>
              );
            })}

            {/* 2. Parsed Dynamic Service Fees */}
            {parsedCosts.map((cost) => {
              const IconComponent = getCostIcon(cost.key);
              return (
                <tr key={cost.key} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-bold text-slate-700 capitalize">{cost.key}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-extrabold text-slate-800 capitalize">{cost.value}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}