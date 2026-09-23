"use client";

import { highlightNames } from "@/lib/wa-instruments";

export function PleadingView({
  markdown,
  names,
}: {
  markdown: string;
  names: string[];
}) {
  return (
    <article className="pleading p-8 md:p-10 min-h-[640px] text-[13.5px] leading-[1.65]">
      <div className="text-center text-[10px] tracking-[0.22em] uppercase text-[#7a6240] mb-5">
        Advocate draft · names marked in copper · review before filing
      </div>
      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlightNames(markdown, names) }} />
    </article>
  );
}
