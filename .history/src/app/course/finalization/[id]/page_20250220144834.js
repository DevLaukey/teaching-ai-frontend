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

        console.log("Course data:", data);
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

  // First, let's improve the format slides function
  const formatSlidesForExport = () => {
    if (!courseData?.slides) return [];

    const formattedSlides = [];
    let currentSlide = null;

    courseData.slides.forEach((slide) => {
      // Start a new slide when we encounter a slide marker
      if (slide.title.includes("**Slide")) {
        if (currentSlide) {
          formattedSlides.push(currentSlide);
        }
        currentSlide = {
          slideNumber: formattedSlides.length + 1,
          title: slide.content.replace("Title: ", "").trim(),
          content: [],
          examples: [],
          interactiveActivity: "",
        };
      }
      // Handle content sections
      else if (slide.title.startsWith("Content:")) {
        const content = slide.title.replace("Content: ", "").trim();
        if (content) {
          currentSlide.content.push(content);
        }
        if (slide.content) {
          currentSlide.content.push(slide.content.trim());
        }
      }
      // Handle examples
      else if (slide.title === "Examples:") {
        currentSlide.examples = slide.content
          .split("\n")
          .map((ex) => ex.trim())
          .filter((ex) => ex.length > 0);
      }
      // Handle interactive activities
      else if (slide.title.startsWith("Interactive activity:")) {
        currentSlide.interactiveActivity = slide.title
          .replace("Interactive activity:", "")
          .trim();
      }
      // Handle additional content paragraphs
      else if (!slide.title.includes("----------------------")) {
        currentSlide.content.push(slide.title.trim());
      }
    });

    // Don't forget to add the last slide
    if (currentSlide) {
      formattedSlides.push(currentSlide);
    }

    return formattedSlides;
  };
 
  
const exportToPPTX = async () => {
  if (isExporting) return;
  setIsExporting(true);

  try {
    const formattedSlides = formatSlidesForExport();
    const pptx = new Pptxgen();

    // Set presentation properties
    pptx.author = "EduAI";
    pptx.title = courseData.title;

    // Create title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText(courseData.title, {
      x: "10%",
      y: "40%",
      w: "80%",
      fontSize: 44,
      bold: true,
      align: "center",
    });

    // Create content slides
    formattedSlides.forEach((slide) => {
      const pptSlide = pptx.addSlide();

      // Add title
      pptSlide.addText(slide.title, {
        x: "5%",
        y: "5%",
        w: "90%",
        fontSize: 32,
        bold: true,
      });

      // Add content
      if (slide.content.length > 0) {
        pptSlide.addText(
          slide.content.map((point) => `• ${point}`),
          {
            x: "5%",
            y: "25%",
            w: "90%",
            fontSize: 18,
            bullet: true,
          }
        );
      }

      // Add examples if present
      if (slide.examples.length > 0) {
        pptSlide.addText("Examples:", {
          x: "5%",
          y: "60%",
          w: "90%",
          fontSize: 18,
          bold: true,
        });
        pptSlide.addText(
          slide.examples.map((ex) => `• ${ex}`),
          {
            x: "5%",
            y: "70%",
            w: "90%",
            fontSize: 16,
            bullet: true,
          }
        );
      }
    });

    // Save the presentation
    await pptx.writeFile(`${courseData.title.replace(/\s+/g, "_")}.pptx`);

    toast({
      title: "Success",
      description: "Course exported to PowerPoint successfully",
    });
  } catch (error) {
    console.error("PPTX export error:", error);
    toast({
      title: "Error",
      description: "Failed to export to PowerPoint",
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

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: courseData.title,
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              text: `Generated on: ${new Date().toLocaleDateString()}`,
              spacing: {
                after: 500,
              },
            }),
            ...formattedSlides.flatMap((slide, index) => [
              new Paragraph({
                text: `Chapter ${index + 1}: ${slide.title}`,
                heading: HeadingLevel.HEADING_1,
                spacing: {
                  before: 400,
                  after: 200,
                },
              }),
              ...slide.content.map(
                (content) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: content,
                      }),
                    ],
                    spacing: {
                      after: 200,
                    },
                  })
              ),
              ...(slide.examples.length > 0
                ? [
                    new Paragraph({
                      text: "Examples:",
                      heading: HeadingLevel.HEADING_2,
                    }),
                    ...slide.examples.map(
                      (example, i) =>
                        new Paragraph({
                          text: `${i + 1}. ${example}`,
                          spacing: {
                            after: 200,
                          },
                        })
                    ),
                  ]
                : []),
            ]),
          ],
        },
      ],
    });

    // Generate and save the document
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${courseData.title.replace(/\s+/g, "_")}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Course exported to Word document successfully",
    });
  } catch (error) {
    console.error("DOCX export error:", error);
    toast({
      title: "Error",
      description: "Failed to export to Word document",
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
    const pdf = new jsPDF();
    let yOffset = 20;

    // Add title
    pdf.setFontSize(24);
    pdf.text(courseData.title, 20, yOffset);
    yOffset += 20;

    // Add generation date
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yOffset);
    yOffset += 20;

    formattedSlides.forEach((slide, index) => {
      // Add page break if needed
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 20;
      }

      // Add slide title
      pdf.setFontSize(18);
      pdf.text(`Chapter ${index + 1}: ${slide.title}`, 20, yOffset);
      yOffset += 15;

      // Add content
      pdf.setFontSize(12);
      slide.content.forEach((content) => {
        // Split long text into multiple lines
        const lines = pdf.splitTextToSize(content, 170);
        lines.forEach((line) => {
          if (yOffset > 280) {
            pdf.addPage();
            yOffset = 20;
          }
          pdf.text(line, 20, yOffset);
          yOffset += 10;
        });
      });

      // Add examples if present
      if (slide.examples.length > 0) {
        yOffset += 10;
        pdf.setFontSize(14);
        pdf.text("Examples:", 20, yOffset);
        yOffset += 10;
        pdf.setFontSize(12);
        slide.examples.forEach((example, i) => {
          if (yOffset > 280) {
            pdf.addPage();
            yOffset = 20;
          }
          pdf.text(`${i + 1}. ${example}`, 25, yOffset);
          yOffset += 10;
        });
      }

      yOffset += 20;
    });

    // Save the PDF
    pdf.save(`${courseData.title.replace(/\s+/g, "_")}.pdf`);

    toast({
      title: "Success",
      description: "Course exported to PDF successfully",
    });
  } catch (error) {
    console.error("PDF export error:", error);
    toast({
      title: "Error",
      description: "Failed to export to PDF",
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
