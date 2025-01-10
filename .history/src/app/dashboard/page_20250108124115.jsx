"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Book,
  Plus,
  BarChart,
  Bell,
  Settings,
  LogOut,
  User,
  Download,
  Edit,
  MessageSquare,
  Clock,
  Users,
  GraduationCap,
  Laptop,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  // Mock data for courses
  const recentCourses = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      status: "Published",
      lastEdited: "2 days ago",
      students: 45,
      completion: 92,
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      status: "Draft",
      lastEdited: "5 days ago",
      students: 0,
      completion: 0,
    },
    {
      id: 3,
      title: "Basic Programming Concepts",
      status: "In Progress",
      lastEdited: "1 day ago",
      students: 30,
      completion: 78,
    },
  ];

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "edit",
      course: "Introduction to Machine Learning",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "create",
      course: "Advanced Mathematics",
      time: "5 days ago",
    },
    {
      id: 3,
      type: "share",
      course: "Basic Programming Concepts",
      time: "1 week ago",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");
    router.push("/auth/login");
  };

  const handleCourseClick = (courseId) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">EduAI</span>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        JD
                      </span>
                    </div>
                    <span>John Doe</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard")}
            >
              <BarChart className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/course")}
            >
              <Book className="mr-2 h-4 w-4" /> My Courses
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/support")}
            >
              <HelpCircle className="mr-2 h-4 w-4" /> Support
            </Button>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Button
                    className="w-full space-x-2"
                    onClick={() => router.push("/course/creation")}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Course</span>
                  </Button>
                </CardContent>
              </Card>
              
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Book className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-gray-500">Total Courses</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold">256</div>
                    <div className="text-sm text-gray-500">Total Students</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BarChart className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-gray-500">Completion Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Book className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-gray-500">
                            Last edited {course.lastEdited}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/courses/${course.id}/edit`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle download
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm">
                          You {activity.type}d{" "}
                          <span className="font-medium">{activity.course}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
