import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

const navBtn = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground size-8";
const navBtnDisabled = "inline-flex items-center justify-center rounded-md text-sm font-medium size-8 pointer-events-none opacity-40";
const pageBtn = "inline-flex items-center justify-center rounded-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground size-8 text-xs";
const pageBtnActive = "inline-flex items-center justify-center rounded-md font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 size-8 text-xs";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export function PaginationControls({
  currentPage,
  totalPages,
  buildHref,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      {/* First */}
      {currentPage > 1 ? (
        <Link href={buildHref(1)} aria-label="First page" className={navBtn}>
          <ChevronsLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={navBtnDisabled}>
          <ChevronsLeft className="size-4" />
        </span>
      )}

      {/* Prev */}
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)} aria-label="Previous page" className={navBtn}>
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={navBtnDisabled}>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex size-8 items-center justify-center text-sm text-muted-foreground select-none"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            className={p === currentPage ? pageBtnActive : pageBtn}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)} aria-label="Next page" className={navBtn}>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={navBtnDisabled}>
          <ChevronRight className="size-4" />
        </span>
      )}

      {/* Last */}
      {currentPage < totalPages ? (
        <Link href={buildHref(totalPages)} aria-label="Last page" className={navBtn}>
          <ChevronsRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={navBtnDisabled}>
          <ChevronsRight className="size-4" />
        </span>
      )}
    </div>
  );
}
