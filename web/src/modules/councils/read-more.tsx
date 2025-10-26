"use client";

import { SubHeading } from "@/components/Layout/section-heading";
import { useState } from "react";

interface ReadMoreCouncilProps {
  html: string;
  limit?: number;
  className?: string;
}

export default function ReadMoreCouncil({
  html,
  limit = 300,
  className = "",
}: ReadMoreCouncilProps) {
  const [expanded, setExpanded] = useState(false);

  // const getTruncatedText = () => {
  //   const div = document.createElement("div");
  //   div.innerHTML = html;
  //   const text = div.textContent || div.innerText || "";
  //   return text.length > limit ? text.substring(0, limit).trim() + "..." : text;
  // };

  const getTruncatedText = html.length > limit ? html.slice(0, limit) + "..." : html;

  const shouldTruncate = html.length > limit;

  return (
    <div className={className}>
      <p
        dangerouslySetInnerHTML={{
          __html: expanded || !shouldTruncate ? html : getTruncatedText,
        }}
      />
      {shouldTruncate && (
        <button
          className="mt-1 text-sm font-semibold underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <SubHeading>{expanded ? "Show Less" : "Read More"}</SubHeading>
        </button>
      )}
    </div>
  );
}
