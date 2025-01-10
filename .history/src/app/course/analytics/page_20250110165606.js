"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  ArrowUp,
  ArrowDown,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CourseAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const router = useRouter();

  // Mock data
  const engagementData = [
    { date: "Week 1", activeUsers: 120, completionRate: 85, quizScore: 78 },
    { date: "Week 2", activeUsers: 145, completionRate: 82, quizScore: 81 },
    { date: "Week 3", activeUsers: 165, completionRate: 88, quizScore: 75 },
    { date: "Week 4", activeUsers: 180, completionRate: 90, quizScore: 82 },
  ];

  const feedbackData = [
    { name: "Positive", value: 65, color: "#22c55e" },
    { name: "Neutral", value: 25, color: "#94a3b8" },
    { name: "Negative", value: 10, color: "#ef4444" },
  ];



  const suggestions = [
    "Add more interactive elements to Week 2 content",
    "Consider providing additional examples for Quiz 3",
    "Create more practice exercises for challenging topics",
    "Include more real-world applications in lessons",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
           
              <h1 className="text-2xl font-bold">Course Analytics</h1>
              <p className="text-gray-500">Introduction to Machine Learning</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Students
                  </p>
                  <h3 className="text-2xl font-bold mt-2">180</h3>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    12% vs last week
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Completion Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-2">85%</h3>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    5% vs last week
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

         

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Avg. Time Spent
                  </p>
                  <h3 className="text-2xl font-bold mt-2">45m</h3>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    8% vs last week
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>Student activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#2563eb"
                    />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#22c55e"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Sentiment */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Sentiment</CardTitle>
              <CardDescription>Overall course feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feedbackData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {feedbackData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* <div className="flex justify-center space-x-4 mt-4">
                  {feedbackData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div> */}
              </div>
            </CardContent>
          </Card>

        
          {/* Improvement Suggestions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Suggested Improvements</CardTitle>
              <CardDescription>
                Based on student performance and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                    </div>
                    <p className="text-gray-600">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
