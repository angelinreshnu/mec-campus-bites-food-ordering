"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletData {
  id: number;
  userId: string;
  balance: number;
  updatedAt: string;
}

interface Transaction {
  id: number;
  amount: number;
  transactionType: string;
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState("");
  const [showAddMoney, setShowAddMoney] = useState(false);

  const userId = "student1";

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await fetch(`/api/wallet?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch wallet");
      const data = await response.json();
      setWallet(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/wallet/transactions?userId=${userId}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleAddMoney = async () => {
    const amountNum = parseFloat(amount);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      const response = await fetch("/api/wallet/add-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: amountNum,
          description: "Wallet top-up",
        }),
      });

      if (!response.ok) throw new Error("Failed to add money");

      toast({
        title: "Success!",
        description: `₹${amountNum.toFixed(2)} added successfully`,
      });

      setAmount("");
      setShowAddMoney(false);
      fetchWallet();
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add money",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Navigation />
        <div className="container px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-orange-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-orange-900 mb-2">
            College Meal Wallet
          </h1>
          <p className="text-lg text-orange-700">
            Manage your food wallet balance
          </p>
        </div>

        {/* Wallet Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm opacity-90 mb-1">Available Balance</p>
                <p className="text-5xl font-bold">₹{wallet?.balance.toFixed(2)}</p>
              </div>
              <Wallet className="w-16 h-16 opacity-30" />
            </div>
            
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs font-bold">CB</span>
              </div>
              <div>
                <p className="font-medium">Campus Bites Wallet</p>
                <p className="text-xs opacity-75">Madras Engineering College</p>
              </div>
            </div>
          </div>

          <CardContent className="pt-6">
            {!showAddMoney ? (
              <Button
                onClick={() => setShowAddMoney(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 h-12 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Money
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Enter Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddMoney}
                    disabled={adding}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
                  >
                    {adding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Money"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddMoney(false);
                      setAmount("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((preset) => (
                    <Button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      variant="outline"
                      size="sm"
                    >
                      ₹{preset}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.transactionType === "credit" 
                          ? "bg-green-100" 
                          : "bg-red-100"
                      }`}>
                        {transaction.transactionType === "credit" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()} • {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg ${
                      transaction.transactionType === "credit" 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {transaction.transactionType === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
