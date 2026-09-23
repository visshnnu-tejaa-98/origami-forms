import React from "react";
import { Icon } from "./icons";
import type { PaginationProps } from "../types";

const WINDOW_SIZE = 5;

const pageWindow = (currentPage: number, totalPages: number) => {
    const size = Math.min(WINDOW_SIZE, totalPages);
    const half = Math.floor(size / 2);

    let start = currentPage - half;
    if (start < 1) start = 1;
    if (start + size - 1 > totalPages) start = totalPages - size + 1;

    return Array.from({ length: size }, (_, i) => start + i);
};

const Pagination = ({
    data,
    pageOptions,
    setPage,
    className = "forms-pager",
    itemLabel = "form",
}: Omit<PaginationProps, "showPagination">) => {
    if (!data || !pageOptions) return null;
    const { rangeStart, rangeEnd, currentPage, totalPages } = pageOptions;

    const pages = pageWindow(currentPage, totalPages);
    const hasPagesBefore = (pages[0] ?? 1) > 1;
    const hasPagesAfter = (pages[pages.length - 1] ?? totalPages) < totalPages;

    return (
        <nav className={className} aria-label="Pagination">
            <span className="pager-info">
                Showing{" "}
                <strong>
                    {rangeStart}–{rangeEnd}
                </strong>{" "}
                of {data?.totalItems}
                {` ${itemLabel}${data?.totalItems === 1 ? "" : "s"}`}
            </span>
            <div className="pager-controls">
                {data.hasPrevPage && (
                    <button
                        className="pager-btn"
                        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <Icon name="chevron" size={15} className="flip" /> Prev
                    </button>
                )}
                {hasPagesBefore && (
                    <span className="pager-gap" aria-hidden>
                        …
                    </span>
                )}
                {pages.map((n) => (
                    <button
                        key={n}
                        className={`pager-num${n === currentPage ? " active" : ""}`}
                        onClick={() => setPage(n)}
                        aria-current={n === currentPage ? "page" : undefined}
                    >
                        {n}
                    </button>
                ))}
                {hasPagesAfter && (
                    <span className="pager-gap" aria-hidden>
                        …
                    </span>
                )}
                {data.hasNextPage && (
                    <button
                        className="pager-btn"
                        onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        Next <Icon name="chevron" size={15} />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Pagination;
