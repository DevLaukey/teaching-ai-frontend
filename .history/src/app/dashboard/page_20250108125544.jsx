"use client";
import React, { useState, useEffect } from "react";
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
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);

  // Function to get recent courses
  const getRecentCourses = (allCourses) => {
    // Sort courses by createdAt date in descending order
    const sorted = [...allCourses].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    // Get the 3 most recent courses
    return sorted.slice(0, 3);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("https://eduai-rsjn.onrender.com/courses/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
      setRecentCourses(getRecentCourses(data));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("https://eduai-rsjn.onrender.com/courses/", {
        method: "POST",
        headers: {
          Authorization: `Tpken ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      // Refresh courses list after creation
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    router.push("/auth/login");
  };

  const handleCourseClick = (courseId) => {
    router.push(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        {/* ... Header content remains the same ... */}
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar remains the same */}
          <aside className="w-full md:w-64 space-y-2">
            {/* ... Sidebar content remains the same ... */}
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-1 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Button
                    className="w-full space-x-2"
                    onClick={() =>
                      handleCreateCourse({
                        title: "New Course",
                        description: "Course description",
                        status: "draft",
                      })
                    }
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
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <div className="text-sm text-gray-500">Total Courses</div>
                  </div>
                </CardContent>
              </Card>
              {/* ... Other statistics cards remain the same ... */}
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
                            {course.description}
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
