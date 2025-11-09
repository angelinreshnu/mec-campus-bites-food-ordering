"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassSchedule {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  className: string;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SmartDeliveryPage() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  // Form state
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [className, setClassName] = useState("");

  // Mock user ID (in real app, get from auth)
  const userId = "student1";

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`/api/schedules?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch schedules");
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load schedules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dayOfWeek || !startTime || !endTime || !className) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          dayOfWeek,
          startTime,
          endTime,
          className,
        }),
      });

      if (!response.ok) throw new Error("Failed to add schedule");

      toast({
        title: "Success",
        description: "Class schedule added!",
      });

      // Reset form
      setDayOfWeek("");
      setStartTime("");
      setEndTime("");
      setClassName("");
      
      fetchSchedules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add schedule",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      const response = await fetch(`/api/schedules?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete schedule");

      toast({
        title: "Success",
        description: "Schedule deleted",
      });

      fetchSchedules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive",
      });
    }
  };

  const calculateDeliveryTime = () => {
    if (schedules.length === 0) return "No classes scheduled";
    
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todaySchedules = schedules.filter(s => s.dayOfWeek === today);
    
    if (todaySchedules.length === 0) return "No classes today - Order anytime!";
    
    // Get last class end time
    const lastClass = todaySchedules.reduce((latest, current) => {
      return current.endTime > latest.endTime ? current : latest;
    });
    
    return `After ${lastClass.endTime} (after your last class)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />
      
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-2">
            Smart Delivery Time
          </h1>
          <p className="text-lg text-green-700">
            Set your class schedule and we'll deliver after class hours
          </p>
        </div>

        {/* Delivery Time Info */}
        <Card className="mb-6 border-2 border-green-500 bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-green-900 mb-1">
                  Your Delivery Window
                </h3>
                <p className="text-green-700 text-lg">
                  {calculateDeliveryTime()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Schedule Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Class Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g., Data Structures"
                  />
                </div>

                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={adding}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {adding ? "Adding..." : "Add Class"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Class Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading schedules...</p>
            ) : schedules.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No schedules added yet. Add your first class above!
              </p>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">
                        {schedule.className}
                      </h4>
                      <p className="text-sm text-green-700">
                        {schedule.dayOfWeek} • {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
