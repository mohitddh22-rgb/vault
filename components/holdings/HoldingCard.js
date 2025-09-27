import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function HoldingCard({ metalType, data, currentPrice, showValues }) {
  const formatCurrency = (amount) => {
    if (!showValues) return "•••••";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatOunces = (ounces) => {
    if (!showValues) return "••••";
    return `${ounces.toFixed(3)} oz`;
  };

  const profitLoss = data.totalValue - data.totalCost;
  const profitLossPercent = data.totalCost > 0 ? (profitLoss / data.totalCost) * 100 : 0;
  const avgCost = data.totalOunces > 0 ? data.totalCost / data.totalOunces : 0;

  const metalColors = {
    gold: {
      bg: 'from-yellow-600/20 to-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: 'bg-yellow-500/20'
    },
    silver: {
      bg: 'from-gray-400/20 to-gray-300/10',
      border: 'border-gray-400/30',
      text: 'text-gray-300',
      icon: 'bg-gray-400/20'
    }
  };

  const colors = metalColors[metalType];

  return (
    <Card className={`vault-card ${colors.border} bg-gradient-to-br ${colors.bg}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-xl font-bold capitalize ${colors.text}`}>
            {metalType}
          </CardTitle>
          <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
            {formatCurrency(currentPrice)}/oz
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Holdings</p>
            <p className="text-lg font-semibold text-white">
              {formatOunces(data.totalOunces)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Current Value</p>
            <p className="text-lg font-semibold text-white">
              {formatCurrency(data.totalValue)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Avg Cost</p>
            <p className="text-sm font-medium text-gray-300">
              {formatCurrency(avgCost)}/oz
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">P&L</p>
            <div className="flex items-center gap-1">
              {profitLoss >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {showValues ? `${profitLoss >= 0 ? '+' : ''}${profitLossPercent.toFixed(1)}%` : '••••'}
              </span>
            </div>
          </div>
        </div>

        {data.holdings.length > 1 && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">{data.holdings.length} separate purchases</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}