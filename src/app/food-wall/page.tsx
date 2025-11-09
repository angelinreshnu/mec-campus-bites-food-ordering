"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Camera, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodPost {
  id: number;
  userId: string;
  userName: string;
  imageUrl: string;
  caption: string;
  hashtags: string | null;
  likesCount: number;
  createdAt: string;
}

export default function FoodWallPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  const userId = "student1";
  const userName = "Rajesh Kumar";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/food-posts?limit=20");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!imageUrl || !caption) {
      toast({
        title: "Error",
        description: "Please provide image URL and caption",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/food-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          imageUrl: imageUrl.trim(),
          caption: caption.trim(),
          hashtags: hashtags.trim() || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      toast({
        title: "Posted!",
        description: "Your food photo is now live on the wall!",
      });

      setImageUrl("");
      setCaption("");
      setHashtags("");
      setShowCreate(false);
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/food-posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.code === "ALREADY_LIKED") {
          toast({
            title: "Already liked",
            description: "You've already liked this post",
          });
        }
        return;
      }

      fetchPosts();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-red-50">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 via-pink-500 to-red-500 text-white mb-4">
            <Camera className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
            Food Mood Wall
          </h1>
          <p className="text-lg text-gray-700">
            Share your food moments with the campus community
          </p>
        </div>

        {/* Create Post Button */}
        {!showCreate && (
          <div className="mb-6">
            <Button
              onClick={() => setShowCreate(true)}
              className="w-full bg-gradient-to-r from-yellow-500 via-pink-500 to-red-500 hover:opacity-90 h-14 text-lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Share Your Food Photo
            </Button>
          </div>
        )}

        {/* Create Post Form */}
        {showCreate && (
          <Card className="mb-6 border-2 border-pink-500">
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/food-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Caption</label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your delicious meal..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hashtags</label>
                <Input
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#FoodieLife #YummyFood #CampusBites"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={creating}
                  className="flex-1 bg-gradient-to-r from-yellow-500 via-pink-500 to-red-500 hover:opacity-90"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowCreate(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-pink-600" />
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all border-2 hover:border-pink-500">
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-semibold">{post.userName}</p>
                    <p className="text-white/80 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <CardContent className="pt-4 space-y-3">
                  <p className="text-sm">{post.caption}</p>
                  
                  {post.hashtags && (
                    <p className="text-xs text-blue-600">{post.hashtags}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      onClick={() => handleLike(post.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Heart className="w-4 h-4 mr-1" fill="currentColor" />
                      {post.likesCount}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
