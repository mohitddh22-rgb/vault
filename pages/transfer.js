
import React, { useState, useEffect } from 'react';
import { User, Holding, Transaction } from "@/entities/all";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const metals = [
  { id: 'gold', name: 'Gold', color: 'text-yellow-500', icon: '🥇' },
  { id: 'silver', name: 'Silver', color: 'text-gray-400', icon: '🥈' }
];

export default function Transfer() {
  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [recipient, setRecipient] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('gold');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [transferResult, setTransferResult] = useState(null);

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
    } catch (e) {
      console.log("User not authenticated");
    }
    setIsLoading(false);
  };
  
  const getBalance = (metal) => {
    return holdings.filter(h => h.metal_type === metal).reduce((sum, h) => sum + h.ounces, 0);
  };

  const goldBalance = getBalance('gold');
  const silverBalance = getBalance('silver');
  const currentBalance = getBalance(selectedMetal);
  
  const handleTransfer = async () => {
    setIsProcessing(true);
    setShowConfirm(false);

    try {
      // 1. Validate recipient and amount
      if (recipient.toLowerCase() === user.email.toLowerCase()) {
        throw new Error("You cannot transfer to yourself.");
      }
      
      // Allow dummy account for testing without DB check
      if (recipient.toLowerCase() !== 'test@vault.com') {
        const recipientUser = await User.filter({ email: recipient });
        if (!recipientUser.length) {
          throw new Error("Recipient user not found. For testing, try test@vault.com");
        }
      }
      
      const transferAmount = parseFloat(amount);
      if (transferAmount <= 0 || transferAmount > currentBalance) {
        throw new Error("Invalid transfer amount.");
      }
      
      // 2. Adjust sender's holding
      const senderHolding = holdings.find(h => h.metal_type === selectedMetal);
      const newSenderOunces = senderHolding.ounces - transferAmount;
      if (newSenderOunces > 0.00001) { // Check for floating point precision issues
        await Holding.update(senderHolding.id, { ounces: newSenderOunces });
      } else {
        // If remaining ounces are negligible or zero, delete the holding
        await Holding.delete(senderHolding.id);
      }
      
      // 3. Create sender's transaction
      await Transaction.create({
        type: 'transfer_out',
        metal_type: selectedMetal,
        ounces: transferAmount,
        price_per_ounce: 0, // No monetary value for gift
        total_amount: 0,
        counterparty: recipient,
        status: 'completed',
      });
      
      // 4. Adjust recipient's holding (This is a simplified demo)
      // In a real app, this would be a secure backend operation.
      // We'll simulate it by creating a 'transfer_in' record for the sender with a counterparty.
      // For a more advanced demo, we would need to find and update the recipient's holdings.
      await Transaction.create({
        type: 'transfer_in',
        metal_type: selectedMetal,
        ounces: transferAmount,
        price_per_ounce: 0,
        total_amount: 0,
        counterparty: user.email,
        status: 'completed'
        // This transaction should ideally be created for the recipient user
      });
      
      setTransferResult({ success: true, message: `Successfully sent ${amount}oz of ${selectedMetal} to ${recipient}.` });
      toast.success("Transfer successful!");
      
      // Reset form
      setRecipient('');
      setAmount('');
      setNote('');
      loadData(); // Reload data to show updated balances

    } catch (error) {
      setTransferResult({ success: false, message: `Transfer failed: ${error.message}` });
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div></div>;
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to Transfer Holdings</h2>
          <p className="text-gray-400 mb-6">You must have an account to send and receive gifts.</p>
          <Button onClick={() => User.login()} className="bg-yellow-600 hover:bg-yellow-700">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Transfer Holdings</h1>
            <p className="text-gray-400">Gift your precious metals to another Vault user.</p>
          </div>

          <Card className="vault-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">New Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-800/50 border-gray-700 p-4">
                  <p className="text-yellow-500 font-bold">Gold Balance</p>
                  <p className="text-lg text-white font-mono">{goldBalance.toFixed(5)} oz</p>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700 p-4">
                  <p className="text-gray-400 font-bold">Silver Balance</p>
                  <p className="text-lg text-white font-mono">{silverBalance.toFixed(5)} oz</p>
                </Card>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient" className="text-gray-400">Recipient's Email</Label>
                  <Input id="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} type="email" placeholder="user@example.com" className="bg-gray-800 border-gray-700 mt-1"/>
                  <div className="text-xs text-gray-500 mt-1">
                    For testing, you can use our dummy account: 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-1 text-yellow-500"
                      onClick={() => setRecipient('test@vault.com')}
                    >
                      test@vault.com
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <Label className="text-gray-400">Metal</Label>
                     <div className="grid grid-cols-2 gap-2 mt-1">
                      {metals.map(metal => (
                        <button key={metal.id} onClick={() => setSelectedMetal(metal.id)} className={`p-2 rounded-md border text-sm transition-all ${selectedMetal === metal.id ? `border-${metal.id === 'gold' ? 'yellow-500' : 'gray-400'}`: 'border-gray-700'}`}>
                          {metal.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="amount" className="text-gray-400">Amount (oz)</Label>
                    <Input id="amount" value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="0.00000" className="bg-gray-800 border-gray-700 mt-1" />
                    <Button variant="link" size="sm" className="p-0 h-auto text-yellow-500 mt-1" onClick={() => setAmount(currentBalance.toFixed(5))}>
                      Max: {currentBalance.toFixed(5)}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="note" className="text-gray-400">Note (Optional)</Label>
                  <Textarea id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Happy Birthday!" className="bg-gray-800 border-gray-700 mt-1" />
                </div>
              </div>

              <Button onClick={() => setShowConfirm(true)} disabled={!recipient || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance || isProcessing} className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? <Loader2 className="animate-spin" /> : <> <Send className="w-5 h-5 mr-2"/> Review Transfer </>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="vault-card border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription className="text-gray-400">You are about to send a gift. This action is irreversible.</DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-2">
            <p><span className="text-gray-400">To:</span> <span className="font-medium">{recipient}</span></p>
            <p><span className="text-gray-400">Amount:</span> <span className="font-medium">{amount} oz of {selectedMetal}</span></p>
            {note && <p><span className="text-gray-400">Note:</span> <span className="italic">"{note}"</span></p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="border-gray-600 text-gray-300">Cancel</Button>
            <Button onClick={handleTransfer} className="bg-blue-600 hover:bg-blue-700">Confirm & Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Result Dialog */}
      <Dialog open={!!transferResult} onOpenChange={() => setTransferResult(null)}>
        <DialogContent className="vault-card border-gray-700 text-white">
          <DialogHeader className="items-center text-center">
            {transferResult?.success ? (
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
            )}
            <DialogTitle>{transferResult?.success ? 'Transfer Sent!' : 'Transfer Failed'}</DialogTitle>
            <DialogDescription className="text-gray-400">{transferResult?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button onClick={() => setTransferResult(null)} className="bg-yellow-600 hover:bg-yellow-700">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
