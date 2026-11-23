"use client";

import { useState } from "react";
import Link from "next/link";
import type { ServiceItem } from "@/lib/types";

/** Services as UMG-style accordion rows: a ruled list where each row
    expands to its description, areas of focus and inquiry link. */
export default function ServiceAccordion({
  services,
}: {
  services: ServiceItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-b border-black/10">
      {services.map((service, index) => {
        const open = openIndex === index;
        return (
          <div key={service.slug} className="border-t border-black/10">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-7 text-left"
            >
              <span className="text-2xl font-light text-black">
                {service.title}
              </span>
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl transition-colors duration-300 ${
                  open
                    ? "rotate-45 bg-black text-white"
                    : "bg-[#eee] text-black"
                }`}
              >
                +
              </span>
            </button>

            {open ? (
              <div className="max-w-3xl pb-9">
                <p className="text-sm text-neutral-500">{service.subtitle}</p>
                <p className="mt-4 text-lg leading-8 text-neutral-600">
                  {service.description}
                </p>
                {service.offerings.length > 0 ? (
                  <ul className="mt-6 space-y-3">
                    {service.offerings.map((offering) => (
                      <li
                        key={offering}
                        className="flex items-start gap-3 text-base text-black"
                      >
                        <span aria-hidden="true" className="text-neutral-400">
                          ↗
                        </span>
                        <span>{offering}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 text-base font-medium text-black transition hover:text-neutral-500"
                >
                  Make an inquiry <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
