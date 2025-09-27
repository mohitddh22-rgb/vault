import React from "react";
import { Routes, Route, Outlet, NavLink } from "react-router-dom";

// Layout with header + sidebar + content.
// NOTE: <Outlet/> is required so child routes render!
function Layout() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: isActive ? "#111827" : "#374151",
    background: isActive ? "#e5e7eb" : "transparent",
    marginBottom: 6,
  });

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "56px 1fr", gridTemplateColumns: "220px 1fr", background: "#0b0b0b", color: "#e5e7eb" }}>
      <header style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ fontWeight: 700 }}>Vault App</div>
        <nav style={{ display: "flex", gap: 16 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "#9ca3af" }}>Help</a>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: "#9ca3af" }}>Profile</a>
        </nav>
      </header>

      <aside style={{ borderRight: "1px solid #1f2937", padding: 12 }}>
        <NavLink to="/" end style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/vaults" style={linkStyle}>Vaults</NavLink>
        <NavLink to="/settings" style={linkStyle}>Settings</NavLink>
      </aside>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}

// Example pages (replace with your real components)
function Dashboard() { return <h1>Dashboard</h1>; }
function holdings() { return <h1>holdings</h1>; }
function market() { return <h1>market</h1>; }
function trade() { return <h1>trade</h1>; }
function NotFound() { return <h1>Not Found</h1>; }

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/components/holdings" element={<holdings />} />
        <Route path="/components/market" element={<market />} />
        <Route path="/components/trade" element={<trade />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
