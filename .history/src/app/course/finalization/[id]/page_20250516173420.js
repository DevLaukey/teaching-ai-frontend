"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { useToast } from "../../../../hooks/use-toast";
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
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Pptxgen from "pptxgenjs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { jsPDF } from "jspdf";
import Cookies from "js-cookie";

const CourseFinalization = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [exportProgress, setExportProgress] = useState(100);
  const [exportingFormat, setExportingFormat] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const token = Cookies.get("authToken");

  // Redirect if no auth token
  useEffect(() => {
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please login to view course content",
        variant: "destructive",
      });
      router.push(
        "/auth/login?redirect=" +
          encodeURIComponent(`/course/content-preview/${id}`)
      );
    }
  }, [token, toast, router, id]);

  // In useEffect - add a button to parse document on component mount
  useEffect(() => {
    // Create a parse document button for testing
    const addParseButton = () => {
      // Check if button already exists
      if (document.getElementById('parse-document-button')) {
        return;
      }
      
      const button = document.createElement('button');
      button.id = 'parse-document-button';
      button.textContent = 'Parse Document Data';
      button.style.position = 'fixed';
      button.style.bottom = '20px';
      button.style.right = '20px';
      button.style.zIndex = '9999';
      button.style.padding = '10px';
      button.style.backgroundColor = '#4F46E5';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '5px';
      button.style.cursor = 'pointer';
      
      button.addEventListener('click', () => {
        handleManualDataParsing();
      });
      
      document.body.appendChild(button);
    };
    
    // Add the button after a short delay
    setTimeout(addParseButton, 1000);
    
    return () => {
      // Remove button on component unmount
      const button = document.getElementById('parse-document-button');
      if (button) {
        button.remove();
      }
    };
  }, []);

  const handleManualDataParsing = () => {
    try {
      const manualSlides = parseDocumentSlides();
      if (manualSlides && manualSlides.length > 0) {
        // Store the manually parsed slides for use in exports
        window.manualFormattedSlides = manualSlides;
        
        toast({
          title: "Success",
          description: `Found ${manualSlides.length} slides in the document`,
        });
        
        // Update course data with our slides
        setCourseData(prevData => ({
          ...prevData,
          parsedSlides: manualSlides
        }));
        
        return true;
      } else {
        toast({
          title: "Warning",
          description: "Could not parse slide data from document",
          variant: "warning",
        });
        return false;
      }
    } catch (error) {
      console.error("Error in manual data parsing:", error);
      toast({
        title: "Error",
        description: "Failed to parse document data",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Helper function to get the slides data from either course data or document
  const getSlideData = () => {
    // First check if we have manually parsed slides in the course data
    if (courseData?.parsedSlides && Array.isArray(courseData.parsedSlides) && courseData.parsedSlides.length > 0) {
      console.log("Using manually parsed slides:", courseData.parsedSlides.length);
      return courseData.parsedSlides;
    }
    
    // Check if we have manually parsed slides in the window object
    if (window.manualFormattedSlides && Array.isArray(window.manualFormattedSlides) && window.manualFormattedSlides.length > 0) {
      console.log("Using window.manualFormattedSlides:", window.manualFormattedSlides.length);
      return window.manualFormattedSlides;
    }
    
    // Next, check if courseData has valid slides
    if (courseData?.slides && Array.isArray(courseData.slides) && courseData.slides.length > 0) {
      console.log("Using course data slides:", courseData.slides.length);
      return courseData.slides;
    }
    
    // If we're here, courseData doesn't have valid slides
    console.log("Checking for raw slide data directly in document...");
    
    // If slides are stored directly in the window object
    if (window.courseSlideData && Array.isArray(window.courseSlideData)) {
      console.log("Found slide data in window.courseSlideData:", window.courseSlideData.length);
      return window.courseSlideData;
    }
    
    // Try to find the JSON data in pre tags (often where pasted data appears)
    try {
      const preElements = document.querySelectorAll('pre');
      
      for (const pre of preElements) {
        try {
          const content = pre.textContent;
          const parsed = JSON.parse(content);
          
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
            console.log("Found valid slide data in pre element:", parsed.length, "slides");
            // Save for future reference
            window.courseSlideData = parsed;
            return parsed;
          }
        } catch (e) {
          // Not valid JSON, continue to next element
        }
      }
    } catch (e) {
      console.log("Error parsing pre elements:", e);
    }
    
    console.log("No slide data found in any source");
    
    // Return the manually hardcoded sample data as a last resort
    const hardcodedSlideData = [
      {
        "id": 254,
        "order": 1,
        "title": "### Slide 1: Introduction to Flower Anatomy",
        "content": "**Educational Content:**  \nWelcome to the fascinating world of botany! Today, we are delving into the intricate anatomy of a flower.",
      },
      {
        "id": 255,
        "order": 2,
        "title": "**Practical Examples:**",
        "content": "1) The beautiful roses you enjoy in a garden are decorative, but their colorful petals also attract pollinators.",
      }
    ];
    
    console.log("Using hardcoded slide data as fallback");
    return hardcodedSlideData;
  }; or direct document
  const getSlideData = () => {
    // First, check if courseData has valid slides
    if (courseData?.slides && Array.isArray(courseData.slides) && courseData.slides.length > 0) {
      console.log("Using course data slides:", courseData.slides.length);
      return courseData.slides;
    }
    
    // If we're here, courseData doesn't have valid slides
    // Check if we have direct access to document data
    console.log("Checking for slide data directly in document...");
    
    // If slides are stored directly in the first document object
    if (window.document && window.document.slideData && Array.isArray(window.document.slideData)) {
      console.log("Found slide data in window.document.slideData:", window.document.slideData.length);
      return window.document.slideData;
    }
    
    // Check if slides might be in the document's text content (as a JSON array)
    try {
      // Try to parse the JSON from the last document upload
      const documentData = JSON.parse(window.localStorage.getItem('lastDocumentData'));
      if (Array.isArray(documentData) && documentData.length > 0 && documentData[0].title) {
        console.log("Found slide data in localStorage:", documentData.length);
        return documentData;
      }
    } catch (e) {
      console.log("No valid JSON found in localStorage");
    }
    
    // If we received the data directly in this component, use it
    if (window.courseSlideData && Array.isArray(window.courseSlideData)) {
      console.log("Found slide data in window.courseSlideData");
      return window.courseSlideData;
    }
    
    // As a last resort, use a hardcoded slide data array from the flower anatomy example
    // This is for testing purposes only and should be removed in production
    const hardcodedSlideData = [
      {
        "id": 254,
        "order": 1,
        "title": "### Slide 1: Introduction to Flower Anatomy",
        "content": "**Educational Content:**  \nWelcome to the fascinating world of botany! Today, we are delving into the intricate anatomy of a flower. Flowers are well-known for their beauty and fragrance, but they're also scientifically intriguing. They function as the reproductive structures of angiosperms or flowering plants, playing a crucial role in the process of pollination. Each part of the flower serves a specific function in plant reproduction.",
      },
      {
        "id": 255,
        "order": 2,
        "title": "**Practical Examples:**",
        "content": "1) The beautiful roses you enjoy in a garden are decorative, but their colorful petals also attract pollinators.  \n2) The sunflower is known for its large, yellow-petaled bloom, but its center (or disk) is actually full of tiny individual flowers that can reproduce.",
      },
      {
        "id": 256,
        "order": 3,
        "title": "**Interactive Activity:** Consider two of your favorite flowering plants. What parts of the flower are most visible, and what purpose might they serve?",
        "content": "",
      },
      {
        "id": 257,
        "order": 4,
        "title": "### Slide 2: The Petals",
        "content": "**Educational Content:**  \nPetals, collectively known as the corolla, are often the most spectacular part of the flower. Their bright colors and attractive patterns serve to draw insects and other pollinators. Petals also protect the delicate reproductive parts within.",
      }
    ];
    
    console.log("Using hardcoded slide data as fallback:", hardcodedSlideData.length);
    return hardcodedSlideData;
  };

  // Improved slides format function with better error handling
  const formatSlidesForExport = () => {
    if (!courseData?.slides || !Array.isArray(courseData.slides) || courseData.slides.length === 0) {
      toast({
        title: "Format Error",
        description: "Course data is missing or in an unexpected format",
        variant: "destructive",
      });
      return [];
    }

    const formattedSlides = [];
    let currentSlide = null;

    try {
      courseData.slides.forEach((slide) => {
        // Start a new slide when we encounter a slide marker
        if (slide.title && slide.title.includes("**Slide")) {
          if (currentSlide) {
            formattedSlides.push(currentSlide);
          }
          currentSlide = {
            slideNumber: formattedSlides.length + 1,
            title: slide.content ? slide.content.replace("Title: ", "").trim() : `Slide ${formattedSlides.length + 1}`,
            content: [],
            examples: [],
            interactiveActivity: "",
          };
        }
        // Handle content sections
        else if (slide.title && slide.title.startsWith("Content:")) {
          const content = slide.title.replace("Content: ", "").trim();
          if (content && currentSlide) {
            currentSlide.content.push(content);
          }
          if (slide.content && currentSlide) {
            currentSlide.content.push(slide.content.trim());
          }
        }
        // Handle examples
        else if (slide.title === "Examples:" && currentSlide) {
          if (slide.content) {
            currentSlide.examples = slide.content
              .split("\n")
              .map((ex) => ex.trim())
              .filter((ex) => ex.length > 0);
          }
        }
        // Handle interactive activities
        else if (slide.title && slide.title.startsWith("Interactive activity:") && currentSlide) {
          currentSlide.interactiveActivity = slide.title
            .replace("Interactive activity:", "")
            .trim();
        }
        // Handle additional content paragraphs
        else if (slide.title && !slide.title.includes("----------------------") && currentSlide) {
          currentSlide.content.push(slide.title.trim());
        }
      });

      // Don't forget to add the last slide
      if (currentSlide) {
        formattedSlides.push(currentSlide);
      }

      return formattedSlides;
    } catch (error) {
      console.error("Error formatting slides:", error);
      toast({
        title: "Format Error",
        description: "Error processing slide content",
        variant: "destructive",
      });
      return [];
    }
  };

  // Improved PPTX export with error handling, progress tracking, and safe file names
  const exportToPPTX = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportingFormat("PPTX");
    setExportProgress(0);
    
    try {
      // Format slides
      setExportProgress(10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI to update
      
      const formattedSlides = formatSlidesForExport();
      if (formattedSlides.length === 0) {
        throw new Error("No slide content to export");
      }
      
      setExportProgress(30);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const pptx = new Pptxgen();

      // Set presentation properties
      pptx.author = "EduAI";
      pptx.title = courseData.title || "Course";
      
      // Create title slide
      let titleSlide = pptx.addSlide();
      titleSlide.addText(courseData.title || "Course", {
        x: "10%",
        y: "40%",
        w: "80%",
        fontSize: 44,
        bold: true,
        align: "center",
      });

      setExportProgress(50);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create content slides
      formattedSlides.forEach((slide, idx) => {
        if (!slide.title) return; // Skip slides without titles
        
        let currentSlide = pptx.addSlide();

        // Add title
        currentSlide.addText(slide.title, {
          x: "5%",
          y: "5%",
          w: "90%",
          fontSize: 32,
          bold: true,
        });

        // Add content
        if (slide.content && slide.content.length > 0) {
          const baseY = 25; // Starting Y position
          let currentY = baseY;

          // Add each content point separately
          slide.content.forEach((point, index) => {
            if (!point) return; // Skip empty points
            
            const estimatedLines = Math.ceil((point.length * 18) / 800);
            const heightNeeded = estimatedLines * 1.2;

            currentSlide.addText(point, {
              x: "5%",
              y: `${currentY}%`,
              w: "90%",
              h: `${heightNeeded}%`,
              fontSize: 18,
              bullet: point.length > 10, // Only use bullets for longer content
              breakLine: true,
              autoFit: true,
              align: "left",
              valign: "top",
            });

            currentY += Math.max(heightNeeded + 2, 8);
          });
        }

        // Add examples if present
        if (slide.examples && slide.examples.length > 0) {
          const lastContentY =
            slide.content && slide.content.length > 0
              ? Math.min(25 + slide.content.length * 15, 60)
              : 60;

          currentSlide.addText("Examples:", {
            x: "5%",
            y: `${lastContentY}%`,
            w: "90%",
            fontSize: 18,
            bold: true,
            margin: 5,
          });

          let currentY = lastContentY + 10;

          slide.examples.forEach((example, index) => {
            if (!example) return; // Skip empty examples
            
            // Add a new slide if we're running out of space
            if (currentY > 90 && index < slide.examples.length - 1) {
              currentSlide = pptx.addSlide();
              currentSlide.addText(`${slide.title} (continued)`, {
                x: "5%",
                y: "5%",
                w: "90%",
                fontSize: 32,
                bold: true,
              });
              currentY = 25;
            }

            const estimatedLines = Math.ceil((example.length * 16) / 800);
            const heightNeeded = estimatedLines * 1.2;

            currentSlide.addText(example, {
              x: "5%",
              y: `${currentY}%`,
              w: "90%",
              h: `${heightNeeded}%`,
              fontSize: 16,
              bullet: true,
              breakLine: true,
              autoFit: true,
              align: "left",
              valign: "top",
            });

            currentY += Math.max(heightNeeded + 2, 6);
          });
        }
      });

      setExportProgress(80);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a safe filename
      const safeFileName = createSafeFilename(courseData.title);
      
      // Use blob approach for consistent download experience across browsers
      const blob = await pptx.write("blob");
      downloadFile(blob, `${safeFileName}.pptx`);

      setExportProgress(100);

      toast({
        title: "Success",
        description: "Course exported to PowerPoint successfully",
      });
    } catch (error) {
      console.error("PPTX export error:", error);
      toast({
        title: "Export Error",
        description: `Failed to export to PowerPoint: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  // Improved DOCX export with error handling, progress tracking, and safe file names
  const exportToDOCX = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportingFormat("DOCX");
    setExportProgress(0);

    try {
      setExportProgress(10);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Format slides
      let formattedSlides = formatSlidesForExport();
      
      // If no slides, create a default slide with the course title
      if (formattedSlides.length === 0) {
        if (!courseData?.title) {
          throw new Error("No course title or slide content to export");
        }
        
        formattedSlides.push({
          slideNumber: 1,
          title: courseData.title,
          content: ["This course doesn't contain any specific slide content."],
          examples: [],
          interactiveActivity: ""
        });
      }

      setExportProgress(30);
      await new Promise(resolve => setTimeout(resolve, 100));

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: courseData.title || "Course",
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: `Generated on: ${new Date().toLocaleDateString()}`,
                spacing: {
                  after: 500,
                },
              }),
              ...formattedSlides.flatMap((slide, index) => {
                if (!slide.title) return []; // Skip slides without titles
                
                const elements = [
                  new Paragraph({
                    text: `Chapter ${index + 1}: ${slide.title}`,
                    heading: HeadingLevel.HEADING_1,
                    spacing: {
                      before: 400,
                      after: 200,
                    },
                  }),
                ];
                
                // Add content paragraphs
                if (slide.content && slide.content.length > 0) {
                  elements.push(
                    ...slide.content
                      .filter(content => content) // Filter out empty content
                      .map(
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
                      )
                  );
                }
                
                // Add examples if present
                if (slide.examples && slide.examples.length > 0) {
                  elements.push(
                    new Paragraph({
                      text: "Examples:",
                      heading: HeadingLevel.HEADING_2,
                    }),
                    ...slide.examples
                      .filter(example => example) // Filter out empty examples
                      .map(
                        (example, i) =>
                          new Paragraph({
                            text: `${i + 1}. ${example}`,
                            spacing: {
                              after: 200,
                            },
                          })
                      )
                  );
                }
                
                return elements;
              }),
            ],
          },
        ],
      });

      setExportProgress(70);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a safe filename
      const safeFileName = createSafeFilename(courseData.title);

      // Generate and save the document
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      downloadFile(blob, `${safeFileName}.docx`);

      setExportProgress(100);

      toast({
        title: "Success",
        description: "Course exported to Word document successfully",
      });
    } catch (error) {
      console.error("DOCX export error:", error);
      toast({
        title: "Export Error",
        description: `Failed to export to Word: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  // Improved PDF export with error handling, progress tracking, and safe file names
  const exportToPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportingFormat("PDF");
    setExportProgress(0);

    try {
      setExportProgress(10);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Format slides
      let formattedSlides = formatSlidesForExport();
      
      // If no slides, create a default slide with the course title
      if (formattedSlides.length === 0) {
        if (!courseData?.title) {
          throw new Error("No course title or slide content to export");
        }
        
        formattedSlides.push({
          slideNumber: 1,
          title: courseData.title,
          content: ["This course doesn't contain any specific slide content."],
          examples: [],
          interactiveActivity: ""
        });
      }
      
      setExportProgress(30);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const pdf = new jsPDF();
      let yOffset = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const maxWidth = pageWidth - 40; // Margins on both sides

      // Add title
      pdf.setFontSize(24);
      pdf.text(courseData.title || "Course", 20, yOffset);
      yOffset += 20;

      // Add generation date
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yOffset);
      yOffset += 20;

      setExportProgress(50);
      await new Promise(resolve => setTimeout(resolve, 100));

      formattedSlides.forEach((slide, index) => {
        if (!slide.title) return; // Skip slides without titles
        
        // Add page break if needed
        if (yOffset > 250) {
          pdf.addPage();
          yOffset = 20;
        }

        // Add slide title
        pdf.setFontSize(18);
        const slideTitle = `Chapter ${index + 1}: ${slide.title}`;
        pdf.text(slideTitle, 20, yOffset);
        yOffset += 15;

        // Add content
        pdf.setFontSize(12);
        if (slide.content && slide.content.length > 0) {
          slide.content.forEach((content) => {
            if (!content) return; // Skip empty content
            
            // Split long text into multiple lines
            const lines = pdf.splitTextToSize(content, maxWidth);
            lines.forEach((line) => {
              if (yOffset > 280) {
                pdf.addPage();
                yOffset = 20;
              }
              pdf.text(line, 20, yOffset);
              yOffset += 10;
            });
            yOffset += 5; // Add space between content blocks
          });
        }

        // Add examples if present
        if (slide.examples && slide.examples.length > 0) {
          yOffset += 10;
          pdf.setFontSize(14);
          pdf.text("Examples:", 20, yOffset);
          yOffset += 10;
          pdf.setFontSize(12);
          slide.examples.forEach((example, i) => {
            if (!example) return; // Skip empty examples
            
            if (yOffset > 280) {
              pdf.addPage();
              yOffset = 20;
            }
            
            const exampleText = `${i + 1}. ${example}`;
            const exampleLines = pdf.splitTextToSize(exampleText, maxWidth);
            exampleLines.forEach((line) => {
              pdf.text(line, 25, yOffset);
              yOffset += 10;
            });
            yOffset += 5; // Add space between examples
          });
        }

        yOffset += 20;
      });

      setExportProgress(80);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a safe filename
      const safeFileName = createSafeFilename(courseData.title);

      // Create a blob from the PDF and trigger download
      const pdfBlob = pdf.output('blob');
      downloadFile(pdfBlob, `${safeFileName}.pdf`);

      setExportProgress(100);

      toast({
        title: "Success",
        description: "Course exported to PDF successfully",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Error",
        description: `Failed to export to PDF: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handleFinalizeCourse = () => {
    router.push(`/community/`);
  };

  const slideCount =
    courseData?.slides?.filter((slide) => slide.title && slide.title.includes("**Slide"))
      .length || 0;

  const exerciseCount =
    courseData?.slides?.filter((slide) =>
      slide.title && slide.title.startsWith("Interactive activity:")
    ).length || 0;

  // Return null if not authenticated
  if (!token) {
    return null;
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
                    <span>
                      {isExporting 
                        ? `Exporting ${exportingFormat || "Content"}`
                        : "Course Completion"}
                    </span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${isExporting ? "bg-blue-500" : "bg-green-500"}`}
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
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Export Course</span>
                      </>
                    )}
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
                      {isExporting && exportingFormat === "PPTX" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                      <span>
                        {isExporting && exportingFormat === "PPTX"
                          ? `Exporting (${exportProgress}%)`
                          : "PowerPoint (PPTX)"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                      onClick={exportToDOCX}
                      disabled={isExporting}
                    >
                      {isExporting && exportingFormat === "DOCX" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span>
                        {isExporting && exportingFormat === "DOCX"
                          ? `Exporting (${exportProgress}%)`
                          : "Word Document (DOCX)"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                      onClick={exportToPDF}
                      disabled={isExporting}
                    >
                      {isExporting && exportingFormat === "PDF" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4" />
                      )}
                      <span>
                        {isExporting && exportingFormat === "PDF"
                          ? `Exporting (${exportProgress}%)`
                          : "PDF Document"}
                      </span>
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