"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Star,
  Share2,
  Download,
  Clock,
  Users,
  Eye,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CommunitySharing = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch courses with filters
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to view courses",
          variant: "destructive",
        });
        return;
      }

      const queryParams = new URLSearchParams({
        page: currentPage,
        search: searchQuery,
        category: selectedCategory,
        rating: selectedRating,
        sort: sortBy,
      });

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data.results);
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, selectedRating, sortBy, currentPage]);

  // Toggle course visibility
  const toggleVisibility = async (courseId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/${courseId}/visibility/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_public: !currentStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update visibility");

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, isPublic: !course.isPublic }
            : course
        )
      );

      toast({
        title: "Success",
        description: `Course is now ${!currentStatus ? "public" : "private"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course visibility",
        variant: "destructive",
      });
    }
  };

  // Download course
  const downloadCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/${courseId}/download/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download course");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `course-${courseId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Course downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download course",
        variant: "destructive",
      });
    }
  };

  // Preview course
  const previewCourse = (courseId) => {
    router.push(`/course/${courseId}/preview`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">
                  Community & Course Sharing
                </h1>
                <p className="text-gray-500">
                  Discover and share educational content
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Share Your Course</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Course</DialogTitle>
                  </DialogHeader>
                  {/* Add your course sharing form here */}
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Courses</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="math">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="language">Languages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <Select
                        value={selectedRating}
                        onValueChange={setSelectedRating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="4plus">4+ Stars</SelectItem>
                          <SelectItem value="3plus">3+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {course.thumbnail}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleVisibility(course.id, course.isPublic)
                        }
                        className={
                          course.isPublic
                            ? "text-green-600 border-green-600"
                            : "text-gray-600 border-gray-600"
                        }
                      >
                        {course.isPublic ? (
                          <>
                            <Globe className="h-4 w-4 mr-1" /> Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-1" /> Private
                          </>
                        )}
                      </Button>
                    </div>
                    <CardTitle className="mt-4">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{course.rating}</span>
                          <span>({course.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>Created by {course.author}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-sm border-t pt-4">
                        <div>
                          <div className="font-medium">{course.downloads}</div>
                          <div className="text-gray-500">Downloads</div>
                        </div>
                        <div>
                          <div className="font-medium">{course.shares}</div>
                          <div className="text-gray-500">Shares</div>
                        </div>
                        <div>
                          <div className="font-medium">{course.reviews}</div>
                          <div className="text-gray-500">Reviews</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="flex-1 space-x-2"
                          onClick={() => previewCourse(course.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span>Preview</span>
                        </Button>
                        <Button
                          className="flex-1 space-x-2"
                          onClick={() => downloadCourse(course.id)}
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunitySharing;
