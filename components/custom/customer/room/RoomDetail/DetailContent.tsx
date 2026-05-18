"use client";

import DetailDesc from "./DetailDesc";
import DetailFacility from "./DetailFacility";
import DetailCost from "./DetailCost";
import DetailOwner from "./DetailOwner";

export default function DetailContent() {
  return (
    <div className="space-y-12">
      {/* ── 1. Split Columns Details Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Specifications (2/3 width) */}
        <div className="lg:col-span-2 space-y-10">
          <DetailDesc />
          <DetailFacility />
          <DetailCost />
        </div>

        {/* Right Column: Landlord Card (1/3 width, sticky) */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <DetailOwner />
        </div>
      </div>
    </div>
  );
}
