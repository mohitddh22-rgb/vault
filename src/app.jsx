// src/app.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Your existing layout expects {children}
import Layout from "@/layout.js";

// ---- PAGES (from /pages) ----
import Holdings from "@/pages/Holdings.js";
import Market   from "@/pages/Market.js";
import Trade    from "@/pages/Trade.js";
import Transfer from "@/pages/Transfer.js";

// ---- COMPONENTS (from /components/holdings) ----
// Keep the exact filenames/casing; your folder has "PortofolioSummary.js"
import HoldingCard        from "@/components/holdings/HoldingCard.js";
import PerformanceChart   from "@/components/holdings/PerformanceChart.js";
import PortfolioSummary  from "@/components/holdings/PortfolioSummary.js";
import RecentTransactions from "@/components/holdings/RecentTransactions.js";

// Optional: a small showcase page so you can see all Holdings widgets render
function HoldingsShowcase() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <HoldingCard />
        <PortofolioSummary />
      </div>

      <div className="vault-card rounded-xl p-4">
        <PerformanceChart />
      </div>

      <div className="vault-card rounded-xl p-4">
        <RecentTransactions />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Default: redirect root to Holdings */}
      <Route path="/" element={<Navigate to="/Holdings" replace />} />

      {/* Render your pages inside your existing Layout (children pattern) */}
      <Route
        path="/Holdings"
        element={
          <Layout currentPageName="Holdings">
            <Holdings />
          </Layout>
        }
      />
      <Route
        path="/Market"
        element={
          <Layout currentPageName="Market">
            <Market />
          </Layout>
        }
      />
      <Route
        path="/Trade"
        element={
          <Layout currentPageName="Trade">
            <Trade />
          </Layout>
        }
      />
      <Route
        path="/Transfer"
        element={
          <Layout currentPageName="Transfer">
            <Transfer />
          </Layout>
        }
      />

      {/* OPTIONAL dev route to quickly verify the holdings components render */}
      <Route
        path="/_dev/holdings"
        element={
          <Layout currentPageName="Holdings">
            <HoldingsShowcase />
          </Layout>
        }
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={
          <Layout>
            <div style={{ padding: 24 }}>Not Found</div>
          </Layout>
        }
      />
    </Routes>
  );
}
