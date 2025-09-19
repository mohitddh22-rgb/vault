
import React, { useState, useEffect } from "react";
import { MarketData } from "@/entities/all";
import { TrendingUp, TrendingDown, Zap, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PriceCard from "../components/market/PriceCard";
import MarketChart from "../components/market/MarketChart";
import MarketStats from "../components/market/MarketStats";

export default function Market() {
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(loadMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      // In production, this would fetch real market data
      // For demo, we'll create mock data
      const mockData = [
        {
          metal_type: "gold",
          current_price: 2034.50 + (Math.random() - 0.5) * 10,
          price_change_24h: -12.35 + (Math.random() - 0.5) * 5,
          price_change_percent_24h: -0.6 + (Math.random() - 0.5) * 0.2,
          volume_24h: 1250000,
          high_24h: 2048.20,
          low_24h: 2025.80
        },
        {
          metal_type: "silver",
          current_price: 24.18 + (Math.random() - 0.5) * 0.5,
          price_change_24h: 0.42 + (Math.random() - 0.5) * 0.2,
          price_change_percent_24h: 1.77 + (Math.random() - 0.5) * 0.5,
          volume_24h: 850000,
          high_24h: 24.65,
          low_24h: 23.92
        }
      ];

      setMarketData(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading market data:", error);
    }
    setIsLoading(false);
  };

  const goldData = marketData.find(d => d.metal_type === 'gold') || {};
  const silverData = marketData.find(d => d.metal_type === 'silver') || {};

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Live Market</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <Badge variant="outline" className="border-green-500 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMarketData}
              disabled={isLoading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to={createPageUrl("Trade")}>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Zap className="w-4 h-4 mr-2" />
                Quick Buy
              </Button>
            </Link>
          </div>
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PriceCard 
            metal="gold"
            data={goldData}
            isLoading={isLoading}
          />
          <PriceCard 
            metal="silver"
            data={silverData}
            isLoading={isLoading}
          />
        </div>

        {/* Charts and Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MarketChart 
              goldData={goldData}
              silverData={silverData}
            />
          </div>
          <div>
            <MarketStats 
              goldData={goldData}
              silverData={silverData}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Market Alerts */}
        <Card className="vault-card border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Market Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-white">Gold approaching resistance at $2,050</p>
                  <p className="text-xs text-gray-400">Consider taking profits or adding to positions</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-white">Silver showing strong momentum</p>
                  <p className="text-xs text-gray-400">Volume increased 15% in last hour</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
