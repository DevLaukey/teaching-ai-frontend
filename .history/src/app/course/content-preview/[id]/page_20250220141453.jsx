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
  Type,
  Layout,
  PlusCircle,
  CheckCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const ContentPreview = () => {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const token = localStorage.getItem("token");

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

    // Don't forget to add the last slide
    if (currentSlide.id) {
      processedSlides.push(currentSlide);
    }

    return processedSlides;
  };

  // Parse slide content into sections
  const parseSlideContent = (slide) => {
    const sections = {
      title: "",
      content: "",
      examples: "",
      interactive: "",
    };

    if (slide.title?.includes("**Slide")) {
      sections.title = slide.title.replace(/\*\*/g, "");
    }

    if (slide.content?.startsWith("Title:")) {
      sections.title = slide.content
        .split("\n")[0]
        .replace("Title:", "")
        .trim();
    }

    // Extract content section
    const contentMatch = slide.content?.match(
      /Content:(.*?)(?=Examples:|Interactive activity:|$)/s
    );
    if (contentMatch) {
      sections.content = contentMatch[1].trim();
    }

    // Extract examples section
    const examplesMatch = slide.content?.match(
      /Examples:(.*?)(?=Interactive activity:|$)/s
    );
    if (examplesMatch) {
      sections.examples = examplesMatch[1].trim();
    }

    // Extract interactive activity
    const interactiveMatch = slide.content?.match(
      /Interactive activity:(.*?)$/s
    );
    if (interactiveMatch) {
      sections.interactive = interactiveMatch[1].trim();
    }

    return sections;
  };

  // Fetch slides data
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

        const processedSlides = processSlides(data[0].slides);
        setSlides(processedSlides);
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
  // Save changes
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
        content: formatSlideContent(slide.sections),
        font_family: slide.fontFamily,
        font_size: slide.fontSize,
        layout: slide.layout,
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

  // Format slide content for saving
  const formatSlideContent = (sections) => {
    let content = "";
    if (sections.title) {
      content += `Title: ${sections.title}\n\n`;
    }
    if (sections.content) {
      content += `Content: ${sections.content}\n\n`;
    }
    if (sections.examples) {
      content += `Examples: ${sections.examples}\n\n`;
    }
    if (sections.interactive) {
      content += `Interactive activity: ${sections.interactive}`;
    }
    return content.trim();
  };

  // Update slide section
  const updateSlideSection = (section, value) => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[currentSlide] = {
        ...newSlides[currentSlide],
        sections: {
          ...newSlides[currentSlide].sections,
          [section]: value,
        },
      };
      return newSlides;
    });
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
                {/* Slide Content Editor */}
                <div className="bg-white rounded-lg border p-8 min-h-[400px] mb-4">
                  {slides[currentSlide] && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Title
                        </label>
                        <Input
                          className="text-xl font-bold"
                          value={slides[currentSlide].sections.title}
                          onChange={(e) =>
                            updateSlideSection("title", e.target.value)
                          }
                          placeholder="Slide Title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Content
                        </label>
                        <Textarea
                          className="min-h-[100px]"
                          value={slides[currentSlide].sections.content}
                          onChange={(e) =>
                            updateSlideSection("content", e.target.value)
                          }
                          placeholder="Main content"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Examples
                        </label>
                        <Textarea
                          className="min-h-[100px]"
                          value={slides[currentSlide].sections.examples}
                          onChange={(e) =>
                            updateSlideSection("examples", e.target.value)
                          }
                          placeholder="Examples"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Interactive Activity
                        </label>
                        <Textarea
                          className="min-h-[100px]"
                          value={slides[currentSlide].sections.interactive}
                          onChange={(e) =>
                            updateSlideSection("interactive", e.target.value)
                          }
                          placeholder="Interactive activity"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
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
                      <div className="text-xs truncate">
                        {slide.sections.title || `Slide ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
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
                        onValueChange={(value) => {
                          setSlides((prev) => {
                            const newSlides = [...prev];
                            newSlides[currentSlide] = {
                              ...newSlides[currentSlide],
                              fontFamily: value,
                            };
                            return newSlides;
                          });
                        }}
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
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-4">
                    <Select
                      value={slides[currentSlide]?.layout || "default"}
                      onValueChange={(value) => {
                        setSlides((prev) => {
                          const newSlides = [...prev];
                          newSlides[currentSlide] = {
                            ...newSlides[currentSlide],
                            layout: value,
                          };
                          return newSlides;
                        });
                      }}
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
      </main>
    </div>
  );
};

export default ContentPreview;
