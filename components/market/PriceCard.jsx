import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PriceCard({ metal, data, isLoading }) {
  const metalColors = {
    gold: {
      bg: 'from-yellow-600/20 to-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: 'text-yellow-500'
    },
    silver: {
      bg: 'from-gray-400/20 to-gray-300/10',
      border: 'border-gray-400/30',
      text: 'text-gray-300',
      icon: 'text-gray-400'
    }
  };

  const colors = metalColors[metal];
  const isPositive = data.price_change_24h >= 0;

  if (isLoading) {
    return (
      <Card className={`vault-card ${colors.border} bg-gradient-to-br ${colors.bg} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-12 -mt-12" />
        <CardHeader className="relative">
          <CardTitle className={`text-xl font-bold capitalize ${colors.text}`}>
            {metal}
          </CardTitle>
          <Skeleton className="h-4 w-24 bg-gray-700" />
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div>
            <Skeleton className="h-10 w-40 mb-2 bg-gray-700" />
            <Skeleton className="h-5 w-32 bg-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1 bg-gray-700" />
              <Skeleton className="h-5 w-20 bg-gray-700" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-1 bg-gray-700" />
              <Skeleton className="h-5 w-20 bg-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`vault-card ${colors.border} bg-gradient-to-br ${colors.bg} relative overflow-hidden hover:scale-[1.02] transition-transform duration-200`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-12 -mt-12" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-xl font-bold capitalize ${colors.text}`}>
            {metal}
          </CardTitle>
          <DollarSign className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <p className="text-sm text-gray-400">Price per troy ounce</p>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div>
          <div className="text-4xl font-bold text-white mb-2">
            ${data.current_price?.toFixed(2)}
          </div>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${data.price_change_24h?.toFixed(2)} 
              ({isPositive ? '+' : ''}{data.price_change_percent_24h?.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div>
            <p className="text-xs text-gray-400 mb-1">24H High</p>
            <p className="text-sm font-semibold text-white">
              ${data.high_24h?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">24H Low</p>
            <p className="text-sm font-semibold text-white">
              ${data.low_24h?.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-400 mb-1">24H Volume</p>
          <p className="text-sm font-semibold text-white">
            ${(data.volume_24h / 1000000).toFixed(1)}M
          </p>
        </div>
      </CardContent>
    </Card>
  );
}