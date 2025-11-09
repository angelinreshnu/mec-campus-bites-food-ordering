"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Clock, Coffee, Sandwich, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  icon: string;
}

const NIGHT_MENU: MenuItem[] = [
  { id: 1, name: "Maggi Noodles", price: 30, icon: "🍜" },
  { id: 2, name: "Veg Sandwich", price: 40, icon: "🥪" },
  { id: 3, name: "Cheese Sandwich", price: 50, icon: "🧀" },
  { id: 4, name: "Hot Coffee", price: 20, icon: "☕" },
  { id: 5, name: "Tea", price: 15, icon: "🍵" },
  { id: 6, name: "Veg Momos", price: 45, icon: "🥟" },
  { id: 7, name: "Chicken Momos", price: 60, icon: "🥟" },
  { id: 8, name: "Paratha", price: 35, icon: "🫓" },
];

export default function HostelOrdersPage() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate time left until 11 PM
      const endTime = new Date(now);
      endTime.setHours(23, 0, 0, 0);
      
      const diff = endTime.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Closed");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isAvailable = () => {
    const hour = currentTime.getHours();
    return hour >= 21 && hour < 23; // 9 PM to 11 PM
  };

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.item.id === item.id 
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart!",
      description: `${item.name} added`,
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500 text-white mb-4 shadow-lg shadow-purple-500/50">
            <Moon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Hostel Night Orders
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </h1>
          <p className="text-lg text-purple-200">
            Late night cravings? We've got you covered!
          </p>
        </div>

        {/* Availability Status */}
        <Card className="mb-6 bg-gray-800/50 backdrop-blur border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${isAvailable() ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    {isAvailable() ? "🌙 Open Now" : "😴 Currently Closed"}
                  </p>
                  <p className="text-purple-300 text-sm">
                    {isAvailable() 
                      ? `Open until 11:00 PM • Time left: ${timeLeft}` 
                      : "Opens at 9:00 PM • Come back tonight!"}
                  </p>
                </div>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        {!isAvailable() && (
          <Card className="mb-6 bg-purple-900/30 border-purple-500/30">
            <CardContent className="pt-6 text-center">
              <Moon className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Hostel Kitchen is Closed
              </h3>
              <p className="text-purple-200">
                We serve late-night snacks from 9:00 PM to 11:00 PM every day.
                <br />
                Come back during these hours to place your order!
              </p>
            </CardContent>
          </Card>
        )}

        {isAvailable() && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/50 backdrop-blur border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    Night Menu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {NIGHT_MENU.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border border-purple-500/20 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-4xl">{item.icon}</span>
                            <div>
                              <h4 className="font-semibold text-white">{item.name}</h4>
                              <p className="text-purple-400 font-bold">₹{item.price}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => addToCart(item)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart */}
            <div>
              <Card className="bg-gray-800/50 backdrop-blur border-purple-500/30 sticky top-20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sandwich className="w-5 h-5" />
                    Your Cart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <Moon className="w-12 h-12 mx-auto text-purple-400 mb-2 opacity-50" />
                      <p className="text-purple-300 text-sm">Cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {cart.map((c, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-white">
                            <span>{c.item.name} x{c.quantity}</span>
                            <span className="text-purple-400">₹{c.item.price * c.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-purple-500/30 pt-3 mb-4">
                        <div className="flex justify-between text-lg font-bold text-white">
                          <span>Total:</span>
                          <span className="text-purple-400">₹{getTotalPrice()}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50"
                        onClick={() => {
                          toast({
                            title: "Order Placed!",
                            description: "Your late-night snacks are being prepared 🌙",
                          });
                          setCart([]);
                        }}
                      >
                        Place Order
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
