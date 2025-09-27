// src/pages/Holdings.js
import React from "react";

// If your files are named with spaces, RENAME them to CamelCase first:
// PerformanceChart.js, RecentTransactions.js, PortfolioSummary.js, HoldingCard.js
// (Imports with spaces in filenames are brittle.)
import HoldingCard from "@/components/holding/HoldingCard.js";
import PerformanceChart from "@/components/holding/PerformanceChart.js";
import RecentTransactions from "@/components/holding/RecentTransactions.js";
import PortfolioSummary from "@/components/holding/PortfolioSummary.js";

export default function Holdings() {
  return (
    <div className="p-6 space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <HoldingCard />
        <PortfolioSummary />
      </div>

      {/* Chart */}
      <div className="vault-card rounded-xl p-4">
        <PerformanceChart />
      </div>

      {/* Recent transactions */}
      <div className="vault-card rounded-xl p-4">
        <RecentTransactions />
      </div>
    </div>
  );
}
