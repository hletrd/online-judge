"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  hasNextPage: boolean;
  buildHref: (page: number) => string;
  rangeText?: string;
}

export function PaginationControls({
  currentPage,
  hasNextPage,
  buildHref,
  rangeText,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      {rangeText && (
        <span className="text-sm text-muted-foreground">{rangeText}</span>
      )}
      <div className="flex gap-2 ml-auto">
        {currentPage > 1 && (
          <Link href={buildHref(currentPage - 1)} aria-label="Previous page">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        )}
        {hasNextPage && (
          <Link href={buildHref(currentPage + 1)} aria-label="Next page">
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
