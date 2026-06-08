# ja-grid-react

React + TypeScript UI adapter for `ja-grid`.

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

export function App() {
  return <JAGrid columns={columns} rows={rows} pageSize={10} />;
}
```
