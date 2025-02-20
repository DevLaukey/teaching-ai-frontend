"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Download,
  FileDown,
  Share2,
  Check,
  ExternalLink,
  Book,
  File,
  FileText,
  Laptop,
  Settings,
  BarChart,
  Star,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const CourseFinalization = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [exportProgress] = useState(100);
  const [courseData, setCourseData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          `https://eduai-rsjn.onrender.com/courses/${id}/contents/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
        setCourseData(data[0]);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast({
          title: "Error",
          description: "Failed to load course data",
          variant: "destructive",
        });
      }
    };

    fetchCourseData();
  }, [id, token, toast]);

  // Format slides for export
  const formatSlidesForExport = () => {
    if (!courseData?.slides) return [];

    const formattedSlides = [];
    let currentSlide = {
      title: "",
      content: "",
      examples: "",
      interactiveActivity: "",
    };

    courseData.slides.forEach((slide) => {
      if (slide.title.includes("**Slide")) {
        if (currentSlide.title) formattedSlides.push({ ...currentSlide });
        currentSlide = {
          title: slide.content.replace("Title: ", ""),
          content: "",
          examples: "",
          interactiveActivity: "",
        };
      } else if (slide.title.startsWith("Content:")) {
        currentSlide.content +=
          (currentSlide.content ? "\n" : "") +
          slide.title.replace("Content: ", "") +
          (slide.content ? "\n" + slide.content : "");
      } else if (slide.title === "Examples:") {
        currentSlide.examples = slide.content;
      } else if (slide.title.startsWith("Interactive activity:")) {
        currentSlide.interactiveActivity = slide.title.replace(
          "Interactive activity: ",
          ""
        );
      }
    });

    if (currentSlide.title) formattedSlides.push(currentSlide);
    return formattedSlides;
  };

  const exportToPPTX = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const formattedSlides = formatSlidesForExport();
      const exportData = {
        title: courseData.title,
        slides: formattedSlides,
      };

      // Create text content for download
      let content = `${courseData.title}\n\n`;
      formattedSlides.forEach((slide, index) => {
        content += `Slide ${index + 1}: ${slide.title}\n`;
        content += `Content: ${slide.content}\n`;
        if (slide.examples) content += `Examples: ${slide.examples}\n`;
        if (slide.interactiveActivity)
          content += `Activity: ${slide.interactiveActivity}\n`;
        content += "\n";
      });

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseData.title || "course"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Course exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export course",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToDOCX = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const formattedSlides = formatSlidesForExport();
      const exportData = {
        title: courseData.title,
        slides: formattedSlides,
      };

      let content = `${courseData.title}\n\n`;
      formattedSlides.forEach((slide, index) => {
        content += `Slide ${index + 1}: ${slide.title}\n\n`;
        content += `${slide.content}\n\n`;
        if (slide.examples) content += `Examples:\n${slide.examples}\n\n`;
        if (slide.interactiveActivity)
          content += `Interactive Activity:\n${slide.interactiveActivity}\n\n`;
        content += "-------------------\n\n";
      });

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseData.title || "course"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Course exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export course",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const formattedSlides = formatSlidesForExport();
      const exportData = {
        title: courseData.title,
        slides: formattedSlides,
      };

      let content = `${courseData.title}\n\n`;
      formattedSlides.forEach((slide, index) => {
        content += `Slide ${index + 1}: ${slide.title}\n\n`;
        content += `Content:\n${slide.content}\n\n`;
        if (slide.examples) content += `Examples:\n${slide.examples}\n\n`;
        if (slide.interactiveActivity)
          content += `Interactive Activity:\n${slide.interactiveActivity}\n\n`;
        content += "======================================\n\n";
      });

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseData.title || "course"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Course exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export course",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFinalizeCourse = () => {
    router.push(`/community/`);
  };

  const slideCount =
    courseData?.slides?.filter((slide) => slide.title.includes("**Slide"))
      .length || 0;

  const exerciseCount =
    courseData?.slides?.filter((slide) =>
      slide.title.startsWith("Interactive activity:")
    ).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.back()} variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Course Finalization</h1>
                <p className="text-sm text-gray-500">
                  Export and share your course
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>
                Review your course details before exporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Book className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {courseData?.title || "Loading..."}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {`${slideCount} Slides • ${exerciseCount} Activities`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{slideCount}</div>
                    <div className="text-sm text-gray-500">Slides</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{exerciseCount}</div>
                    <div className="text-sm text-gray-500">Activities</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Completion</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full space-x-2" disabled={isExporting}>
                    <Download className="h-4 w-4" />
                    <span>Export Course</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Export Options</SheetTitle>
                    <SheetDescription>
                      Choose your preferred export format
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                      onClick={exportToPPTX}
                      disabled={isExporting}
                    >
                      <File className="h-4 w-4" />
                      <span>PowerPoint (PPTX)</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                      onClick={exportToDOCX}
                      disabled={isExporting}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Word Document (DOCX)</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                      onClick={exportToPDF}
                      disabled={isExporting}
                    >
                      <FileDown className="h-4 w-4" />
                      <span>PDF Document</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                onClick={() => router.push(`/course/analytics/`)}
                variant="outline"
                className="w-full space-x-2"
                disabled={isExporting}
              >
                <BarChart className="h-4 w-4" />
                <span>View Analytics</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-between items-center py-4 border-t">
          <Button variant="outline" disabled={isExporting}>
            Save as Draft
          </Button>
          <Button
            onClick={handleFinalizeCourse}
            className="space-x-2"
            disabled={isExporting}
          >
            <Check className="h-4 w-4" />
            <span>Finalize Course</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CourseFinalization;
