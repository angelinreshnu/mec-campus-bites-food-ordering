"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard, Search, Plus, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HelpPost {
  id: number;
  userId: string;
  userName: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  status: string;
  createdAt: string;
}

export default function HelpBoardPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<HelpPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<HelpPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Lost");

  const userId = "student1";
  const userName = "Rajesh Kumar";

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/help-posts?status=active&limit=50");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
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
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in title and description",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/help-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim() || null,
          category,
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      toast({
        title: "Posted!",
        description: "Your post is now live on the help board",
      });

      setTitle("");
      setDescription("");
      setImageUrl("");
      setCategory("Lost");
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

  const handleMarkResolved = async (postId: number) => {
    try {
      const response = await fetch(`/api/help-posts?id=${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast({
        title: "Success",
        description: "Post marked as resolved",
      });

      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Lost":
        return "bg-red-100 text-red-800";
      case "Found":
        return "bg-green-100 text-green-800";
      case "Help":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4">
            <Clipboard className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Campus Help Board
          </h1>
          <p className="text-lg text-blue-700">
            Lost & Found • Help Requests • Community Support
          </p>
        </div>

        {/* Create Post Button */}
        {!showCreate && (
          <div className="mb-6">
            <Button
              onClick={() => setShowCreate(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post to Help Board
            </Button>
          </div>
        )}

        {/* Create Post Form */}
        {showCreate && (
          <Card className="mb-6 border-2 border-blue-500">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Tabs value={category} onValueChange={setCategory}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="Lost">Lost</TabsTrigger>
                    <TabsTrigger value="Found">Found</TabsTrigger>
                    <TabsTrigger value="Help">Help Needed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Lost: Black Earphones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the item or help needed..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL (Optional)
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post to Board"
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

        {/* Filter Tabs */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="All">All Posts</TabsTrigger>
                <TabsTrigger value="Lost">Lost</TabsTrigger>
                <TabsTrigger value="Found">Found</TabsTrigger>
                <TabsTrigger value="Help">Help</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Clipboard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No posts in this category yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              >
                {post.imageUrl && (
                  <div className="relative h-48">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                    {post.status === "resolved" && (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Resolved
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.description}
                  </p>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      Posted by {post.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {post.status === "active" && (
                    <Button
                      onClick={() => handleMarkResolved(post.id)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Mark as Resolved
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
