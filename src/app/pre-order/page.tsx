"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Loader2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

interface PreOrder {
  id: number;
  orderItems: any[];
  pickupTime: string;
  status: string;
  createdAt: string;
}

interface CanteenStatus {
  currentCrowdLevel: string;
  lastUpdated: string;
}

export default function PreOrderPage() {
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCart();
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [canteenStatus, setCanteenStatus] = useState<CanteenStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [pickupTime, setPickupTime] = useState("");

  const userId = "student1";

  useEffect(() => {
    fetchOrders();
    fetchCanteenStatus();
    // Refresh canteen status every 30 seconds
    const interval = setInterval(fetchCanteenStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/pre-orders?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCanteenStatus = async () => {
    try {
      const response = await fetch("/api/canteen-status");
      if (!response.ok) throw new Error("Failed to fetch status");
      const data = await response.json();
      setCanteenStatus(data);
    } catch (error) {
      console.error("Failed to fetch canteen status:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!pickupTime) {
      toast({
        title: "Error",
        description: "Please select a pickup time",
        variant: "destructive",
      });
      return;
    }

    setPlacing(true);
    try {
      const orderItems = items.map(item => ({
        menuItemId: item.id,
        menuItemName: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const response = await fetch("/api/pre-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          orderItems,
          pickupTime,
        }),
      });

      if (!response.ok) throw new Error("Failed to place order");

      toast({
        title: "Success!",
        description: "Pre-order placed successfully. We'll notify you when it's ready!",
      });

      clearCart();
      setPickupTime("");
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "High": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "ready": return "bg-green-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Pre-Order & Beat the Queue
          </h1>
          <p className="text-lg text-blue-700">
            Order in advance and skip the waiting line!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Canteen Status & Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Canteen Crowd Level */}
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Canteen Status</span>
                  {canteenStatus && (
                    <Badge className={`${getCrowdColor(canteenStatus.currentCrowdLevel)} text-white`}>
                      {canteenStatus.currentCrowdLevel} Crowd
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${canteenStatus ? getCrowdColor(canteenStatus.currentCrowdLevel) : 'bg-gray-500'} animate-pulse`}></div>
                      <span className="text-sm text-muted-foreground">Live Status</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {canteenStatus?.currentCrowdLevel === "Low" && "Great time to order! Minimal wait time."}
                      {canteenStatus?.currentCrowdLevel === "Medium" && "Moderate crowd. Pre-order to save time!"}
                      {canteenStatus?.currentCrowdLevel === "High" && "High crowd! Pre-order highly recommended."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Place Pre-Order */}
            <Card>
              <CardHeader>
                <CardTitle>Place Your Pre-Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">Your cart is empty</p>
                    <Button variant="outline" onClick={() => window.location.href = '/menu'}>
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Your Items:</h4>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t font-semibold flex justify-between">
                        <span>Total:</span>
                        <span>₹{getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Pickup Time
                      </label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={placing || !pickupTime}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {placing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Pre-Order"
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Your Orders */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Pre-Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pre-orders yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3 border rounded-lg bg-white space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {order.orderItems.length} items
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} text-white capitalize`}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        {order.status === "ready" && (
                          <div className="flex items-center space-x-2 text-green-600 text-sm font-medium animate-pulse">
                            <Bell className="w-4 h-4" />
                            <span>Your food is ready!</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
