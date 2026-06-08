export const version = "0.0.2";

export type GridRow = Record<string, unknown>;

export type SortDirection = "asc" | "desc" | null;

export interface GridColumn<TRow extends GridRow = GridRow> {
  field: Extract<keyof TRow, string> | string;
  headerName?: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface SortModel {
  field: string;
  direction: SortDirection;
}

export interface FilterModel {
  field?: string;
  value: string;
}

export interface PaginationModel {
  page: number;
  pageSize: number;
}

export interface GridOptions<TRow extends GridRow = GridRow> {
  columns: GridColumn<TRow>[];
  rows: TRow[];
  sort?: SortModel;
  filter?: FilterModel;
  pagination?: PaginationModel;
}

export interface GridState<TRow extends GridRow = GridRow> {
  columns: GridColumn<TRow>[];
  rows: TRow[];
  sort?: SortModel;
  filter?: FilterModel;
  pagination?: PaginationModel;
}

export interface Grid<TRow extends GridRow = GridRow> {
  getState(): GridState<TRow>;
  getVisibleRows(): TRow[];
  setRows(rows: TRow[]): void;
  setSort(sort?: SortModel): void;
  setFilter(filter?: FilterModel): void;
  setPagination(pagination?: PaginationModel): void;
}

export function sortRows<TRow extends GridRow>(
  rows: TRow[],
  sort?: SortModel,
): TRow[] {
  if (!sort || !sort.direction) {
    return [...rows];
  }

  const directionMultiplier = sort.direction === "asc" ? 1 : -1;

  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const result = compareValues(a.row[sort.field], b.row[sort.field]);

      if (result === 0) {
        return a.index - b.index;
      }

      return result * directionMultiplier;
    })
    .map((entry) => entry.row);
}

export function filterRows<TRow extends GridRow>(
  rows: TRow[],
  filter?: FilterModel,
): TRow[] {
  const value = filter?.value.trim().toLowerCase();

  if (!value) {
    return [...rows];
  }

  return rows.filter((row) => {
    if (filter?.field) {
      return stringifyCell(row[filter.field]).toLowerCase().includes(value);
    }

    return Object.values(row).some((cell) =>
      stringifyCell(cell).toLowerCase().includes(value),
    );
  });
}

export function paginateRows<TRow extends GridRow>(
  rows: TRow[],
  pagination?: PaginationModel,
): TRow[] {
  if (!pagination) {
    return [...rows];
  }

  const page = Math.max(1, Math.floor(pagination.page));
  const pageSize = Math.max(1, Math.floor(pagination.pageSize));
  const start = (page - 1) * pageSize;

  return rows.slice(start, start + pageSize);
}

export function getVisibleRows<TRow extends GridRow>(
  state: GridState<TRow>,
): TRow[] {
  const filteredRows = filterRows(state.rows, state.filter);
  const sortedRows = sortRows(filteredRows, state.sort);

  return paginateRows(sortedRows, state.pagination);
}

export function createGrid<TRow extends GridRow>(
  options: GridOptions<TRow>,
): Grid<TRow> {
  let state: GridState<TRow> = {
    columns: [...options.columns],
    rows: [...options.rows],
    sort: options.sort,
    filter: options.filter,
    pagination: options.pagination,
  };

  return {
    getState() {
      return {
        ...state,
        columns: [...state.columns],
        rows: [...state.rows],
      };
    },
    getVisibleRows() {
      return getVisibleRows(state);
    },
    setRows(rows) {
      state = {
        ...state,
        rows: [...rows],
      };
    },
    setSort(sort) {
      state = {
        ...state,
        sort,
      };
    },
    setFilter(filter) {
      state = {
        ...state,
        filter,
      };
    },
    setPagination(pagination) {
      state = {
        ...state,
        pagination,
      };
    },
  };
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function stringifyCell(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}
