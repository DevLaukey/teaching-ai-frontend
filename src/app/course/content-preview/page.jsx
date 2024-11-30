import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

const ContentPreview = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showComments, setShowComments] = useState(false);

  // Mock slides data
  const slides = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      content: "Understanding the basics of ML",
      comments: [{ user: "John", text: "Maybe add more examples here" }],
    },
    {
      id: 2,
      title: "Types of Machine Learning",
      content: "Supervised vs Unsupervised Learning",
      comments: [],
    },
    {
      id: 3,
      title: "Applications of ML",
      content: "Real-world examples and use cases",
      comments: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Preview & Edit Content</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
              <Button className="space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
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
                    <Button variant="outline" size="icon">
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Current Slide Preview */}
                <div className="bg-white rounded-lg border p-8 min-h-[400px] mb-4">
                  <h2 className="text-2xl font-bold mb-4">
                    {slides[currentSlide].title}
                  </h2>
                  <p>{slides[currentSlide].content}</p>
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
                  <Button variant="outline" className="h-full">
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
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="text">
                      <Type className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="media">
                      <Image className="h-4 w-4" />
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
                      <Select>
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
                      <Select>
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
                    <Button variant="outline" className="w-full">
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <Button variant="outline" className="w-full">
                      Add Video
                    </Button>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Change Layout
                    </Button>
                    <Button variant="outline" className="w-full">
                      Add New Slide
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Show Comments
                  </Button>
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
