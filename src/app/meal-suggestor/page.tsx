"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Heart, Zap, Flame, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MealOption {
  id: number;
  name: string;
  calories: number;
  price: number;
  category: string;
  image: string;
  protein: number;
  tags: string[];
}

const MEALS: MealOption[] = [
  {
    id: 1,
    name: "Healthy Salad Bowl",
    calories: 250,
    price: 80,
    category: "Healthy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop",
    protein: 12,
    tags: ["Low-Cal", "Fresh", "Vegan"]
  },
  {
    id: 2,
    name: "Grilled Chicken Rice",
    calories: 450,
    price: 120,
    category: "High-Protein",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&auto=format&fit=crop",
    protein: 35,
    tags: ["High-Protein", "Filling"]
  },
  {
    id: 3,
    name: "Spicy Paneer Tikka",
    calories: 350,
    price: 100,
    category: "Spicy",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop",
    protein: 18,
    tags: ["Spicy", "Vegetarian"]
  },
  {
    id: 4,
    name: "Quinoa Buddha Bowl",
    calories: 320,
    price: 90,
    category: "Healthy",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop",
    protein: 14,
    tags: ["Healthy", "Balanced"]
  },
  {
    id: 5,
    name: "Egg White Omelette",
    calories: 180,
    price: 60,
    category: "High-Protein",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop",
    protein: 28,
    tags: ["High-Protein", "Low-Cal"]
  },
  {
    id: 6,
    name: "Chilli Chicken",
    calories: 420,
    price: 130,
    category: "Spicy",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&auto=format&fit=crop",
    protein: 30,
    tags: ["Spicy", "High-Protein"]
  },
];

export default function MealSuggestorPage() {
  const { toast } = useToast();
  const [budget, setBudget] = useState("");
  const [preference, setPreference] = useState("");
  const [suggestions, setSuggestions] = useState<MealOption[]>([]);

  const handleGetSuggestions = () => {
    if (!budget || !preference) {
      toast({
        title: "Missing Info",
        description: "Please select both budget and preference",
        variant: "destructive",
      });
      return;
    }

    const budgetNum = parseInt(budget);
    let filtered = MEALS.filter(meal => meal.price <= budgetNum);
    
    if (preference !== "Any") {
      filtered = filtered.filter(meal => meal.category === preference);
    }

    setSuggestions(filtered);
    
    toast({
      title: "Suggestions Ready!",
      description: `Found ${filtered.length} meals for you`,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Healthy": return <Leaf className="w-4 h-4" />;
      case "High-Protein": return <Zap className="w-4 h-4" />;
      case "Spicy": return <Flame className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Healthy": return "bg-green-500";
      case "High-Protein": return "bg-blue-500";
      case "Spicy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-2 flex items-center justify-center gap-2">
            Smart Meal Suggestor
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </h1>
          <p className="text-lg text-green-700">
            Get personalized meal recommendations based on your preferences
          </p>
        </div>

        {/* Selection Form */}
        <Card className="mb-8 border-2 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-600" />
              What are you looking for?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-green-900">
                  Your Budget (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["50", "80", "100", "150"].map((val) => (
                    <Button
                      key={val}
                      onClick={() => setBudget(val)}
                      variant={budget === val ? "default" : "outline"}
                      className={budget === val ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Up to ₹{val}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-green-900">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Healthy", "High-Protein", "Spicy", "Any"].map((pref) => (
                    <Button
                      key={pref}
                      onClick={() => setPreference(pref)}
                      variant={preference === pref ? "default" : "outline"}
                      className={preference === pref ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {pref === "Healthy" && <Leaf className="w-4 h-4 mr-1" />}
                      {pref === "High-Protein" && <Zap className="w-4 h-4 mr-1" />}
                      {pref === "Spicy" && <Flame className="w-4 h-4 mr-1" />}
                      {pref}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleGetSuggestions}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 h-12 text-lg"
            >
              Get Meal Suggestions
            </Button>
          </CardContent>
        </Card>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Recommended for You ({suggestions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((meal) => (
                <Card key={meal.id} className="overflow-hidden hover:shadow-xl transition-shadow border-2 hover:border-green-500">
                  <div className="relative h-48">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getCategoryColor(meal.category)} text-white flex items-center gap-1`}>
                        {getCategoryIcon(meal.category)}
                        {meal.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex items-center space-x-2">
                        <Leaf className="w-4 h-4 text-green-400" />
                        {meal.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-xs text-muted-foreground">Calories</p>
                        <p className="font-semibold text-green-900">{meal.calories}</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-muted-foreground">Protein</p>
                        <p className="font-semibold text-blue-900">{meal.protein}g</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold text-orange-900">₹{meal.price}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
