# opengrid

Framework-agnostic enterprise data grid built for modern web applications.

## ja-grid

`ja-grid` is the core TypeScript grid engine. It has no dependency on React,
Vue, Angular, the DOM, or browser APIs.

```ts
import { createGrid } from "ja-grid";

const grid = createGrid({
  columns: [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
  ],
  rows: [{ id: 1, name: "Junaid", email: "junaid@example.com" }],
  pagination: {
    page: 1,
    pageSize: 10,
  },
});

const visibleRows = grid.getVisibleRows();
```

You can also use the pure helpers directly:

```ts
import { filterRows, paginateRows, sortRows } from "ja-grid";

const filteredRows = filterRows(rows, { value: "junaid" });
const sortedRows = sortRows(filteredRows, { field: "name", direction: "asc" });
const pageRows = paginateRows(sortedRows, { page: 1, pageSize: 10 });
```

## ja-grid-react

`ja-grid-react` is the React + TypeScript UI adapter for `ja-grid`.

```tsx
import { JAGrid } from "ja-grid-react";
import "ja-grid-react/styles.css";

const columns = [
  { field: "name", headerName: "Name", sortable: true },
  { field: "email", headerName: "Email" },
  { field: "role", headerName: "Role" },
];

const rows = [
  {
    id: 1,
    name: "Junaid Ashraf",
    email: "junaid@example.com",
    role: "Founder",
  },
];

<JAGrid columns={columns} rows={rows} pageSize={10} />;
```
