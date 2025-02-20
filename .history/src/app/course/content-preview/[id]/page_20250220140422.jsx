"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Download,
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
import { useToast } from "@/hooks/use-toast";

const ContentPreview = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [slides, setSlides] = useState([]);

  const token = localStorage.getItem("token");

  // Improved data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://eduai-rsjn.onrender.com/courses/${id}/contents/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // Process the slides with proper formatting
        const formattedSlides = data.map((slide) => ({
          id: slide.id,
          order: slide.order,
          title: slide.title.replace(/\*\*/g, ""),
          content: slide.content || "",
          fontFamily: slide.font_family || "arial",
          fontSize: slide.font_size || "16",
          layout: slide.layout || "default",
          comments: [],
          presentation: slide.presentation,
        }));

        // Sort slides by order
        const sortedSlides = formattedSlides.sort((a, b) => a.order - b.order);
        setSlides(sortedSlides);

        // Initialize history
        setHistory([sortedSlides]);
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

  // Enhanced updateSlide handler with history management
  const updateSlide = useCallback(
    (changes) => {
      setSlides((prevSlides) => {
        const newSlides = prevSlides.map((slide, index) =>
          index === currentSlide ? { ...slide, ...changes } : slide
        );

        // Add to history with cleanup
        const newHistory = [
          ...history.slice(0, currentHistoryIndex + 1),
          newSlides,
        ];
        setHistory(newHistory);
        setCurrentHistoryIndex(currentHistoryIndex + 1);

        return newSlides;
      });
    },
    [currentSlide, currentHistoryIndex, history]
  );

  // Enhanced addSlide with proper order
  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      order: slides.length + 1,
      title: "New Slide",
      content: "Add your content here",
      fontFamily: "arial",
      fontSize: "16",
      layout: "default",
      comments: [],
      presentation: slides[0]?.presentation, // Maintain presentation reference
    };

    setSlides((prev) => {
      const newSlides = [...prev, newSlide];
      setHistory((prevHistory) => [...prevHistory, newSlides]);
      setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
      return newSlides;
    });

    setCurrentSlide(slides.length);
  };

  // Enhanced save handler with proper data formatting
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

      const formattedSlides = slides.map((slide, index) => ({
        id: slide.id,
        order: index + 1,
        title: slide.title,
        content: slide.content,
        font_family: slide.fontFamily,
        font_size: slide.fontSize,
        layout: slide.layout,
        presentation: slide.presentation,
      }));

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/${id}/contents/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slides: formattedSlides }),
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
                {/* Slide Editor */}
                <div className="bg-white rounded-lg border p-8 min-h-[400px] mb-4">
                  {slides[currentSlide] && (
                    <>
                      <Input
                        className="text-2xl font-bold mb-4 border-none focus:outline-none w-full"
                        value={slides[currentSlide].title}
                        onChange={(e) => updateSlide({ title: e.target.value })}
                        placeholder="Slide Title"
                      />
                      <Textarea
                        className="w-full min-h-[300px] border-none focus:outline-none resize-none"
                        value={slides[currentSlide].content}
                        onChange={(e) =>
                          updateSlide({ content: e.target.value })
                        }
                        placeholder="Slide Content"
                        style={{
                          fontFamily: slides[currentSlide].fontFamily,
                          fontSize: `${slides[currentSlide].fontSize}px`,
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between items-center mb-4">
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
                      <div className="text-xs truncate">{slide.title}</div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="h-full flex items-center justify-center"
                    onClick={addSlide}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel */}
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
                            updateSlide({ fontFamily: value })
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
                            updateSlide({ fontSize: value })
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
                          updateSlide({ layout: value })
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentPreview;
