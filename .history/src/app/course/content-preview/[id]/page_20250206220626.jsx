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
  Image,
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
  const id = 2;
  // const { id } = useParams();

  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Extended slides state with more properties
  const [slides, setSlides] = useState([]);

  // Fetch API data
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
        const formattedSlides = data.presentation.slides.map((slide) => ({
          id: slide.order,
          title: slide.title,
          content: slide.content,
          fontFamily: slide.style.fontFamily,
          fontSize: slide.style.fontSize,
          layout: slide.style.layout,
          comments: [],
          images: [],
        }));
        setSlides(formattedSlides);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch slides",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [id, toast]);

  // Handler for updating slide content
  const updateSlide = useCallback(
    (changes) => {
      setSlides((prevSlides) => {
        const newSlides = [...prevSlides];
        newSlides[currentSlide] = {
          ...newSlides[currentSlide],
          ...changes,
        };

        // Add to history
        setHistory((prev) => [
          ...prev.slice(0, currentHistoryIndex + 1),
          newSlides,
        ]);
        setCurrentHistoryIndex((prev) => prev + 1);

        return newSlides;
      });
    },
    [currentSlide, currentHistoryIndex]
  );

  // Add new slide
  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: "New Slide",
      content: "Add your content here",
      fontFamily: "arial",
      fontSize: "16",
      layout: "default",
      comments: [],
      images: [],
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentSlide(slides.length);
  };

  // Delete current slide
  const deleteSlide = () => {
    if (slides.length <= 1) {
      toast({
        title: "Cannot delete slide",
        description: "You must have at least one slide in the presentation",
        variant: "destructive",
      });
      return;
    }

    setSlides((prev) => prev.filter((_, index) => index !== currentSlide));
    setCurrentSlide((prev) => Math.min(prev, slides.length - 2));
  };

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

  // Save draft
  const saveDraft = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to save your work",
          variant: "destructive",
        });
        return;
      }

      // Add your API endpoint here
      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/${id}/contents/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slides }),
        }
      );

      if (!response.ok) throw new Error("Failed to save draft");

      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    }
  };

  // Add comment
  const addComment = (text) => {
    updateSlide({
      comments: [
        ...slides[currentSlide].comments,
        { id: Date.now(), user: "Current User", text },
      ],
    });
  };

  // Export presentation
  const exportPresentation = () => {
    const dataStr = JSON.stringify(slides, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "presentation.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // handle the finalization of the course
  const handleFinalization = () => {
    router.push(`/course/finalization/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <Button onClick={handleFinalization}>
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Finalize</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Panel - Content Preview */}
          <div className="flex-1">
            <Card className="mb-4">
              <CardContent className="p-6">
                {/* Slide Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentSlide(Math.max(0, currentSlide - 1))
                      }
                      disabled={currentSlide === 0}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Slide {currentSlide + 1} of {slides.length}
                    </span>
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
                      onClick={deleteSlide}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Current Slide Editor */}
                <div className="bg-white rounded-lg border p-8 min-h-[400px] mb-4">
                  <Input
                    className="text-2xl font-bold mb-4 border-none focus:outline-none"
                    value={slides[currentSlide]?.title || ""}
                    onChange={(e) => updateSlide({ title: e.target.value })}
                    placeholder="Slide Title"
                  />
                  <Textarea
                    className="w-full min-h-[300px] border-none focus:outline-none resize-none"
                    value={slides[currentSlide]?.content || ""}
                    onChange={(e) => updateSlide({ content: e.target.value })}
                    placeholder="Slide Content"
                    style={{
                      fontFamily: slides[currentSlide]?.fontFamily || "arial",
                      fontSize: `${slides[currentSlide]?.fontSize || "16"}px`,
                    }}
                  />
                </div>

                {/* Slide Thumbnails */}
                <div className="grid grid-cols-6 gap-2">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`cursor-pointer border rounded p-2 text-center ${
                        index === currentSlide
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <div className="text-xs truncate">{slide.title}</div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="h-full"
                    onClick={addSlide}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
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
                  could include a practical example or a quick quiz to reinforce
                  the learning objectives.
                </p>
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
                    {/* <TabsTrigger value="media">
                      <Image className="h-4 w-4" />
                    </TabsTrigger> */}
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
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateSlide({
                              images: [
                                ...slides[currentSlide].images,
                                reader.result,
                              ],
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {/* <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button> */}
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-4">
                    <Select
                      value={slides[currentSlide]?.layout || "default"}
                      onValueChange={(value) => updateSlide({ layout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="two-column">Two Column</SelectItem>
                        <SelectItem value="title-only">Title Only</SelectItem>
                        <SelectItem value="image-left">Image Left</SelectItem>
                        <SelectItem value="image-right">Image Right</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={addSlide}
                    >
                      Add New Slide
                    </Button>
                  </TabsContent>
                </Tabs>

                {showComments && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <h3 className="font-medium">Comments</h3>
                    <div className="space-y-4">
                      {slides[currentSlide]?.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="font-medium text-sm">
                            {comment.user}
                          </div>
                          <div className="text-sm text-gray-600">
                            {comment.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a comment..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            addComment(e.target.value.trim());
                            e.target.value = "";
                          }
                        }}
                      />
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentPreview;
