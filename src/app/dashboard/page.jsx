"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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
import Navigation from "../../components/Navbar";
import { useAuth } from "../../lib/AuthContext";
import Cookies from "js-cookie"; // Import js-cookie

const Dashboard = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Check if user is authenticated before loading data
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  // Function to get recent courses
  const getRecentCourses = (allCourses) => {
    // Sort courses by created_at date in descending order
    const sorted = [...allCourses].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Get the 3 most recent courses and format them
    return sorted.slice(0, 3).map((course) => ({
      ...course,
      lastEdited: formatTimeAgo(new Date(course.updated_at)),
    }));
  };

  // Function to get recent activity
  const getRecentActivity = (allCourses) => {
    // Sort courses by created_at date in descending order
    const sorted = [...allCourses].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Get the 2 most recent courses and format them as activities
    return sorted.slice(0, 2).map((course) => {
      const timeAgo = formatTimeAgo(new Date(course.created_at));
      let type = "create";

      // If the updated_at is different from created_at, it's an edit
      if (course.updated_at !== course.created_at) {
        type = "edit";
      }

      return {
        id: course.id,
        type,
        course: course.title,
        time: timeAgo,
        subject: course.subject,
        is_published: course.is_published,
      };
    });
  };

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return "1 day ago";
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else {
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
      }
    }
  };

  useEffect(() => {
    // Only fetch courses if the user is authenticated
    if (!loading && isAuthenticated) {
      fetchCourses();
    }
  }, [isAuthenticated, loading]);

  const fetchCourses = async () => {
    try {
      // Get token from cookies instead of localStorage
      const token = Cookies.get("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
      setRecentCourses(getRecentCourses(data));
      setRecentActivity(getRecentActivity(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    router.push(`/course/${courseId}`);
  };

  // Show loading state while checking authentication or fetching data
  if (loading || (isAuthenticated && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Redirect handled by the useEffect, so nothing to render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const publishedCourses = courses.filter((course) => course.is_published);
  const completionRate =
    publishedCourses.length > 0
      ? Math.round((publishedCourses.length / courses.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation />

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
              <Card>
                <CardContent className="pt-6">
                  <Button
                    className="w-full space-x-2"
                    onClick={() => router.push("/course/analytics")}
                  >
                    <BarChart className="h-4 w-4" />
                    <span>View Analytics</span>
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
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold">
                      {publishedCourses.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Published Courses
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BarChart className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">{completionRate}%</div>
                    <div className="text-sm text-gray-500">
                      Publication Rate
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                    <div className="text-2xl font-bold">
                      {courses.length > 0 ? courses.length : 0}
                    </div>
                    <div className="text-sm text-gray-500">Total Contents</div>
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
                  {recentCourses.length == 0 ? (
                    <p>No recent activity yet</p>
                  ) : (
                    recentCourses.map((course) => (
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
                              router.push(`/course/${course.id}/edit`);
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
                    ))
                  )}
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
                  {recentActivity.length == 0 ? (
                    <p>No recent activity yet</p>
                  ) : (
                    recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {activity.type === "edit" ? (
                            <Edit className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm">
                            You {activity.type}ed{" "}
                            <span className="font-medium">
                              {activity.course}
                            </span>
                            {activity.is_published ? (
                              <span className="ml-2 text-xs text-green-600">
                                (Published)
                              </span>
                            ) : (
                              <span className="ml-2 text-xs text-gray-500">
                                (Draft)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.time} • {activity.subject.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
