"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Star, TrendingUp, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStat {
  id: number;
  userId: string;
  userName: string;
  totalOrders: number;
  totalSpent: number;
  badges: string;
  rank: number;
}

export default function LeaderboardPage() {
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard?limit=10");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      const data = await response.json();
      setLeaderboard(data);
      
      // Trigger confetti for top 3
      if (data.length > 0) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Trophy className="w-7 h-7 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700";
      default:
        return "bg-white";
    }
  };

  const getRankTitle = (rank: number) => {
    switch (rank) {
      case 1:
        return "Canteen King 👑";
      case 2:
        return "Foodie Champion 🏆";
      case 3:
        return "Snack Master 🍔";
      default:
        return "";
    }
  };

  const parseBadges = (badgesJson: string): string[] => {
    try {
      return JSON.parse(badgesJson);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <Navigation />
        <div className="container px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-yellow-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      <Navigation />
      
      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["🎉", "⭐", "🏆", "👑", "🎊"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="container px-4 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-4 animate-pulse">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
            Top Foodies of the Week
            <Sparkles className="w-8 h-8 text-yellow-500 animate-bounce" />
          </h1>
          <p className="text-lg text-gray-700">
            Campus food legends ranked by total spending
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-12">
            <div className="grid grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
              {/* 2nd Place */}
              <Card className="border-4 border-gray-300 shadow-xl transform hover:scale-105 transition-transform">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                    2
                  </div>
                  <Trophy className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="font-bold text-lg mb-1">{leaderboard[1].userName}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {leaderboard[1].totalOrders} orders
                  </p>
                  <p className="text-2xl font-bold text-gray-600">
                    ₹{leaderboard[1].totalSpent.toFixed(0)}
                  </p>
                </CardContent>
              </Card>

              {/* 1st Place */}
              <Card className="border-4 border-yellow-400 shadow-2xl transform scale-110 hover:scale-115 transition-transform">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold animate-pulse">
                    1
                  </div>
                  <Crown className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                  <p className="font-bold text-xl mb-1">{leaderboard[0].userName}</p>
                  <Badge className="mb-2 bg-yellow-500 text-white">Canteen King 👑</Badge>
                  <p className="text-sm text-muted-foreground mb-2">
                    {leaderboard[0].totalOrders} orders
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    ₹{leaderboard[0].totalSpent.toFixed(0)}
                  </p>
                </CardContent>
              </Card>

              {/* 3rd Place */}
              <Card className="border-4 border-amber-500 shadow-xl transform hover:scale-105 transition-transform">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                    3
                  </div>
                  <Trophy className="w-10 h-10 mx-auto mb-2 text-amber-600" />
                  <p className="font-bold text-lg mb-1">{leaderboard[2].userName}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {leaderboard[2].totalOrders} orders
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    ₹{leaderboard[2].totalSpent.toFixed(0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-md transition-all ${
                      user.rank <= 3
                        ? getRankBgColor(user.rank) + " text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-bold text-lg ${user.rank <= 3 ? "text-white" : "text-gray-900"}`}>
                            {user.userName}
                          </p>
                          {user.rank <= 3 && (
                            <Badge className="bg-white/20 text-white">
                              {getRankTitle(user.rank)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={user.rank <= 3 ? "text-white/90" : "text-muted-foreground"}>
                            {user.totalOrders} orders
                          </span>
                          <div className="flex gap-1">
                            {parseBadges(user.badges).slice(0, 3).map((badge, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className={`text-xs ${user.rank <= 3 ? "bg-white/20 text-white border-white/30" : ""}`}
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-xs ${user.rank <= 3 ? "text-white/80" : "text-muted-foreground"} mb-1`}>
                        Total Spent
                      </p>
                      <p className={`text-2xl font-bold ${user.rank <= 3 ? "text-white" : "text-orange-600"}`}>
                        ₹{user.totalSpent.toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
