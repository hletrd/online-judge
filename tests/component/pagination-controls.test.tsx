import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaginationControls } from "@/components/pagination-controls";

// Mock next/link — render as a plain anchor so href is testable
vi.mock("next/link", () => ({
  default: ({ href, children, className, "aria-label": ariaLabel, "aria-current": ariaCurrent }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    "aria-label"?: string;
    "aria-current"?: "page" | "true" | "false" | boolean;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel} aria-current={ariaCurrent as "page" | "true" | "false" | boolean | undefined}>
      {children}
    </a>
  ),
}));

// Mock lucide-react icons as minimal svgs
vi.mock("lucide-react", () => ({
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-left" className={className} aria-hidden="true" />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-right" className={className} aria-hidden="true" />
  ),
  ChevronsLeft: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevrons-left" className={className} aria-hidden="true" />
  ),
  ChevronsRight: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevrons-right" className={className} aria-hidden="true" />
  ),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string, values?: { page?: number }) => {
    switch (key) {
      case "paginationNav":
        return "Pagination";
      case "paginationFirst":
        return "First page";
      case "paginationPrevious":
        return "Previous page";
      case "paginationNext":
        return "Next page";
      case "paginationLast":
        return "Last page";
      case "paginationPage":
        return `Page ${values?.page ?? ""}`;
      default:
        return key;
    }
  },
}));

const buildHref = (page: number) => `/submissions?page=${page}`;

async function renderPagination(currentPage: number, totalPages: number) {
  render(await PaginationControls({ currentPage, totalPages, buildHref }));
}

describe("PaginationControls", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when totalPages is 1", async () => {
    const { container } = render(
      await PaginationControls({ currentPage: 1, totalPages: 1, buildHref })
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when totalPages is 0", async () => {
    const { container } = render(
      await PaginationControls({ currentPage: 1, totalPages: 0, buildHref })
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders page number links for small total (5 pages)", async () => {
    await renderPagination(1, 5);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("link", { name: `Page ${i}` })).toBeInTheDocument();
    }
  });

  it("marks current page with aria-current=page", async () => {
    await renderPagination(3, 5);
    const currentLink = screen.getByRole("link", { name: "Page 3" });
    expect(currentLink).toHaveAttribute("aria-current", "page");
  });

  it("other pages do not have aria-current set", async () => {
    await renderPagination(3, 5);
    const page2Link = screen.getByRole("link", { name: "Page 2" });
    expect(page2Link).not.toHaveAttribute("aria-current");
  });

  it("renders first/prev as disabled buttons on page 1", async () => {
    await renderPagination(1, 5);
    expect(screen.queryByRole("link", { name: "First page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Previous page" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "First page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("renders next/last as links on page 1", async () => {
    await renderPagination(1, 5);
    expect(screen.getByRole("link", { name: "Next page" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Last page" })).toBeInTheDocument();
  });

  it("renders next/last as disabled buttons on last page", async () => {
    await renderPagination(5, 5);
    expect(screen.queryByRole("link", { name: "Next page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Last page" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Last page" })).toBeDisabled();
  });

  it("renders first/prev as links on last page", async () => {
    await renderPagination(5, 5);
    expect(screen.getByRole("link", { name: "First page" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Previous page" })).toBeInTheDocument();
  });

  it("shows ellipsis for large page counts (20 pages, current=10)", async () => {
    await renderPagination(10, 20);
    const ellipsisItems = screen.getAllByText("...");
    expect(ellipsisItems.length).toBeGreaterThanOrEqual(1);
  });

  it("first page link has correct href", async () => {
    await renderPagination(3, 5);
    const firstLink = screen.getByRole("link", { name: "First page" });
    expect(firstLink).toHaveAttribute("href", "/submissions?page=1");
  });

  it("next page link has correct href", async () => {
    await renderPagination(3, 5);
    const nextLink = screen.getByRole("link", { name: "Next page" });
    expect(nextLink).toHaveAttribute("href", "/submissions?page=4");
  });

  it("previous page link has correct href", async () => {
    await renderPagination(3, 5);
    const prevLink = screen.getByRole("link", { name: "Previous page" });
    expect(prevLink).toHaveAttribute("href", "/submissions?page=2");
  });

  it("last page link has correct href", async () => {
    await renderPagination(3, 5);
    const lastLink = screen.getByRole("link", { name: "Last page" });
    expect(lastLink).toHaveAttribute("href", "/submissions?page=5");
  });
});
