"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart, MenuItem } from "@/contexts/CartContext";
import { Plus, Loader2, Coffee, Sun, Moon } from "lucide-react";
import Image from "next/image";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "breakfast";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      setMenuItems(data.menuItems || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory && item.available
  );

  const categories = [
    { value: "breakfast", label: "Breakfast", icon: Coffee, color: "from-orange-500 to-yellow-500" },
    { value: "lunch", label: "Lunch", icon: Sun, color: "from-red-500 to-pink-500" },
    { value: "dinner", label: "Dinner", icon: Moon, color: "from-purple-500 to-indigo-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />

      <div className="container px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Menu</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Delicious South Indian cuisine made fresh daily
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 h-auto p-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            categories.map((category) => (
              <TabsContent key={category.value} value={category.value}>
                {filteredItems.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-lg text-muted-foreground">
                      No items available in this category yet.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden hover:shadow-xl transition-shadow border-2 group"
                      >
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`} />
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                            <Badge variant="secondary" className="shrink-0">
                              ₹{item.price}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            onClick={() => addToCart(item)}
                            className="w-full"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))
          )}
        </Tabs>
      </div>
    </div>
  );
}
