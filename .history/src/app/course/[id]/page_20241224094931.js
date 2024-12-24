"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart,
  Book,
  Edit,
  Download,
  Share2,
  Users,
  Star,
  MessageSquare,
  MoreVertical,
  PlayCircle,
  FileText,
  Settings,
  Clock,
} from "lucide-react";
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
          `https://eduai-rsjn.onrender.com/courses/${id}/`,
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

  const isVideo =
    courseData.media?.toLowerCase().endsWith(".mp4") ||
    courseData.media?.toLowerCase().endsWith(".mov") ||
    courseData.media?.toLowerCase().endsWith(".webm");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{courseData.title}</h1>
                <p className="text-sm text-gray-500">
                  Last updated{" "}
                  {new Date(courseData.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                className="space-x-2"
                onClick={() => router.push(`/course/${id}/edit`)}
              >
                <Edit className="h-4 w-4" />
                <span>Edit Course</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Course Content - 2/3 width */}
          <div className="col-span-2 space-y-6">
            {/* Course Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-gray-600">{course.description}</p>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {course.stats.totalHours} Hours
                    </div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {course.stats.totalLessons} Lessons
                    </div>
                    <div className="text-xs text-gray-500">Content</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {course.students} Students
                    </div>
                    <div className="text-xs text-gray-500">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <Star className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {course.rating}/5.0
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.stats.totalLessons} lessons •{" "}
                  {course.stats.totalHours} hours total length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.completed ? "bg-green-100" : "bg-gray-200"
                          }`}
                        >
                          {lesson.completed ? (
                            <PlayCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-sm text-gray-500">
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {lesson.completed ? "Review" : "Start"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion</span>
                      <span>{course.stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.stats.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full">Continue Learning</Button>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Materials
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Students</span>
                    <span className="font-medium">{course.students}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Course Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">{course.lastUpdated}</span>
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
