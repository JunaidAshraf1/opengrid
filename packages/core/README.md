# ja-grid

Framework-agnostic TypeScript grid core.

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

## Features

- Column definitions
- Row data
- Single-column sorting
- Simple text filtering
- Pagination
- No framework, DOM, or browser API dependency
