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
  Book,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const CourseFinalization = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [courseData, setCourseData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!token) return;
      try {
        const response = await fetch(`https://eduai-rsjn.onrender.com/courses/${id}/contents/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
        setCourseData(data[0]);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast({ title: "Error", description: "Failed to load course data", variant: "destructive" });
      }
    };
    fetchCourseData();
  }, [id, token, toast]);

  const formatSlidesForExport = () => {
    if (!courseData?.slides) return [];
    return courseData.slides.reduce((formattedSlides, slide) => {
      let currentSlide = formattedSlides[formattedSlides.length - 1] || {};
      if (slide.title.includes("**Slide")) {
        formattedSlides.push({ title: slide.content.replace("Title: ", ""), content: "", examples: "", interactiveActivity: "" });
      } else {
        if (slide.title.startsWith("Content:")) currentSlide.content += `\n${slide.title.replace("Content: ", "")}\n${slide.content || ""}`;
        else if (slide.title === "Examples:") currentSlide.examples = slide.content;
        else if (slide.title.startsWith("Interactive activity:")) currentSlide.interactiveActivity = slide.title.replace("Interactive activity: ", "");
      }
      return formattedSlides;
    }, []);
  };

  const exportToFile = async (format) => {
    if (isExporting || !courseData) return;
    setIsExporting(true);

    try {
      const formattedSlides = formatSlidesForExport();
      let content = `${courseData.title}\n\n` + formattedSlides.map((slide, index) => (
        `Slide ${index + 1}: ${slide.title}\nContent: ${slide.content}\nExamples: ${slide.examples || ""}\nActivity: ${slide.interactiveActivity || ""}\n\n`
      )).join("-------------------\n\n");

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseData.title || "course"}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({ title: "Success", description: `Course exported as ${format} successfully` });
    } catch (error) {
      console.error("Export error:", error);
      toast({ title: "Error", description: "Failed to export course", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => router.back()} variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Course Finalization</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>Review your course details before exporting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Book className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{courseData?.title || "Loading..."}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => exportToFile("txt")} disabled={isExporting} className="w-full">Export as TXT</Button>
            <Button onClick={() => exportToFile("docx")} disabled={isExporting} className="w-full">Export as DOCX</Button>
            <Button onClick={() => exportToFile("pdf")} disabled={isExporting} className="w-full">Export as PDF</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CourseFinalization;
