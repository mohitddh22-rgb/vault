
import React, { useState, useEffect } from "react";
import { Holding, Transaction, User } from "@/entities/all";
import { TrendingUp, TrendingDown, DollarSign, Zap, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PortfolioSummary from "../components/holdings/PortfolioSummary";
import HoldingCard from "../components/holdings/HoldingCard";
import RecentTransactions from "../components/holdings/RecentTransactions";
import PerformanceChart from "../components/holdings/PerformanceChart";

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showValues, setShowValues] = useState(true);

  // Mock current prices (in production, this would come from market data)
  const currentPrices = {
    gold: 2034.50,
    silver: 24.18
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const userHoldings = await Holding.filter({ created_by: userData.email });
      setHoldings(userHoldings);
      
      const userTransactions = await Transaction.filter({ created_by: userData.email }, '-created_date', 10);
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const calculatePortfolioValue = () => {
    return holdings.reduce((total, holding) => {
      const currentPrice = currentPrices[holding.metal_type];
      return total + (holding.ounces * currentPrice);
    }, 0);
  };

  const calculateProfitLoss = () => {
    return holdings.reduce((total, holding) => {
      const currentPrice = currentPrices[holding.metal_type];
      const currentValue = holding.ounces * currentPrice;
      const costBasis = holding.ounces * holding.average_cost_per_ounce;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const groupHoldingsByMetal = () => {
    const grouped = holdings.reduce((acc, holding) => {
      if (!acc[holding.metal_type]) {
        acc[holding.metal_type] = {
          totalOunces: 0,
          totalValue: 0,
          totalCost: 0,
          holdings: []
        };
      }
      
      const currentPrice = currentPrices[holding.metal_type];
      acc[holding.metal_type].totalOunces += holding.ounces;
      acc[holding.metal_type].totalValue += holding.ounces * currentPrice;
      acc[holding.metal_type].totalCost += holding.ounces * holding.average_cost_per_ounce;
      acc[holding.metal_type].holdings.push(holding);
      
      return acc;
    }, {});
    
    return grouped;
  };

  const portfolioValue = calculatePortfolioValue();
  const profitLoss = calculateProfitLoss();
  const profitLossPercent = portfolioValue > 0 ? (profitLoss / (portfolioValue - profitLoss)) * 100 : 0;
  const groupedHoldings = groupHoldingsByMetal();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Your Vault</h2>
          <p className="text-gray-400 mb-6">Sign in to view your precious metals portfolio</p>
          <Button onClick={() => User.login()} className="bg-yellow-600 hover:bg-yellow-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user.full_name?.split(' ')[0]}
            </h1>
            <p className="text-gray-400">Your precious metals portfolio</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValues(!showValues)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {showValues ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showValues ? 'Hide Values' : 'Show Values'}
            </Button>
            <Link to={createPageUrl("Trade")}>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Zap className="w-4 h-4 mr-2" />
                Quick Trade
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary 
          portfolioValue={portfolioValue}
          profitLoss={profitLoss}
          profitLossPercent={profitLossPercent}
          showValues={showValues}
          isLoading={isLoading}
        />

        {/* Holdings Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-6">
              {Object.entries(groupedHoldings).map(([metalType, data]) => (
                <HoldingCard
                  key={metalType}
                  metalType={metalType}
                  data={data}
                  currentPrice={currentPrices[metalType]}
                  showValues={showValues}
                />
              ))}
            </div>

            {holdings.length === 0 && !isLoading && (
              <Card className="vault-card border-gray-700">
                <CardContent className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Start Your Investment Journey</h3>
                  <p className="text-gray-400 mb-6">Begin building wealth with precious metals</p>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Make Your First Purchase
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <PerformanceChart 
              holdings={holdings}
              currentPrices={currentPrices}
              showValues={showValues}
            />
            <RecentTransactions 
              transactions={transactions}
              showValues={showValues}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
