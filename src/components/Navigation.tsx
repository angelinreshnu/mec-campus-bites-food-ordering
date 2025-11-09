"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ShoppingCart, User, LogOut, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

export default function Navigation() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const cartItemsCount = getTotalItems();

  useEffect(() => {
    // Check login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail") || "";
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About" },
  ];

  const featureLinks = [
    { href: "/smart-delivery", label: "Smart Delivery", icon: "🕐" },
    { href: "/pre-order", label: "Pre-Order", icon: "⏱️" },
    { href: "/group-order", label: "Group Order", icon: "👥" },
    { href: "/wallet", label: "Wallet", icon: "💰" },
    { href: "/hostel-orders", label: "Night Orders", icon: "🌙" },
    { href: "/meal-suggestor", label: "Meal Suggestor", icon: "🥗" },
    { href: "/food-wall", label: "Food Wall", icon: "📸" },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { href: "/ai-recommender", label: "AI Recommender", icon: "🤖" },
    { href: "/help-board", label: "Help Board", icon: "📋" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <span className="text-xl font-bold text-white">CB</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Campus Bites
            </span>
            <p className="text-xs text-muted-foreground">Madras Engineering College</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Features Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Features
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Campus Bites 2.0</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {featureLinks.map((feature) => (
                <DropdownMenuItem key={feature.href} asChild>
                  <Link href={feature.href} className="cursor-pointer">
                    <span className="mr-2">{feature.icon}</span>
                    {feature.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Desktop User Menu */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">My Account</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 overflow-y-auto">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    New Features
                  </p>
                  {featureLinks.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-sm py-2 transition-colors hover:text-primary"
                    >
                      <span>{feature.icon}</span>
                      <span>{feature.label}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  {isLoggedIn ? (
                    <>
                      <div className="mb-4 px-2">
                        <p className="text-sm font-medium">Logged in as:</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {userEmail}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start text-destructive hover:text-destructive"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        <span className="text-lg">Logout</span>
                      </Button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-lg font-medium transition-colors hover:text-primary"
                    >
                      <User className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}