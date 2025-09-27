
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Send, Gift } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function RecentTransactions({ transactions, showValues, isLoading }) {
  const formatCurrency = (amount) => {
    if (!showValues) return "•••••";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'buy':
        return <ArrowDownLeft {...iconProps} className="w-4 h-4 text-green-500" />;
      case 'sell':
        return <ArrowUpRight {...iconProps} className="w-4 h-4 text-red-500" />;
      case 'transfer_out':
        return <Send {...iconProps} className="w-4 h-4 text-blue-500" />;
      case 'transfer_in':
        return <Gift {...iconProps} className="w-4 h-4 text-purple-500" />;
      default:
        return <ArrowDownLeft {...iconProps} />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'buy':
        return 'text-green-400';
      case 'sell':
        return 'text-red-400';
      case 'transfer_out':
        return 'text-blue-400';
      case 'transfer_in':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <Card className="vault-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded bg-gray-700" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1 bg-gray-700" />
                    <Skeleton className="h-3 w-16 bg-gray-700" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16 bg-gray-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="vault-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white capitalize">
                        {transaction.type.replace('_', ' ')}
                      </span>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {transaction.metal_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">
                      {format(new Date(transaction.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'buy' || transaction.type === 'transfer_in' ? '+' : '-'}
                    {showValues ? `${transaction.ounces.toFixed(3)} oz` : '••••'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatCurrency(transaction.total_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-xs text-gray-500 mt-1">Your trading history will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
