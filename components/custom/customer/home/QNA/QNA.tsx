"use client";

import { useState } from "react";
import { FAQAccordion } from "./FAQAccordion";
import { faqData } from "@/constant/QNA";

export default function QNASection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full">
      <div className="grid gap-2">
        {faqData.map((faq, index) => (
          <FAQAccordion
            key={index}
            item={faq}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}
