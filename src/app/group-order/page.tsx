"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Copy, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroupOrder {
  id: number;
  joinCode: string;
  groupName: string;
  totalAmount: number;
  status: string;
}

interface Participant {
  id: number;
  userName: string;
  amount: number;
  orderItems: any[];
}

export default function GroupOrderPage() {
  const { toast } = useToast();
  const [view, setView] = useState<"home" | "create" | "join" | "active">("home");
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [activeGroup, setActiveGroup] = useState<GroupOrder | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const userId = "student1";
  const userName = "Rajesh Kumar";

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/group-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: userId,
          groupName: groupName.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create group");

      const data = await response.json();
      setActiveGroup(data);
      setView("active");
      
      toast({
        title: "Success!",
        description: "Group order created. Share the code with friends!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a join code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/group-orders?code=${joinCode.trim()}`);
      if (!response.ok) throw new Error("Group not found");

      const data = await response.json();
      setActiveGroup(data);
      fetchParticipants(data.id);
      setView("active");
    } catch (error) {
      toast({
        title: "Error",
        description: "Group not found. Check the code and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (groupOrderId: number) => {
    try {
      const response = await fetch(`/api/group-orders/join?groupOrderId=${groupOrderId}`);
      if (!response.ok) throw new Error("Failed to fetch participants");
      
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    }
  };

  const handleCopyCode = () => {
    if (activeGroup) {
      navigator.clipboard.writeText(activeGroup.joinCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Join code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateSplitAmount = () => {
    if (!activeGroup || participants.length === 0) return 0;
    return activeGroup.totalAmount / participants.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Group Order / Friends Combo
          </h1>
          <p className="text-lg text-blue-700">
            Order together and split the bill automatically
          </p>
        </div>

        {view === "home" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView("create")}>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Create Group Order</h3>
                <p className="text-muted-foreground">
                  Start a new group order and invite friends
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Group
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView("join")}>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-100 mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold">Join Group Order</h3>
                <p className="text-muted-foreground">
                  Join an existing group with a code
                </p>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Join Group
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "create" && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Group Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Lunch Squad, Dinner Gang"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Creating..." : "Create Group"}
                </Button>
                <Button
                  onClick={() => setView("home")}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === "join" && (
          <Card>
            <CardHeader>
              <CardTitle>Join Group Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="joinCode">Join Code</Label>
                <Input
                  id="joinCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleJoinGroup}
                  disabled={loading}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {loading ? "Joining..." : "Join Group"}
                </Button>
                <Button
                  onClick={() => setView("home")}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === "active" && activeGroup && (
          <div className="space-y-6">
            {/* Group Info */}
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{activeGroup.groupName}</span>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {activeGroup.joinCode}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">₹{activeGroup.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Split Per Person</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{calculateSplitAmount().toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Participants ({participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No participants yet. Share the code to invite friends!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{participant.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.orderItems.length} items
                          </p>
                        </div>
                        <p className="font-bold text-lg">₹{participant.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                setView("home");
                setActiveGroup(null);
                setParticipants([]);
              }}
              variant="outline"
              className="w-full"
            >
              Leave Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
