"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Coffee, Sun, Moon, Clock, Star, Zap } from "lucide-react";

export default function Home() {
  const mealTimes = [
  {
    icon: Coffee,
    title: "Breakfast",
    time: "6:00 AM - 10:00 AM",
    description: "Start your day with fresh Idli, Dosa, and more South Indian delights",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
    href: "/menu?category=breakfast",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    icon: Sun,
    title: "Lunch",
    time: "12:00 PM - 3:00 PM",
    description: "Enjoy hearty Meals, Biryani, and delicious rice varieties",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
    href: "/menu?category=lunch",
    gradient: "from-red-500 to-pink-500"
  },
  {
    icon: Moon,
    title: "Dinner",
    time: "6:00 PM - 10:00 PM",
    description: "Wind down with light Dosa varieties and comfort food",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976",
    href: "/menu?category=dinner",
    gradient: "from-purple-500 to-indigo-500"
  }];


  const features = [
  {
    icon: Clock,
    title: "Quick Orders",
    description: "Order in advance and skip the queue"
  },
  {
    icon: Star,
    title: "Fresh & Authentic",
    description: "Traditional South Indian recipes"
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Real-time order status notifications"
  }];


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />

      {/* Hero Section */}
      <section className="container px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* College Logo Placeholder */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">MEC</div>
                <div className="text-xs text-muted-foreground">1949</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Campus Bites
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Madras Engineering College
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Order your favorite South Indian food from campus canteens. Skip the queue, save time, and enjoy delicious meals!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Link href="/menu">
                Order Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-12 !w-full !h-[267px] !max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) =>
          <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Meal Times Section */}
      <section className="container px-4 py-12 md:py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Choose Your Meal Time</h2>
          <p className="text-lg text-muted-foreground">Fresh food available throughout the day</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mealTimes.map((meal, index) =>
          <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                src={meal.image}
                alt={meal.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300" />

                <div className={`absolute inset-0 bg-gradient-to-t ${meal.gradient} opacity-60`} />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <meal.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-2xl font-bold">{meal.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {meal.time}
                </div>
                <p className="text-muted-foreground">{meal.description}</p>
                <Button asChild className="w-full mt-4">
                  <Link href={meal.href}>
                    View {meal.title} Menu
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-12 md:py-20">
        <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Order?</h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Join hundreds of students who are saving time and enjoying great food every day
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/login">
                Get Started
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Campus Bites - Madras Engineering College. All rights reserved.</p>
        </div>
      </footer>
    </div>);

}