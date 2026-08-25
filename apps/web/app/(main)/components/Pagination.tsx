import React from "react";
import { Icon } from "./icons";
import type { PaginationProps } from "../types";

const Pagination = ({
    data,
    pageOptions,
    setPage,
    className = "forms-pager",
    itemLabel = "form",
}: Omit<PaginationProps, "showPagination">) => {
    if (!data || !pageOptions) return null;
    const { rangeStart, rangeEnd, currentPage, totalPages } = pageOptions;
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        className={`pager-num${n === currentPage ? " active" : ""}`}
                        onClick={() => setPage(n)}
                        aria-current={n === currentPage ? "page" : undefined}
                    >
                        {n}
                    </button>
                ))}
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
