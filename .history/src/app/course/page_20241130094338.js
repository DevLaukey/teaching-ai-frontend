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

const MyCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState([]);

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
              <Button className="space-x-2">
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
                <Button variant="outline" className="space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>More Filters</span>
                </Button>
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
                        <AlertDialogAction className="bg-red-600">
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
          {courses.map((course) => (
            <Card key={course.id} className="relative">
              <div className="absolute top-4 left-4">
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
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-4">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        course.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : course.status === "Draft"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {course.status}
                    </div>
                    <span className="text-gray-500">
                      Created {course.created}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{course.students}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{course.rating || "-"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{course.comments}</span>
                    </div>
                    {course.updates > 0 && (
                      <div className="flex items-center space-x-1">
                        <Bell className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">{course.updates}</span>
                      </div>
                    )}
                  </div>
                </div>
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
