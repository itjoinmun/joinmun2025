"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Delegate, submitPositionPaper } from "@/utils/helpers/fetch/delegates/delegates";

interface PositionPaperModalProps {
  userStatus: Delegate | null;
}

export const PositionPaperModal = ({ userStatus }: PositionPaperModalProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file size (2MB limit based on backend)
      if (selectedFile.size > 2 * 1024 * 1024) {
        setSubmitError("File size must be less than 2MB");
        return;
      }

      // Check file type (PDF only based on backend)
      if (selectedFile.type !== "application/pdf") {
        setSubmitError("Please upload a PDF file only");
        return;
      }

      setFile(selectedFile);
      setSubmitError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setSubmitError("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitPositionPaper(file);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setOpen(false);
        setFile(null);
        setSubmitSuccess(false);
        window.location.reload(); // Refresh to update status
      }, 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit position paper");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
          Submit Position Paper
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Position Paper</DialogTitle>
          <DialogDescription>
            Upload your position paper for {userStatus?.council} representing {userStatus?.country}
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-700">Paper Submitted Successfully!</h3>
            <p className="text-center text-gray-600">
              Your position paper has been submitted and is being reviewed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position-paper">Position Paper (PDF only)</Label>
              <Input
                id="position-paper"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {file && (
                <p className="text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {submitError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{submitError}</div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Council:</strong> {userStatus?.council}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Country:</strong> {userStatus?.country}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!file || isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Paper"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
