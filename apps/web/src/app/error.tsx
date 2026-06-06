"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-32">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase text-yellow-accent">System Notice</p>
        <h1 className="mt-4 text-4xl font-semibold text-white-text">
          Something slipped out of sync.
        </h1>
        <p className="mt-4 text-white/62">
          Refresh the view and we will re-run the experience from a clean state.
        </p>
        <Button type="button" onClick={reset} className="mt-7">
          Try again
        </Button>
      </div>
    </div>
  );
}
