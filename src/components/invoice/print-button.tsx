"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Printing is a browser action, so this is the one interactive island on an
 * otherwise fully server-rendered invoice.
 */
export function PrintButton() {
  return (
    <Button
      size="md"
      onClick={() => window.print()}
      icon={<Printer aria-hidden className="size-4" />}
    >
      Print or save as PDF
    </Button>
  );
}
