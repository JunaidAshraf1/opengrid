import { type JAGridColumn, JAGrid } from "ja-grid-react";
import "ja-grid-react/styles.css";
import "./App.scss";

type DemoRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  salary: number;
};

const columns: JAGridColumn<DemoRow>[] = [
  { field: "id", headerName: "ID", sortable: true, width: 80, align: "right" },
  { field: "name", headerName: "Name", sortable: true, minWidth: 180 },
  { field: "email", headerName: "Email", sortable: true, minWidth: 240 },
  { field: "role", headerName: "Role", sortable: true },
  { field: "department", headerName: "Department", sortable: true },
  {
    field: "status",
    headerName: "Status",
    sortable: true,
    align: "center",
    renderCell: ({ value }) => (
      <span className={`status-badge status-badge--${String(value).toLowerCase()}`}>
        {String(value)}
      </span>
    ),
  },
  {
    field: "salary",
    headerName: "Salary",
    sortable: true,
    align: "right",
    renderCell: ({ value }) => (
      <span className="salary-cell">${Number(value).toLocaleString()}</span>
    ),
  },
];

const rows: DemoRow[] = [
  { id: 1, name: "Amina Patel", email: "amina.patel@example.com", role: "Product Lead", department: "Product", status: "Active", salary: 132000 },
  { id: 2, name: "Marcus Lee", email: "marcus.lee@example.com", role: "Senior Engineer", department: "Engineering", status: "Active", salary: 118500 },
  { id: 3, name: "Sofia Rivera", email: "sofia.rivera@example.com", role: "UX Designer", department: "Design", status: "Onboarding", salary: 92000 },
  { id: 4, name: "Nina Chen", email: "nina.chen@example.com", role: "Marketing Manager", department: "Marketing", status: "Active", salary: 98000 },
  { id: 5, name: "Omar Malik", email: "omar.malik@example.com", role: "Customer Success", department: "Support", status: "Pending", salary: 76000 },
  { id: 6, name: "Lena Park", email: "lena.park@example.com", role: "Sales Director", department: "Sales", status: "Active", salary: 145000 },
  { id: 7, name: "Ethan Brooks", email: "ethan.brooks@example.com", role: "QA Analyst", department: "Engineering", status: "Active", salary: 82000 },
  { id: 8, name: "Priya Nair", email: "priya.nair@example.com", role: "Operations Lead", department: "Operations", status: "Offline", salary: 89000 },
  { id: 9, name: "Julian Park", email: "julian.park@example.com", role: "Data Analyst", department: "Analytics", status: "Active", salary: 94000 },
  { id: 10, name: "Maya Singh", email: "maya.singh@example.com", role: "Finance Manager", department: "Finance", status: "Active", salary: 128500 },
  { id: 11, name: "Noah Grant", email: "noah.grant@example.com", role: "DevOps Engineer", department: "Infrastructure", status: "Pending", salary: 108000 },
  { id: 12, name: "Hannah Lee", email: "hannah.lee@example.com", role: "HR Partner", department: "Human Resources", status: "Active", salary: 87000 },
  { id: 13, name: "Diego Costa", email: "diego.costa@example.com", role: "Creative Director", department: "Design", status: "Active", salary: 138000 },
  { id: 14, name: "Anika Shaw", email: "anika.shaw@example.com", role: "Recruiter", department: "People", status: "Offline", salary: 73000 },
  { id: 15, name: "Theo Fox", email: "theo.fox@example.com", role: "Legal Counsel", department: "Legal", status: "Active", salary: 112500 },
];

export function App() {
  return (
    <main className="demo-shell">
      <header className="demo-hero">
        <div>
          <p className="badge">React playground</p>
          <h1>JA Grid</h1>
          <p className="hero-copy">
            A clean enterprise table demo showing sorting, pagination, custom badge cells,
            loading state, and empty state examples.
          </p>
        </div>
      </header>

      <section className="demo-card">
        <div className="demo-card__header">
          <div>
            <p className="section-label">Live data grid</p>
            <h2>Employee roster</h2>
          </div>
        </div>
        <JAGrid columns={columns} rows={rows} pageSize={5} className="demo-grid" />
      </section>

      <section className="demo-card">
        <div className="demo-card__header">
          <div>
            <p className="section-label">Empty state</p>
            <h2>No records found</h2>
          </div>
        </div>
        <JAGrid columns={columns} rows={[]} pageSize={5} className="demo-grid" />
      </section>

      <section className="demo-card">
        <div className="demo-card__header">
          <div>
            <p className="section-label">Loading state</p>
            <h2>Fetching data</h2>
          </div>
        </div>
        <JAGrid columns={columns} rows={[]} loading pageSize={5} className="demo-grid" />
      </section>
    </main>
  );
}
