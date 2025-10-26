"use client";

import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

export default function Handbook() {
  const handleDownload = () => {
    window.open("/handbook/Handbook JOINMUN 2025.pdf", "_blank");
  };

  return (
    <main className="bg-basic rounded-lg p-4">
      <div className="bg-background flex flex-col gap-5 rounded-lg p-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Book className="h-9 w-auto md:h-full" />
          <p className="text-sm md:text-base md:text-nowrap">
            Download Handbook for detailed information.
          </p>
        </div>
        <Button
          variant="primary"
          className="w-full cursor-pointer md:ml-auto md:w-fit"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
    </main>
  );
}
