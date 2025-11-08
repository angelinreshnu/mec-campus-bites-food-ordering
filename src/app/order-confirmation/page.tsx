"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, Clock, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderDetails {
  orderId: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    hostel: string;
    roomNumber: string;
    specialInstructions?: string;
  };
  paymentMethod: string;
  orderDate: string;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [estimatedTime, setEstimatedTime] = useState(30);

  useEffect(() => {
    // Load order details from localStorage
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      const order = JSON.parse(lastOrder);
      setOrderDetails(order);
    } else {
      // Redirect to home if no order found
      router.push("/");
    }
  }, [router]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <Navigation />
        <div className="container px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalWithGST = orderDetails.total * 1.05;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />

      <div className="container px-4 py-8">
        {/* Success Message */}
        <Card className="max-w-2xl mx-auto mb-8 border-green-200 dark:border-green-900">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Your order has been successfully placed
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-mono font-semibold">
              <Package className="w-4 h-4" />
              Order ID: {orderDetails.orderId}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Estimated Delivery Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">{estimatedTime}</div>
                  <div>
                    <p className="font-semibold">Minutes</p>
                    <p className="text-sm text-muted-foreground">
                      Your food will arrive soon!
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">Order Confirmed</span>
                    <span className="text-muted-foreground ml-auto">Just now</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-muted"></div>
                    <span>Preparing your food</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-muted"></div>
                    <span>Out for delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-muted"></div>
                    <span>Delivered</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-semibold">{orderDetails.customerInfo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {orderDetails.customerInfo.hostel}, Room {orderDetails.customerInfo.roomNumber}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {orderDetails.customerInfo.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {orderDetails.customerInfo.email}
                </div>
                {orderDetails.customerInfo.specialInstructions && (
                  <div className="mt-3 p-3 rounded-md bg-muted">
                    <p className="text-sm font-medium mb-1">Special Instructions:</p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.customerInfo.specialInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="font-semibold text-primary mt-1">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{orderDetails.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (5%)</span>
                    <span>₹{(orderDetails.total * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Paid</span>
                      <span className="text-primary">₹{totalWithGST.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      Payment Method:{" "}
                      <span className="font-medium text-foreground capitalize">
                        {orderDetails.paymentMethod === "gpay"
                          ? "Google Pay"
                          : orderDetails.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/menu">Order Again</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
