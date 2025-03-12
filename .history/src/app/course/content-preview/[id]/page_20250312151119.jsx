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
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "../../../../hooks/use-toast";

const ContentPreview = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const token = localStorage.getItem("token");

  // Process raw slides into grouped format
  const processSlides = (rawSlides) => {
    const processedSlides = [];
    let currentSlide = {
      id: null,
      title: "",
      mainContent: "",
      examples: "",
      interactiveActivity: "",
      fontFamily: "arial",
      fontSize: "16",
      layout: "default",
      presentation: null,
    };

    for (const slide of rawSlides) {
      // If we hit a divider, save current slide and start a new one
      if (slide.title.includes("----------------------")) {
        if (currentSlide.id) {
          processedSlides.push({ ...currentSlide });
        }
        currentSlide = {
          id: null,
          title: "",
          mainContent: "",
          examples: "",
          interactiveActivity: "",
          fontFamily: "arial",
          fontSize: "16",
          layout: "default",
          presentation: slide.presentation,
        };
        continue;
      }

      // Process slide based on content type
      if (slide.title.includes("**Slide")) {
        // New slide starts
        if (currentSlide.id) {
          processedSlides.push({ ...currentSlide });
        }
        currentSlide = {
          id: slide.id,
          title: slide.content.replace("Title: ", ""),
          mainContent: "",
          examples: "",
          interactiveActivity: "",
          fontFamily: slide.font_family,
          fontSize: slide.font_size,
          layout: slide.layout,
          presentation: slide.presentation,
        };
      } else if (slide.title.startsWith("Content:")) {
        currentSlide.mainContent +=
          (currentSlide.mainContent ? "\n" : "") +
          slide.title.replace("Content: ", "");
        if (slide.content) {
          currentSlide.mainContent += "\n" + slide.content;
        }
      } else if (slide.title === "Examples:") {
        currentSlide.examples = slide.content;
      } else if (slide.title.startsWith("Interactive activity:")) {
        currentSlide.interactiveActivity = slide.title.replace(
          "Interactive activity: ",
          ""
        );
      } else if (!slide.title.includes("**Slide")) {
        // Additional content paragraphs
        currentSlide.mainContent +=
          (currentSlide.mainContent ? "\n" : "") + slide.title;
      }
    }

    // Add the last slide
    if (currentSlide.id) {
      processedSlides.push(currentSlide);
    }

    return processedSlides;
  };

  // Convert processed slides back to API format
  const convertToApiFormat = (processedSlides) => {
    const apiSlides = [];
    let order = 1;

    for (const slide of processedSlides) {
      // Add slide title
      apiSlides.push({
        id: slide.id,
        order: order++,
        title: `**Slide ${apiSlides.length + 1}**`,
        content: `Title: ${slide.title}`,
        font_family: slide.fontFamily,
        font_size: slide.fontSize,
        layout: slide.layout,
        presentation: slide.presentation,
      });

      // Add main content split into paragraphs
      const contentParagraphs = slide.mainContent
        .split("\n")
        .filter((p) => p.trim());
      for (const paragraph of contentParagraphs) {
        apiSlides.push({
          id: Date.now() + Math.random(),
          order: order++,
          title: `Content: ${paragraph}`,
          content: "",
          font_family: slide.fontFamily,
          font_size: slide.fontSize,
          layout: slide.layout,
          presentation: slide.presentation,
        });
      }

      // Add examples if present
      if (slide.examples) {
        apiSlides.push({
          id: Date.now() + Math.random(),
          order: order++,
          title: "Examples:",
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
          id: Date.now() + Math.random(),
          order: order++,
          title: `Interactive activity: ${slide.interactiveActivity}`,
          content: "",
          font_family: slide.fontFamily,
          font_size: slide.fontSize,
          layout: slide.layout,
          presentation: slide.presentation,
        });
      }

      // Add divider except for last slide
      if (processedSlides.indexOf(slide) < processedSlides.length - 1) {
        apiSlides.push({
          id: Date.now() + Math.random(),
          order: order++,
          title: "-----------------------",
          content: "",
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
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${id}/contents/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );



        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();



        console.log(data[0].slides);
        const processedSlides = processSlides(data[0].slides);

        console.log("processedSlides:", processedSlides); 
        setSlides(processedSlides);
        setHistory([processedSlides]);
        setCurrentHistoryIndex(0);
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch slides",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [id, token, toast]);

  // Update slide section with history
  const updateSlideSection = useCallback(
    (section, value) => {
      setSlides((prevSlides) => {
        const newSlides = [...prevSlides];
        newSlides[currentSlide] = {
          ...newSlides[currentSlide],
          [section]: value,
        };

        // Update history
        const newHistory = [
          ...history.slice(0, currentHistoryIndex + 1),
          newSlides,
        ];
        setHistory(newHistory);
        setCurrentHistoryIndex(currentHistoryIndex + 1);

        return newSlides;
      });
    },
    [currentSlide, history, currentHistoryIndex]
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

  // Save slides
  const saveDraft = async () => {
    try {
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to save your work",
          variant: "destructive",
        });
        return;
      }

      const apiFormatSlides = convertToApiFormat(slides);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${id}/contents/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slides: apiFormatSlides }),
        }
      );

      if (!response.ok) throw new Error("Failed to save draft");

      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    }
  };

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
        <div className="flex gap-6">
          <div className="flex-1">
            <Card className="mb-4">
              <CardContent className="p-6">
                {/* Current Slide Editor */}
                <div className="bg-white rounded-lg border p-8 min-h-[400px] mb-4">
                  {slides[currentSlide] && (
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
                        <label className="block text-sm font-medium mb-2">
                          Main Content
                        </label>
                        <Textarea
                          className="min-h-[100px]"
                          value={slides[currentSlide].mainContent}
                          onChange={(e) =>
                            updateSlideSection("mainContent", e.target.value)
                          }
                          placeholder="Main content"
                          style={{
                            fontFamily: slides[currentSlide].fontFamily,
                            fontSize: `${slides[currentSlide].fontSize}px`,
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Examples
                        </label>
                        <Textarea
                          className="min-h-[100px]"
                          value={slides[currentSlide].examples}
                          onChange={(e) =>
                            updateSlideSection("examples", e.target.value)
                          }
                          placeholder="Examples"
                          style={{
                            fontFamily: slides[currentSlide].fontFamily,
                            fontSize: `${slides[currentSlide].fontSize}px`,
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Interactive Activity
                        </label>
                        <Textarea
                          className="min-h-[100px]"
                          value={slides[currentSlide].interactiveActivity}
                          onChange={(e) =>
                            updateSlideSection(
                              "interactiveActivity",
                              e.target.value
                            )
                          }
                          placeholder="Interactive activity"
                          style={{
                            fontFamily: slides[currentSlide].fontFamily,
                            fontSize: `${slides[currentSlide].fontSize}px`,
                          }}
                        />
                      </div>
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
                  </div>
                </div>

                {/* Slide Thumbnails */}
                <div className="grid grid-cols-6 gap-2 mt-4">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
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
                          <SelectItem value="times">Times New Roman</SelectItem>
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
                    Consider adding more interactive elements to this slide. You
                    could include a practical example or a quick quiz to
                    reinforce the learning objectives.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentPreview;
