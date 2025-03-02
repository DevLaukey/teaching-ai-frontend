"use client"

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Search,
  Filter,
  Calendar,
  Share2,
  Download,
  FileText,
  Pencil,
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
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
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
        subject: selectedSubject,
        template: selectedTemplate,
        sort: sortBy,
      });

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/?${queryParams}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data);
      setTotalPages(Math.ceil(data.length / 10));
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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedSubject, selectedTemplate, sortBy, currentPage]);

  const togglePublished = async (courseId) => {
    // Optimistically update local state
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, is_published: true } : course
      )
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/${courseId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_published: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
        // If the API call fails, we could revert the optimistic update here
        setCourses((prevCourses) => [...prevCourses]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Course Library</h1>
                <p className="text-gray-500">Browse and manage your courses</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Create New Course</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                  </DialogHeader>
                  {/* Add course creation form here */}
                </DialogContent>
              </Dialog>
            </div>

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
                      <label className="text-sm font-medium">Subject</label>
                      <Select
                        value={selectedSubject}
                        onValueChange={setSelectedSubject}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="AI">AI</SelectItem>
                          <SelectItem value="Math">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template</label>
                      <Select
                        value={selectedTemplate}
                        onValueChange={setSelectedTemplate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Templates</SelectItem>
                          <SelectItem value="Modern">Modern</SelectItem>
                          <SelectItem value="Classic">Classic</SelectItem>
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
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-500">
                          {course.content_type}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(course.id)}
                        className={
                          course.is_published
                            ? "text-green-600 border-green-600"
                            : "text-gray-600 border-gray-600"
                        }
                      >
                        {course.is_published ? (
                          <>
                            <Globe className="h-4 w-4 mr-1" /> Published
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-1" /> Draft
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
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(course.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Subject:</span>
                          <span>{course.subject}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Template:</span>
                          <span>{course.template}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="flex-1 space-x-2"
                          onClick={() => router.push(`/course/${course.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 space-x-2"
                          onClick={() =>
                            router.push(`/course/${course.id}/edit`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
