"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Eye, Image as ImageIcon } from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Book, Edit, FileText, Clock, Users } from "lucide-react";

const CourseView = () => {
  const param = useParams();
  const { id } = param;
  const router = useRouter();
  const { toast } = useToast();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Error",
            description: "Please login to view course details",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }

        const data = await response.json();

        console.log("Course data:", data);
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No course data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold line-clamp-1">
                  {courseData.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Last updated{" "}
                  {new Date(courseData.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1"
                onClick={() => router.push(`/course/content-preview/${id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                <span>Preview Content</span>
              </Button>
              <Button
                className="w-full sm:w-auto order-1 sm:order-2"
                onClick={() => router.push(`/course/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit Course</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Course Content - full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Course Overview */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
                  {courseData.media ? (
                    <img
                      src={courseData.media}
                      alt={courseData.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 mb-2" />
                      <p className="text-xs sm:text-sm">No media available</p>
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  {courseData.description}
                </p>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="text-center">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-xs sm:text-sm font-medium capitalize">
                      {courseData.content_type}
                    </div>
                    <div className="text-xs text-gray-500">Content Type</div>
                  </div>
                  <div className="text-center">
                    <Book className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-xs sm:text-sm font-medium capitalize">
                      {courseData.subject}
                    </div>
                    <div className="text-xs text-gray-500">Subject</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-xs sm:text-sm font-medium">
                      {courseData.is_published ? "Published" : "Draft"}
                    </div>
                    <div className="text-xs text-gray-500">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Course Details
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Additional information about the course
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="prose max-w-none text-sm sm:text-base">
                  {courseData.details || "No detailed information available."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - full width on mobile, 1/3 on desktop */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span>Template</span>
                      <span className="capitalize">{courseData.template}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span>Author ID</span>
                      <span>{courseData.author}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium">
                      {new Date(courseData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {new Date(courseData.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Subject</span>
                    <span className="font-medium capitalize">
                      {courseData.subject}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
