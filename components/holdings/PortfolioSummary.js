import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioSummary({ 
  portfolioValue, 
  profitLoss, 
  profitLossPercent, 
  showValues,
  isLoading 
}) {
  const formatCurrency = (amount) => {
    if (!showValues) return "•••••";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent) => {
    if (!showValues) return "••••";
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="vault-card border-gray-700">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2 bg-gray-700" />
              <Skeleton className="h-8 w-32 mb-2 bg-gray-600" />
              <Skeleton className="h-3 w-16 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="vault-card border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-8 -mt-8" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-400 font-medium">Total Portfolio Value</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(portfolioValue)}
          </div>
          <div className="text-sm text-gray-400">
            Across all metals
          </div>
        </CardContent>
      </Card>

      <Card className="vault-card border-gray-700 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 ${
          profitLoss >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
        }`} />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-2">
            {profitLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-400 font-medium">Total Gain/Loss</span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${
            profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(profitLoss)}
          </div>
          <div className={`text-sm font-medium ${
            profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatPercent(profitLossPercent)}
          </div>
        </CardContent>
      </Card>

      <Card className="vault-card border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-400 font-medium">Performance</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {profitLoss >= 0 ? 'Profitable' : 'Down'}
          </div>
          <div className="text-sm text-gray-400">
            Since inception
          </div>
        </CardContent>
      </Card>
    </div>
  );
}