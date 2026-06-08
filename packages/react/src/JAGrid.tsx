import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createGrid } from "ja-grid";
import type { SortDirection, SortModel } from "ja-grid";

export type JAGridColumn<T> = {
  field: keyof T | string;
  headerName?: string;
  width?: number | string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  renderCell?: (params: {
    value: unknown;
    row: T;
    field: string;
    rowIndex: number;
  }) => ReactNode;
};

export type JAGridProps<T> = {
  columns: JAGridColumn<T>[];
  rows: T[];
  loading?: boolean;
  pageSize?: number;
  className?: string;
};

const DEFAULT_PAGE_SIZE = 10;

export function JAGrid<T extends Record<string, unknown>>({
  columns,
  rows,
  loading = false,
  pageSize = DEFAULT_PAGE_SIZE,
  className,
}: JAGridProps<T>) {
  const [sort, setSort] = useState<SortModel>();
  const [page, setPage] = useState(1);

  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalPages = Math.max(1, Math.ceil(rows.length / safePageSize));
  const safePage = Math.min(page, totalPages);

  const visibleRows = useMemo(() => {
    const grid = createGrid({
      columns: columns.map((column) => ({
        field: String(column.field),
        headerName: column.headerName,
        sortable: column.sortable,
      })),
      rows,
      sort,
      pagination: {
        page: safePage,
        pageSize: safePageSize,
      },
    });

    return grid.getVisibleRows();
  }, [columns, rows, safePage, safePageSize, sort]);

  const startRow = rows.length === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const endRow = Math.min(safePage * safePageSize, rows.length);
  const rootClassName = ["ja-grid", className].filter(Boolean).join(" ");

  function handleSort(column: JAGridColumn<T>) {
    if (!column.sortable) {
      return;
    }

    const field = String(column.field);

    setPage(1);
    setSort((currentSort) => {
      if (!currentSort || currentSort.field !== field) {
        return { field, direction: "asc" };
      }

      const nextDirection = getNextSortDirection(currentSort.direction);

      if (!nextDirection) {
        return undefined;
      }

      return { field, direction: nextDirection };
    });
  }

  return (
    <div className={rootClassName}>
      <div className="ja-grid__table-wrap">
        <table className="ja-grid__table">
          <thead className="ja-grid__head">
            <tr className="ja-grid__row ja-grid__row--header">
              {columns.map((column) => {
                const field = String(column.field);
                const isSorted = sort?.field === field;
                const sortDirection = isSorted ? sort.direction : null;

                return (
                  <th
                    key={field}
                    className={getCellClassName("ja-grid__header-cell", column)}
                    style={getColumnStyle(column)}
                    scope="col"
                    aria-sort={getAriaSort(sortDirection)}
                  >
                    <button
                      type="button"
                      className="ja-grid__header-button"
                      onClick={() => handleSort(column)}
                      disabled={!column.sortable}
                    >
                      <span className="ja-grid__header-label">
                        {column.headerName ?? field}
                      </span>
                      {column.sortable ? (
                        <span
                          className="ja-grid__sort-indicator"
                          aria-hidden="true"
                        >
                          {getSortSymbol(sortDirection)}
                        </span>
                      ) : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="ja-grid__body">
            {loading ? (
              <tr className="ja-grid__row">
                <td className="ja-grid__state-cell" colSpan={columns.length}>
                  Loading data...
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr className="ja-grid__row">
                <td className="ja-grid__state-cell" colSpan={columns.length}>
                  No rows to display
                </td>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => (
                <tr className="ja-grid__row" key={getRowKey(row, rowIndex)}>
                  {columns.map((column) => {
                    const field = String(column.field);
                    const value = row[field];

                    return (
                      <td
                        key={field}
                        className={getCellClassName("ja-grid__cell", column)}
                        style={getColumnStyle(column)}
                      >
                        {column.renderCell
                          ? column.renderCell({
                              value,
                              row,
                              field,
                              rowIndex:
                                (safePage - 1) * safePageSize + rowIndex,
                            })
                          : renderValue(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ja-grid__footer">
        <span className="ja-grid__pagination-summary">
          {startRow} - {endRow} of {rows.length}
        </span>
        <div className="ja-grid__pagination-controls">
          <button
            type="button"
            className="ja-grid__pagination-button"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={safePage === 1 || loading}
          >
            Previous
          </button>
          <span className="ja-grid__page-label">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            className="ja-grid__pagination-button"
            onClick={() =>
              setPage((currentPage) => Math.min(totalPages, currentPage + 1))
            }
            disabled={safePage === totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function getNextSortDirection(direction: SortDirection): SortDirection {
  if (direction === "asc") {
    return "desc";
  }

  if (direction === "desc") {
    return null;
  }

  return "asc";
}

function getAriaSort(direction: SortDirection) {
  if (direction === "asc") {
    return "ascending";
  }

  if (direction === "desc") {
    return "descending";
  }

  return "none";
}

function getSortSymbol(direction: SortDirection) {
  if (direction === "asc") {
    return "^";
  }

  if (direction === "desc") {
    return "v";
  }

  return "-";
}

function getCellClassName<T>(
  baseClassName: string,
  column: JAGridColumn<T>,
): string {
  return [baseClassName, `ja-grid__cell--${column.align ?? "left"}`].join(" ");
}

function getColumnStyle<T>(column: JAGridColumn<T>): CSSProperties {
  return {
    width: column.width,
    minWidth: column.minWidth,
  };
}

function getRowKey<T extends Record<string, unknown>>(
  row: T,
  rowIndex: number,
) {
  const id = row.id;

  if (typeof id === "string" || typeof id === "number") {
    return id;
  }

  return rowIndex;
}

function renderValue(value: unknown) {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return String(value);
}
