"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Activity } from "lucide-react";

// This component takes the raw slides data directly from your API
// and reorganizes it for display without any mocking
const ContentDisplay = ({ slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [processedSlides, setProcessedSlides] = useState([]);

  useEffect(() => {
    // Process slides data whenever it changes
    if (slides && slides.length > 0) {
      const processed = processSlides(slides);
      setProcessedSlides(processed);
    }
  }, [slides]);

  // Process the raw slide data into a grouped format
  const processSlides = (rawSlides) => {
    // Sort slides by order
    const sortedSlides = [...rawSlides].sort((a, b) => a.order - b.order);

    const processedSlides = [];
    let currentMainSlide = null;

    for (const slide of sortedSlides) {
      // Check if this is a main slide with a title like "### Slide X: Title"
      if (slide.title.includes("Slide") || slide.title.startsWith("###")) {
        // Save previous slide if exists
        if (currentMainSlide) {
          processedSlides.push(currentMainSlide);
        }

        // Extract title
        let slideTitle = slide.title;
        if (slideTitle.includes("Slide")) {
          // Remove any markdown or number prefixes
          const titleMatch =
            slideTitle.match(/Slide \d+:\s*(.+)/) ||
            slideTitle.match(/### Slide \d+:\s*(.+)/);
          if (titleMatch) {
            slideTitle = titleMatch[1].trim();
          } else {
            slideTitle = slideTitle
              .replace(/^### /, "")
              .replace(/^\*\*/, "")
              .replace(/\*\*$/, "");
          }
        }

        // Extract main content - check if it has the "Educational Content" marker
        let mainContent = slide.content || "";
        if (mainContent.includes("Educational Content")) {
          mainContent = mainContent
            .replace(/\*\*Educational Content:\*\*/i, "")
            .trim();
        }

        // Create new slide object
        currentMainSlide = {
          id: slide.id,
          title: slideTitle,
          mainContent: mainContent,
          examples: "",
          interactiveActivity: "",
          fontFamily: slide.font_family,
          fontSize: slide.font_size,
          layout: slide.layout,
          presentation: slide.presentation,
        };
      } else if (slide.title.includes("Practical Examples")) {
        // Add examples to current slide
        if (currentMainSlide) {
          currentMainSlide.examples = slide.content.trim();
        }
      } else if (slide.title.includes("Interactive Activity")) {
        // Add interactive activity to current slide
        if (currentMainSlide) {
          const activityContent = slide.title.includes(":")
            ? slide.title.split(":")[1].trim()
            : "";

          currentMainSlide.interactiveActivity =
            activityContent + (slide.content ? "\n" + slide.content : "");
        }
      } else {
        // Other content - could be a conclusion or miscellaneous
        if (currentMainSlide) {
          if (currentMainSlide.mainContent) {
            currentMainSlide.mainContent +=
              "\n" + slide.title + "\n" + (slide.content || "");
          } else {
            currentMainSlide.mainContent =
              slide.title + "\n" + (slide.content || "");
          }
        }
      }
    }

    // Add the last slide if exists
    if (currentMainSlide) {
      processedSlides.push(currentMainSlide);
    }

    return processedSlides;
  };

  // If no processed slides yet, show loading
  if (processedSlides.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No slides to display</p>
      </div>
    );
  }

  const currentSlide = processedSlides[currentSlideIndex];

  return (
    <div>
      {/* Slide title and content */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <h2
            className="text-xl font-bold mb-4"
            style={{
              fontFamily: currentSlide.fontFamily || "arial",
            }}
          >
            {currentSlide.title}
          </h2>

          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>

              <TabsTrigger
                value="examples"
                className="flex items-center gap-2"
                disabled={!currentSlide.examples}
              >
                <BookOpen className="h-4 w-4" />
                <span>Examples</span>
              </TabsTrigger>

              <TabsTrigger
                value="activity"
                className="flex items-center gap-2"
                disabled={!currentSlide.interactiveActivity}
              >
                <Activity className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div
                className="whitespace-pre-line"
                style={{
                  fontFamily: currentSlide.fontFamily || "arial",
                  fontSize: `${currentSlide.fontSize || 16}px`,
                }}
              >
                {currentSlide.mainContent || "No content available."}
              </div>
            </TabsContent>

            <TabsContent value="examples">
              <div
                className="whitespace-pre-line"
                style={{
                  fontFamily: currentSlide.fontFamily || "arial",
                  fontSize: `${currentSlide.fontSize || 16}px`,
                }}
              >
                {currentSlide.examples || "No examples available."}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div
                className="whitespace-pre-line"
                style={{
                  fontFamily: currentSlide.fontFamily || "arial",
                  fontSize: `${currentSlide.fontSize || 16}px`,
                }}
              >
                {currentSlide.interactiveActivity || "No activity available."}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() =>
            setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
          }
          disabled={currentSlideIndex === 0}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">
          Slide {currentSlideIndex + 1} of {processedSlides.length}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentSlideIndex(
              Math.min(processedSlides.length - 1, currentSlideIndex + 1)
            )
          }
          disabled={currentSlideIndex === processedSlides.length - 1}
        >
          Next
        </Button>
      </div>

      {/* Slide thumbnails */}
      <div className="grid grid-cols-6 gap-2 mt-4">
        {processedSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`cursor-pointer border rounded p-2 text-center truncate ${
              index === currentSlideIndex
                ? "border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setCurrentSlideIndex(index)}
          >
            <div className="text-xs truncate">
              {`${index + 1}. ${slide.title}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay;
