import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Transaction, Holding } from '@/entities/all';
import { toast } from "sonner";
import { TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const metals = [
  { id: 'gold', name: 'Gold', color: 'yellow-500', icon: '🥇' },
  { id: 'silver', name: 'Silver', color: 'gray-400', icon: '🥈' }
];

export default function TradeWidget({ marketPrices, holdings, user, onTradeComplete }) {
  const [tradeType, setTradeType] = useState('buy');
  const [selectedMetal, setSelectedMetal] = useState('gold');
  const [usdAmount, setUsdAmount] = useState('');
  const [ounceAmount, setOunceAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const price = marketPrices[selectedMetal];
  const feeRate = 0.015; // 1.5% transaction fee
  const fee = (Number(usdAmount) || 0) * feeRate;
  const total = tradeType === 'buy' ? (Number(usdAmount) || 0) + fee : (Number(usdAmount) || 0) - fee;

  const userOunces = holdings
    .filter(h => h.metal_type === selectedMetal)
    .reduce((sum, h) => sum + h.ounces, 0);

  useEffect(() => {
    setUsdAmount('');
    setOunceAmount('');
  }, [selectedMetal, tradeType]);

  const handleUsdChange = (e) => {
    const value = e.target.value;
    setUsdAmount(value);
    if (value && price > 0) {
      setOunceAmount((Number(value) / price).toFixed(5));
    } else {
      setOunceAmount('');
    }
  };

  const handleOunceChange = (e) => {
    const value = e.target.value;
    setOunceAmount(value);
    if (value && price > 0) {
      setUsdAmount((Number(value) * price).toFixed(2));
    } else {
      setUsdAmount('');
    }
  };
  
  const handleMax = () => {
    if (tradeType === 'sell' && userOunces > 0) {
      handleOunceChange({ target: { value: userOunces.toFixed(5) } });
    }
  };

  const executeTrade = async () => {
    setIsProcessing(true);
    setShowConfirmation(false);

    try {
      const ounces = Number(ounceAmount);
      const usd = Number(usdAmount);

      // Create transaction record
      await Transaction.create({
        type: tradeType,
        metal_type: selectedMetal,
        ounces,
        price_per_ounce: price,
        total_amount: usd,
        fees: fee,
        status: 'completed',
      });
      
      const existingHolding = holdings.find(h => h.metal_type === selectedMetal);

      if (tradeType === 'buy') {
        if (existingHolding) {
          const newOunces = existingHolding.ounces + ounces;
          const newAvgCost = ((existingHolding.ounces * existingHolding.average_cost_per_ounce) + (ounces * price)) / newOunces;
          await Holding.update(existingHolding.id, {
            ounces: newOunces,
            average_cost_per_ounce: newAvgCost,
          });
        } else {
          await Holding.create({
            metal_type: selectedMetal,
            ounces,
            average_cost_per_ounce: price,
            purchase_date: new Date().toISOString().split('T')[0],
          });
        }
      } else { // Sell
        if (!existingHolding || existingHolding.ounces < ounces) {
          throw new Error("Insufficient balance to sell.");
        }
        const newOunces = existingHolding.ounces - ounces;
        if (newOunces > 0.00001) { // Floating point precision
          await Holding.update(existingHolding.id, { ounces: newOunces });
        } else {
          await Holding.delete(existingHolding.id);
        }
      }

      setOrderResult({ success: true, message: `Successfully ${tradeType === 'buy' ? 'purchased' : 'sold'} ${ounces}oz of ${selectedMetal}.` });
      toast.success("Trade executed successfully!");
    } catch (error) {
      console.error("Trade execution failed:", error);
      setOrderResult({ success: false, message: `Trade failed: ${error.message}` });
      toast.error("Trade execution failed.");
    } finally {
      setIsProcessing(false);
      onTradeComplete(); // Refresh holdings data on parent
      setUsdAmount('');
      setOunceAmount('');
    }
  };

  const isTradeDisabled = !usdAmount || Number(usdAmount) <= 0 || isProcessing || (tradeType === 'sell' && Number(ounceAmount) > userOunces);

  return (
    <>
      <Card className="vault-card border-gray-700">
        <CardContent className="p-6">
          <Tabs value={tradeType} onValueChange={setTradeType} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="buy">BUY</TabsTrigger>
              <TabsTrigger value="sell">SELL</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-6">
            <Label className="text-gray-400 mb-2 block">Select Metal</Label>
            <div className="grid grid-cols-2 gap-4">
              {metals.map(metal => (
                <button
                  key={metal.id}
                  onClick={() => setSelectedMetal(metal.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedMetal === metal.id 
                      ? `border-${metal.color} bg-${metal.color}/10` 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{metal.icon}</span>
                    <span className="font-semibold text-white">{metal.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="usd" className="text-gray-400">Amount in USD</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input id="usd" type="number" value={usdAmount} onChange={handleUsdChange} placeholder="0.00" className="pl-7 bg-gray-800 border-gray-700 text-white" />
                </div>
              </div>
              <div>
                <Label htmlFor="ounce" className="text-gray-400">Amount in Ounces</Label>
                <div className="relative mt-1">
                   <Input id="ounce" type="number" value={ounceAmount} onChange={handleOunceChange} placeholder="0.00000" className="pr-10 bg-gray-800 border-gray-700 text-white" />
                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">oz</span>
                </div>
              </div>
            </div>
             {tradeType === 'sell' && (
              <div className="text-right">
                <Button variant="link" size="sm" onClick={handleMax} className="text-yellow-500 h-auto p-0">
                  Available: {userOunces.toFixed(5)} oz
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Market Price</span>
              <span className="text-white font-medium">${price.toFixed(2)} / oz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Fee (1.5%)</span>
              <span className="text-white font-medium">${fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-gray-700 pt-2 mt-2">
              <span className="text-white">Total</span>
              <span className={`text-${tradeType === 'buy' ? 'green' : 'red'}-400`}>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button 
            onClick={() => setShowConfirmation(true)} 
            disabled={isTradeDisabled}
            className={`w-full text-lg py-6 ${
              tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : `Review ${tradeType === 'buy' ? 'Buy' : 'Sell'} Order`}
          </Button>
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="vault-card border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please review the details of your transaction before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Action</span><span className="font-bold capitalize">{tradeType} {selectedMetal}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Amount</span><span>{ounceAmount} oz</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Market Price</span><span>${price.toFixed(2)}/oz</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>${Number(usdAmount).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Fee</span><span>${fee.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-3 mt-3"><span className="text-white">Total</span><span className={tradeType === 'buy' ? 'text-green-400' : 'text-red-400'}>${total.toFixed(2)}</span></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="border-gray-600 text-gray-300">Cancel</Button>
            <Button onClick={executeTrade} className={tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>Confirm Trade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Result Dialog */}
      <Dialog open={!!orderResult} onOpenChange={() => setOrderResult(null)}>
        <DialogContent className="vault-card border-gray-700 text-white">
          <DialogHeader className="items-center text-center">
            {orderResult?.success ? (
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
            )}
            <DialogTitle>{orderResult?.success ? 'Trade Successful' : 'Trade Failed'}</DialogTitle>
            <DialogDescription className="text-gray-400">{orderResult?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button onClick={() => setOrderResult(null)} className="bg-yellow-600 hover:bg-yellow-700">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}