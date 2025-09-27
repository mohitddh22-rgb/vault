import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function MarketChart({ goldData, silverData }) {
  const [timeframe, setTimeframe] = useState('24h');

  // Generate mock chart data
  const generateChartData = () => {
    const points = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    const data = [];
    
    for (let i = points; i >= 0; i--) {
      const goldBase = goldData.current_price || 2034;
      const silverBase = silverData.current_price || 24.18;
      
      const goldPrice = goldBase + Math.sin(i * 0.2) * 20 + (Math.random() - 0.5) * 10;
      const silverPrice = silverBase + Math.sin(i * 0.2) * 0.5 + (Math.random() - 0.5) * 0.3;
      
      let label;
      const now = new Date();
      if (timeframe === '24h') {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        label = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === '7d') {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      data.push({
        time: label,
        gold: goldPrice,
        silver: silverPrice
      });
    }
    
    return data.reverse();
  };

  const chartData = generateChartData();

  return (
    <Card className="vault-card border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Price Charts</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="bg-gray-800">
              <TabsTrigger value="24h" className="text-xs">24H</TabsTrigger>
              <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">30D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value, name) => [
                  `$${value.toFixed(2)}`,
                  name === 'gold' ? 'Gold' : 'Silver'
                ]}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend 
                wrapperStyle={{ color: '#F9FAFB' }}
              />
              <Line 
                type="monotone" 
                dataKey="gold" 
                stroke="#EAB308" 
                strokeWidth={2}
                dot={false}
                name="Gold"
                activeDot={{ r: 4, fill: '#EAB308' }}
              />
              <Line 
                type="monotone" 
                dataKey="silver" 
                stroke="#9CA3AF" 
                strokeWidth={2}
                dot={false}
                name="Silver"
                activeDot={{ r: 4, fill: '#9CA3AF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}