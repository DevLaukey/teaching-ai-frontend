"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  ArrowLeft,
  Save,
  Type,
  Layout,
  PlusCircle,
  Undo,
  Redo,
  Stars,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "../../../../hooks/use-toast";
import { useAuth } from "../../../../lib/AuthContext";
import Cookies from "js-cookie";

const ContentPreview = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(true);



  // This function processes the raw slides from the API into a more usable format
// Add this function to your ContentPreview component
const processSlides = (rawSlides) => {
  console.log("Processing raw slides:", rawSlides);

  if (!Array.isArray(rawSlides) || rawSlides.length === 0) {
    console.error("Invalid slides data:", rawSlides);
    return [];
  }

  const processedSlides = [];
  let currentMainSlide = null;

  // Sort slides by order
  const sortedSlides = [...rawSlides].sort((a, b) => a.order - b.order);

  for (const slide of sortedSlides) {
    if (!slide || !slide.title) {
      console.warn("Skipping invalid slide:", slide);
      continue;
    }

    // Check if this is a main slide with a title like "Slide X: Title" or "### Slide X: Title"
    if (slide.title.includes("Slide") || slide.title.startsWith("###")) {
      // Save previous slide if exists
      if (currentMainSlide) {
        processedSlides.push(currentMainSlide);
      }
      
      // Extract title - handle different formats
      let slideTitle = "";
      if (slide.title.includes("Slide")) {
        const titleMatch = slide.title.match(/Slide \d+:\s*(.+)/) || 
                          slide.title.match(/### Slide \d+:\s*(.+)/) ||
                          slide.title.match(/\*\*Slide \d+:\s*(.+)\*\*/);
        
        if (titleMatch) {
          slideTitle = titleMatch[1].trim();
        } else {
          // Just remove formatting if we can't match the pattern
          slideTitle = slide.title
            .replace(/^### /, '')
            .replace(/^\*\*/, '')
            .replace(/\*\*$/, '')
            .trim();
        }
      } else {
        slideTitle = slide.title.replace(/^### /, '').trim();
      }
      
      // Parse main content
      let mainContent = slide.content || "";
      if (mainContent.includes("Educational Content")) {
        mainContent = mainContent.replace(/\*\*Educational Content:\*\*/i, "").trim();
      }
      
      // Create new slide object
      currentMainSlide = {
        id: slide.id,
        title: slideTitle,
        mainContent: mainContent,
        examples: "",
        interactiveActivity: "",
        fontFamily: slide.font_family || "arial",
        fontSize: slide.font_size || "16",
        layout: slide.layout || "default",
        presentation: slide.presentation
      };
    } else if (slide.title.includes("Practical Examples")) {
      // Add examples to current slide
      if (currentMainSlide) {
        currentMainSlide.examples = slide.content.trim();
      }
    } else if (slide.title.includes("Interactive Activity")) {
      // Add interactive activity to current slide
      if (currentMainSlide) {
        // Extract activity content from title if present (after colon)
        let activityPrompt = "";
        if (slide.title.includes(":")) {
          activityPrompt = slide.title.split(":")[1].trim();
        }
        
        currentMainSlide.interactiveActivity = activityPrompt + 
          (slide.content && slide.content.trim() ? 
            (activityPrompt ? "\n" : "") + slide.content.trim() : "");
      }
    } else {
      // Other content - could be a conclusion or miscellaneous
      if (currentMainSlide) {
        // Append to main content
        const additionalContent = slide.title + 
          (slide.content ? "\n" + slide.content : "");
        
        if (currentMainSlide.mainContent) {
          currentMainSlide.mainContent += "\n\n" + additionalContent;
        } else {
          currentMainSlide.mainContent = additionalContent;
        }
      }
    }
  }
  
  // Add the last slide if exists
  if (currentMainSlide) {
    processedSlides.push(currentMainSlide);
  }
  
  console.log("Processed slides result:", processedSlides);
  return processedSlides;
};

// Function to convert processed slides back to API format
// This is important for saving the edits back to the server
const convertToApiFormat = (processedSlides) => {
  const apiSlides = [];

  for (let i = 0; i < processedSlides.length; i++) {
    const slide = processedSlides[i];
    const slideNumber = i + 1;

    // Format the title with "**Slide X: Title**" to match original format
    const formattedTitle = `**Slide ${slideNumber}: ${slide.title}**`;

    // Build the content with the educational content format
    let mainContent = "";
    if (slide.mainContent) {
      mainContent = `**Educational Content:**  \n${slide.mainContent}`;
    }

    // Add the main slide
    apiSlides.push({
      id: slide.id || Date.now() + Math.random(),
      order: slideNumber * 3 - 2, // Main content gets first position in order
      title: formattedTitle,
      content: mainContent,
      font_family: slide.fontFamily,
      font_size: slide.fontSize,
      layout: slide.layout,
      presentation: slide.presentation,
    });

    // Add examples if present
    if (slide.examples) {
      apiSlides.push({
        id: slide.id ? slide.id + 0.1 : Date.now() + Math.random(),
        order: slideNumber * 3 - 1, // Examples get second position in order
        title: "**Practical Examples:**",
        content: slide.examples,
        font_family: slide.fontFamily,
        font_size: slide.fontSize,
        layout: slide.layout,
        presentation: slide.presentation,
      });
    }

    // Add interactive activity if present
    if (slide.interactiveActivity) {
      apiSlides.push({
        id: slide.id ? slide.id + 0.2 : Date.now() + Math.random(),
        order: slideNumber * 3, // Activity gets third position in order
        title: `**Interactive Activity:** ${slide.interactiveActivity.split('\n')[0] || ""}`,
        content: slide.interactiveActivity.includes('\n') 
          ? slide.interactiveActivity.substring(slide.interactiveActivity.indexOf('\n') + 1) 
          : "",
        font_family: slide.fontFamily,
        font_size: slide.fontSize,
        layout: slide.layout,
        presentation: slide.presentation,
      });
    }
  }

  return apiSlides;
};

 

  // Fetch slides data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get token from cookies instead of localStorage
        const token = Cookies.get("authToken");

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
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${id}/contents/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
            credentials: "include", // Important for cross-origin requests with cookies
          }
        );


        console.log(response)
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please login again.",
              variant: "destructive",
            });
            router.push(
              "/auth/login?redirect=" +
                encodeURIComponent(`/course/content-preview/${id}`)
            );
            return;
          }
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // Handle different response formats - extract slides from the nested structure
        let slidesData;
        console.log("Extracted slides data:", data);

        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].slides &&
          Array.isArray(data[0].slides)
        ) {
          // Format from your console output: array with nested slides array
          slidesData = data[0].slides;
          console.log("Found slides in data[0].slides:", slidesData);
        } else if (Array.isArray(data)) {
          // If the response is an array of slides directly
          slidesData = data;
          console.log("Data is directly an array of slides");
        } else if (data.slides && Array.isArray(data.slides)) {
          // Alternative structure
          slidesData = data.slides;
          console.log("Found slides in data.slides");
        } else {
          console.error("Could not find slides in the data structure:", data);
          throw new Error(
            "Unexpected data format - couldn't locate slides array"
          );
        }

        console.log("Extracted slides data:", slidesData);

        // Process the slides into the format expected by the UI
        if (slidesData && slidesData.length > 0) {
          const processedSlides = processSlides(slidesData);

          if (processedSlides.length > 0) {
            setSlides(processedSlides);
            setHistory([processedSlides]);
            setCurrentHistoryIndex(0);
          } else {
            console.error("No slides were processed from data");
            toast({
              title: "Warning",
              description: "No slides found in the course content",
              variant: "warning",
            });
          }
        } else {
          console.error("No slide data available");
          toast({
            title: "Warning",
            description: "No slide data available",
            variant: "warning",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch slides: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchData();
    } else {
      toast({
        title: "Authentication Required",
        description: "Please login to view course content",
        variant: "destructive",
      });
      router.push(
        "/auth/login?redirect=" +
          encodeURIComponent(`/course/content-preview/${id}`)
      );
    }
  }, [id, toast, router, isAuthenticated]);

  // Update slide section with history
  const updateSlideSection = useCallback(
    (section, value) => {
      if (!slides[currentSlide]) {
        console.error("No current slide to update");
        return;
      }

      setSlides((prevSlides) => {
        const newSlides = [...prevSlides];
        newSlides[currentSlide] = {
          ...newSlides[currentSlide],
          [section]: value,
        };

        // Update history for undo/redo functionality
        const newHistory = [
          ...history.slice(0, currentHistoryIndex + 1),
          newSlides,
        ];
        setHistory(newHistory);
        setCurrentHistoryIndex(currentHistoryIndex + 1);

        return newSlides;
      });
    },
    [currentSlide, history, currentHistoryIndex, slides]
  );

  // Undo/Redo handlers
  const undo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex((prev) => prev - 1);
      setSlides(history[currentHistoryIndex - 1]);
    }
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex((prev) => prev + 1);
      setSlides(history[currentHistoryIndex + 1]);
    }
  };

  // Add a new slide
  const addNewSlide = () => {
    const newSlideNumber = slides.length + 1;

    const newSlide = {
      id: Date.now() + Math.random(),
      title: `New Slide ${newSlideNumber}`,
      mainContent: "",
      examples: "",
      interactiveActivity: "",
      fontFamily: "arial",
      fontSize: "16",
      layout: "default",
      presentation: slides[0]?.presentation || null,
    };

    setSlides((prevSlides) => {
      const newSlides = [...prevSlides, newSlide];

      // Update history for undo/redo
      const newHistory = [
        ...history.slice(0, currentHistoryIndex + 1),
        newSlides,
      ];
      setHistory(newHistory);
      setCurrentHistoryIndex(currentHistoryIndex + 1);

      return newSlides;
    });

    // Switch to the new slide
    setCurrentSlide(slides.length);
  };

  // Save slides
  const saveDraft = async () => {
    try {
      // Get token from cookies
      const token = Cookies.get("authToken");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to save your work",
          variant: "destructive",
        });
        router.push(
          "/auth/login?redirect=" +
            encodeURIComponent(`/course/content-preview/${id}`)
        );
        return;
      }

      if (slides.length === 0) {
        toast({
          title: "Error",
          description: "No slides to save",
          variant: "destructive",
        });
        return;
      }

      const apiFormatSlides = convertToApiFormat(slides);
      console.log("Saving slides:", apiFormatSlides);

      // Store original format for sending back to API
      const presentationId = slides[0]?.presentation;

      const requestBody = {
        slides: apiFormatSlides,
      };

      console.log("Saving with request body:", requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${id}/contents/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include", // Important for cross-origin requests with cookies
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          });
          router.push(
            "/auth/login?redirect=" +
              encodeURIComponent(`/course/content-preview/${id}`)
          );
          return;
        }
        throw new Error("Failed to save draft");
      }

      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save draft: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Preview & Edit Content</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="space-x-2"
                onClick={saveDraft}
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
              <Button onClick={() => router.push(`/course/finalization/${id}`)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Finalize</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {slides.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-500 mb-4">
              No slides available. Create your first slide.
            </p>
            <Button onClick={addNewSlide}>
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Add First Slide</span>
            </Button>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="flex-1">
              <Card className="mb-4">
                <CardContent className="p-6">
                  {/* Current Slide Editor */}
                  <div className="bg-white rounded-lg border p-8 min-h-[400px] mb-4">
                    {slides[currentSlide] ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Title
                          </label>
                          <Input
                            className="text-xl font-bold"
                            value={slides[currentSlide].title}
                            onChange={(e) =>
                              updateSlideSection("title", e.target.value)
                            }
                            placeholder="Slide Title"
                          />
                        </div>

                        <div>
                          <Tabs defaultValue="content" className="w-full">
                            <TabsList className="w-full grid grid-cols-3">
                              <TabsTrigger value="content">
                                Main Content
                              </TabsTrigger>
                              <TabsTrigger value="examples">
                                Examples
                              </TabsTrigger>
                              <TabsTrigger value="activity">
                                Activity
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="content" className="pt-4">
                              <label className="block text-sm font-medium mb-2">
                                Main Content
                              </label>
                              <Textarea
                                className="min-h-[200px]"
                                value={slides[currentSlide].mainContent}
                                onChange={(e) =>
                                  updateSlideSection(
                                    "mainContent",
                                    e.target.value
                                  )
                                }
                                placeholder="Main educational content for this slide"
                                style={{
                                  fontFamily: slides[currentSlide].fontFamily,
                                  fontSize: `${slides[currentSlide].fontSize}px`,
                                }}
                              />
                            </TabsContent>

                            <TabsContent value="examples" className="pt-4">
                              <label className="block text-sm font-medium mb-2">
                                Practical Examples
                              </label>
                              <Textarea
                                className="min-h-[200px]"
                                value={slides[currentSlide].examples}
                                onChange={(e) =>
                                  updateSlideSection("examples", e.target.value)
                                }
                                placeholder="Provide practical examples related to this slide's content"
                                style={{
                                  fontFamily: slides[currentSlide].fontFamily,
                                  fontSize: `${slides[currentSlide].fontSize}px`,
                                }}
                              />
                            </TabsContent>

                            <TabsContent value="activity" className="pt-4">
                              <label className="block text-sm font-medium mb-2">
                                Interactive Activity
                              </label>
                              <Textarea
                                className="min-h-[200px]"
                                value={slides[currentSlide].interactiveActivity}
                                onChange={(e) =>
                                  updateSlideSection(
                                    "interactiveActivity",
                                    e.target.value
                                  )
                                }
                                placeholder="Add an interactive activity or question for students"
                                style={{
                                  fontFamily: slides[currentSlide].fontFamily,
                                  fontSize: `${slides[currentSlide].fontSize}px`,
                                }}
                              />
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No slide selected</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentSlide(Math.max(0, currentSlide - 1))
                        }
                        disabled={currentSlide === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm font-medium">
                        Slide {currentSlide + 1} of {slides.length}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentSlide(
                            Math.min(slides.length - 1, currentSlide + 1)
                          )
                        }
                        disabled={currentSlide === slides.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={undo}
                        disabled={currentHistoryIndex <= 0}
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={redo}
                        disabled={currentHistoryIndex >= history.length - 1}
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={addNewSlide}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Slide Thumbnails */}
                  <div className="grid grid-cols-6 gap-2 mt-4">
                    {slides.map((slide, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border rounded p-2 text-center ${
                          index === currentSlide
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      >
                        <div className="text-xs truncate">
                          {slide.title || `Slide ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Editing Tools */}
            <div className="w-80">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <Tabs defaultValue="text">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="text">
                        <Type className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="layout">
                        <Layout className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Font Family
                        </label>
                        <Select
                          value={slides[currentSlide]?.fontFamily || "arial"}
                          onValueChange={(value) =>
                            updateSlideSection("fontFamily", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arial">Arial</SelectItem>
                            <SelectItem value="times">
                              Times New Roman
                            </SelectItem>
                            <SelectItem value="helvetica">Helvetica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Font Size
                        </label>
                        <Select
                          value={slides[currentSlide]?.fontSize || "16"}
                          onValueChange={(value) =>
                            updateSlideSection("fontSize", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12px</SelectItem>
                            <SelectItem value="14">14px</SelectItem>
                            <SelectItem value="16">16px</SelectItem>
                            <SelectItem value="18">18px</SelectItem>
                            <SelectItem value="24">24px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-4">
                      <Select
                        value={slides[currentSlide]?.layout || "default"}
                        onValueChange={(value) =>
                          updateSlideSection("layout", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="two-column">Two Column</SelectItem>
                          <SelectItem value="title-only">Title Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </TabsContent>
                  </Tabs>

                  {/* AI Feedback Section */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex-col space-y-3 items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Stars className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-semibold">AI Suggestions</h3>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful
                        </Button>
                        <Button variant="outline" size="sm">
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Not Helpful
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Consider adding more interactive elements to this slide.
                      You could include a practical example or a quick quiz to
                      reinforce the learning objectives.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContentPreview;
