"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getDelegatePaper } from "@/utils/helpers/fetch/delegates/delegates";

export const ViewPaperButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paperUrl, setPaperUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleViewPaper = async () => {
    setIsLoading(true);
    try {
      const paperData = await getDelegatePaper();
      if (paperData && paperData.submission_file) {
        setPaperUrl(paperData.submission_file);
        setOpen(true);
      } else {
        alert(paperData);
      }
    } catch (error) {
      console.error("Failed to fetch paper:", error);
      alert("Failed to load paper. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleViewPaper} variant="outline" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "View Uploaded Paper"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Position Paper</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-hidden rounded-lg border">
          {paperUrl ? (
            <iframe src={paperUrl} className="h-full w-full" title="Position Paper PDF" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p>Loading PDF...</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => paperUrl && window.open(paperUrl, "_blank")}
            disabled={!paperUrl}
          >
            Open in New Tab
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
