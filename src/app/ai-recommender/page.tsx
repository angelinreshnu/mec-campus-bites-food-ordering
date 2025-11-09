"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Cloud, Sun, CloudRain, Smile, Frown, Meh, Heart, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meal {
  id: number;
  name: string;
  emoji: string;
  description: string;
  price: number;
  mood: string[];
  weather: string[];
}

const MEALS: Meal[] = [
  {
    id: 1,
    name: "Hot Soup & Sandwich",
    emoji: "🍜",
    description: "Warm and comforting for rainy days",
    price: 80,
    mood: ["sad", "tired"],
    weather: ["rainy", "cold"],
  },
  {
    id: 2,
    name: "Fresh Fruit Salad",
    emoji: "🥗",
    description: "Light and refreshing for sunny moods",
    price: 70,
    mood: ["happy", "energetic"],
    weather: ["sunny", "hot"],
  },
  {
    id: 3,
    name: "Spicy Biryani",
    emoji: "🍛",
    description: "Flavorful and satisfying",
    price: 120,
    mood: ["happy", "hungry"],
    weather: ["sunny", "normal"],
  },
  {
    id: 4,
    name: "Comfort Pasta",
    emoji: "🍝",
    description: "Creamy and soothing",
    price: 100,
    mood: ["sad", "stressed"],
    weather: ["rainy", "cold"],
  },
  {
    id: 5,
    name: "Energy Smoothie Bowl",
    emoji: "🥤",
    description: "Boost your energy instantly",
    price: 90,
    mood: ["energetic", "happy"],
    weather: ["sunny", "hot"],
  },
  {
    id: 6,
    name: "Hot Coffee & Cookies",
    emoji: "☕",
    description: "Perfect pick-me-up",
    price: 60,
    mood: ["tired", "neutral"],
    weather: ["rainy", "cold"],
  },
];

const MOODS = [
  { value: "happy", label: "Happy", icon: Smile, color: "bg-yellow-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "bg-blue-500" },
  { value: "energetic", label: "Energetic", icon: Zap, color: "bg-orange-500" },
  { value: "tired", label: "Tired", icon: Meh, color: "bg-gray-500" },
];

const WEATHER = [
  { value: "sunny", label: "Sunny", icon: Sun, color: "bg-yellow-400" },
  { value: "rainy", label: "Rainy", icon: CloudRain, color: "bg-blue-400" },
  { value: "cold", label: "Cold", icon: Cloud, color: "bg-gray-400" },
];

export default function AIRecommenderPage() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");
  const [recommendation, setRecommendation] = useState<Meal | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleGetRecommendation = () => {
    if (!selectedMood || !selectedWeather) {
      toast({
        title: "Missing Info",
        description: "Please select both mood and weather",
        variant: "destructive",
      });
      return;
    }

    // Filter meals based on mood and weather
    const filtered = MEALS.filter(
      (meal) =>
        meal.mood.includes(selectedMood) && meal.weather.includes(selectedWeather)
    );

    if (filtered.length > 0) {
      const randomMeal = filtered[Math.floor(Math.random() * filtered.length)];
      setShowAnimation(true);
      setTimeout(() => {
        setRecommendation(randomMeal);
        setShowAnimation(false);
      }, 1500);
    } else {
      // Fallback to random meal
      const randomMeal = MEALS[Math.floor(Math.random() * MEALS.length)];
      setRecommendation(randomMeal);
    }
  };

  const handleSurpriseMe = () => {
    setShowAnimation(true);
    setTimeout(() => {
      const randomMeal = MEALS[Math.floor(Math.random() * MEALS.length)];
      setRecommendation(randomMeal);
      setShowAnimation(false);
      
      toast({
        title: "Surprise! 🎉",
        description: `We picked ${randomMeal.name} for you!`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white mb-4 animate-pulse">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
            AI Food Recommender
          </h1>
          <p className="text-lg text-gray-700">
            Let AI suggest the perfect meal based on your mood & weather
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selection Panel */}
          <div className="space-y-6">
            {/* Mood Selection */}
            <Card className="border-2 border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  How are you feeling?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {MOODS.map((mood) => (
                    <Button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      variant={selectedMood === mood.value ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        selectedMood === mood.value
                          ? mood.color + " text-white hover:opacity-90"
                          : ""
                      }`}
                    >
                      <mood.icon className="w-6 h-6" />
                      <span className="text-sm font-semibold">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather Selection */}
            <Card className="border-2 border-pink-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-orange-600" />
                  What's the weather like?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {WEATHER.map((weather) => (
                    <Button
                      key={weather.value}
                      onClick={() => setSelectedWeather(weather.value)}
                      variant={selectedWeather === weather.value ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center gap-2 ${
                        selectedWeather === weather.value
                          ? weather.color + " text-white hover:opacity-90"
                          : ""
                      }`}
                    >
                      <weather.icon className="w-6 h-6" />
                      <span className="text-xs font-semibold">{weather.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGetRecommendation}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get AI Recommendation
              </Button>
              
              <Button
                onClick={handleSurpriseMe}
                variant="outline"
                className="w-full h-14 text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Zap className="w-5 h-5 mr-2" />
                Surprise Me!
              </Button>
            </div>
          </div>

          {/* Recommendation Display */}
          <div>
            <Card className="border-2 border-orange-300 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  Your Perfect Meal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showAnimation ? (
                  <div className="text-center py-20">
                    <div className="text-8xl mb-4 animate-bounce">🤖</div>
                    <p className="text-lg font-semibold text-gray-700 animate-pulse">
                      AI is thinking...
                    </p>
                  </div>
                ) : recommendation ? (
                  <div className="text-center space-y-4">
                    <div className="text-9xl mb-4 animate-bounce">{recommendation.emoji}</div>
                    
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                      {recommendation.name}
                    </h3>
                    
                    <p className="text-gray-600 text-lg">{recommendation.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {recommendation.mood.map((m) => (
                        <Badge key={m} className="bg-purple-100 text-purple-800">
                          {m}
                        </Badge>
                      ))}
                      {recommendation.weather.map((w) => (
                        <Badge key={w} className="bg-blue-100 text-blue-800">
                          {w}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-4">
                      <div className="inline-block bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-full text-2xl font-bold">
                        ₹{recommendation.price}
                      </div>
                    </div>

                    <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-orange-600 hover:opacity-90 h-12 text-lg">
                      Add to Cart
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Sparkles className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                      Select your mood and weather to get a personalized recommendation
                    </p>
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
