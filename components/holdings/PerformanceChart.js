import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function PerformanceChart({ holdings, currentPrices, showValues }) {
  // Generate mock performance data for the last 30 days
  const generatePerformanceData = () => {
    const days = 30;
    const data = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Mock price fluctuation
      const goldPrice = 2000 + Math.sin(i * 0.1) * 100 + Math.random() * 50;
      const silverPrice = 24 + Math.sin(i * 0.1) * 2 + Math.random() * 2;
      
      const portfolioValue = holdings.reduce((total, holding) => {
        const price = holding.metal_type === 'gold' ? goldPrice : silverPrice;
        return total + (holding.ounces * price);
      }, 0);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: portfolioValue,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return data;
  };

  const performanceData = generatePerformanceData();
  const currentValue = performanceData[performanceData.length - 1]?.value || 0;
  const startValue = performanceData[0]?.value || 0;
  const totalChange = currentValue - startValue;
  const percentChange = startValue > 0 ? (totalChange / startValue) * 100 : 0;

  if (holdings.length === 0) {
    return (
      <Card className="vault-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Chart</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-400">Add holdings to see performance</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="vault-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">30-Day Performance</CardTitle>
        {showValues && (
          <div className="flex items-center gap-4">
            <span className={`text-lg font-semibold ${
              totalChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalChange >= 0 ? '+' : ''}
              ${totalChange.toFixed(2)}
            </span>
            <span className={`text-sm ${
              percentChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis 
                dataKey="displayDate" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [
                  showValues ? `$${value.toFixed(2)}` : '••••••',
                  'Portfolio Value'
                ]}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#EAB308" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#EAB308' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}