"use client";

import { useState } from "react";
import type { Territory } from "@/lib/types";

/** Global Territories as UMG-style accordion rows: each region is a
    full-width row with a thin black divider above it, the region name
    on the left and a light-grey circular "+" button on the right.
    Countries are revealed only on expand; every row starts
    collapsed. Follows the ServiceAccordion pattern. */
export default function TerritoryAccordion({
  regions,
}: {
  regions: { name: string; items: Territory[] }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-b border-black">
      {regions.map((region, index) => {
        const open = openIndex === index;
        return (
          <div key={region.name} className="border-t border-black">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-7 text-left"
            >
              <span className="text-2xl font-light text-black">
                {region.name}
              </span>
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee] text-xl text-black transition-transform duration-300 ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {open ? (
              <ul className="space-y-3 pb-9">
                {region.items.map((territory) =>
                  territory.website ? (
                    <li key={territory.slug}>
                      <a
                        href={territory.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-medium text-black transition hover:text-neutral-500"
                      >
                        {territory.name} ↗
                      </a>
                    </li>
                  ) : (
                    <li key={territory.slug} className="text-base text-black">
                      {territory.name}
                    </li>
                  ),
                )}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
