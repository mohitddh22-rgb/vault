import React, { useState, useEffect } from "react";
import { User, Holding } from "@/entities/all";
import { Button } from "@/components/ui/button";

import TradeWidget from "../components/trade/TradeWidget";

export default function Trade() {
  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock market prices
  const marketPrices = {
    gold: 2034.50,
    silver: 24.18
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      const userHoldings = await Holding.filter({ created_by: userData.email });
      setHoldings(userHoldings);
    } catch (error) {
      console.log("User not authenticated for trading");
    }
    setIsLoading(false);
  };
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div></div>;
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join Vault to Start Trading</h2>
          <p className="text-gray-400 mb-6">Create an account or sign in to buy and sell precious metals.</p>
          <Button onClick={() => User.login()} className="bg-yellow-600 hover:bg-yellow-700">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Trade Desk</h1>
          <p className="text-gray-400">Instantly buy or sell gold and silver at live market rates.</p>
        </div>

        <TradeWidget
          marketPrices={marketPrices}
          holdings={holdings}
          user={user}
          onTradeComplete={loadUserData}
        />
      </div>
    </div>
  );
}