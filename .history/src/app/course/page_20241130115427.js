"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Share2,
  Users,
  Star,
  Filter,
  Bell,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MyCourses = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  // Mock course data
  const courses = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      status: "Published",
      created: "Mar 15, 2024",
      progress: 100,
      students: 45,
      rating: 4.8,
      updates: 3,
      comments: 2,
      thumbnail: "ML",
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      status: "Draft",
      created: "Mar 20, 2024",
      progress: 30,
      students: 0,
      rating: 0,
      updates: 0,
      comments: 0,
      thumbnail: "AM",
    },
    {
      id: 3,
      title: "Basic Programming Concepts",
      status: "In Progress",
      created: "Mar 25, 2024",
      progress: 75,
      students: 30,
      rating: 4.5,
      updates: 1,
      comments: 5,
      thumbnail: "BP",
    },
  ];

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" ||
        course.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return b.rating - a.rating;
        case "students":
          return b.students - a.students;
        case "newest":
          return new Date(b.created) - new Date(a.created);
        default:
          return 0;
      }
    });

  const handleSelectCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCourses(
      selectedCourses.length === courses.length
        ? []
        : courses.map((course) => course.id)
    );
  };

  const handleCourseClick = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  const handleCreateCourse = () => {
    router.push("/course/creation");
  };

  const handleDeleteCourses = () => {
    // In a real app, you'd make an API call here
    const remainingCourses = courses.filter(
      (course) => !selectedCourses.includes(course.id)
    );
    setSelectedCourses([]);
    // Update courses state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">My Courses</h1>
              <p className="text-sm text-gray-500">
                Manage and track your courses
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button className="space-x-2" onClick={handleCreateCourse}>
                <Plus className="h-4 w-4" />
                <span>Create New Course</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex space-x-4">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedCourses.length > 0 && (
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedCourses.length === courses.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600">
                    {selectedCourses.length} selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Selected Courses
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the selected courses?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600"
                          onClick={handleDeleteCourses}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="relative cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCourseClick(course.id)}
            >
              <div
                className="absolute top-4 left-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedCourses.includes(course.id)}
                  onCheckedChange={() => handleSelectCourse(course.id)}
                />
              </div>

              <CardHeader className="pt-12">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {course.thumbnail}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/courses/${course.id}/edit`);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-4">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... Rest of the card content remains the same ... */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="mx-2">
            Previous
          </Button>
          <Button variant="outline" className="mx-2">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
