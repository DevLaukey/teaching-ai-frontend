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

    // For each slide in the raw data
    for (const slide of rawSlides) {
      // Extract slide data based on the format received from API
      if (slide.title.startsWith("### Slide")) {
        // Direct format (### Slide X: Title with combined content)
        const slideTitle = slide.title.replace(/^### Slide \d+:\s*/, "");

        // Parse the content field which includes Content, Examples, and Activity
        const content = slide.content || "";

        // Extract main content
        let mainContent = "";
        const contentMatch = content.match(
          /\*\*Content:\*\*\s*([\s\S]*?)(?=\*\*Examples:|$)/
        );
        if (contentMatch && contentMatch[1]) {
          mainContent = contentMatch[1].trim();
        }

        // Extract examples
        let examples = "";
        const examplesMatch = content.match(
          /\*\*Examples:\*\*\s*([\s\S]*?)(?=\*\*Activity:|$)/
        );
        if (examplesMatch && examplesMatch[1]) {
          examples = examplesMatch[1].trim();
        }

        // Extract activity
        let interactiveActivity = "";
        const activityMatch = content.match(/\*\*Activity:\*\*\s*([\s\S]*?)$/);
        if (activityMatch && activityMatch[1]) {
          interactiveActivity = activityMatch[1].trim();
        }

        // Create processed slide object
        processedSlides.push({
          id: slide.id,
          title: slideTitle,
          mainContent: mainContent,
          examples: examples,
          interactiveActivity: interactiveActivity,
          fontFamily: slide.font_family || "arial",
          fontSize: slide.font_size || "16",
          layout: slide.layout || "default",
          presentation: slide.presentation,
        });
      }
    }

    return processedSlides;
  };

  // Convert processed slides back to API format
  const convertToApiFormat = (processedSlides) => {
    const apiSlides = [];
    let order = 1;

    for (const slide of processedSlides) {
      // Add slide title using the newer format
      apiSlides.push({
        id: slide.id || Date.now() + Math.random(),
        order: order++,
        title: `### Slide ${order - 1}: ${slide.title}`,
        content: "",
        font_family: slide.fontFamily,
        font_size: slide.fontSize,
        layout: slide.layout,
        presentation: slide.presentation,
      });

      // Combine content, examples, and activity into a structured format
      let fullContent = "";

      // Add main content
      if (slide.mainContent) {
        fullContent += "**Content:** \n" + slide.mainContent + "\n";
      }

      // Add examples if present
      if (slide.examples) {
        fullContent += "\n**Examples:** \n" + slide.examples + "\n";
      }

      // Add interactive activity if present
      if (slide.interactiveActivity) {
        fullContent += "\n**Activity:** \n" + slide.interactiveActivity;
      }

      // Add the combined content as a single item
      if (fullContent) {
        apiSlides.push({
          id: Date.now() + Math.random(),
          order: order++,
          title: "",
          content: fullContent.trim(),
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

        console.log("Fetched slides data:", data[0]?.slides);

        // Process the slides into the format expected by the UI
        if (data[0]?.slides && Array.isArray(data[0].slides)) {
          const processedSlides = processSlides(data[0].slides);
          console.log("Processed slides:", processedSlides);

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
          console.error("Invalid slide data format received");
          toast({
            title: "Error",
            description: "Invalid slide data format",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch slides: " + error.message,
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [id, token, toast]);

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
    const newSlide = {
      id: Date.now() + Math.random(),
      title: `New Slide ${slides.length + 1}`,
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
      // Update history
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
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to save your work",
          variant: "destructive",
        });
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${id}/contents/`,
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
        description: "Failed to save draft: " + error.message,
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
