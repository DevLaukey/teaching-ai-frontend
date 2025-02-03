"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Wand2, Upload } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  content_type: z.string().min(1, "Content type is required"),
  template: z.string().min(1, "Template is required"),
  details: z.string().min(1, "Details are required"),
  media: z.any().optional(),
});

const subjects = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Languages",
  "Computer Science",
  "Art",
  "Music",
];

const CourseCreation = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      title: "",
      description: "",
      content_type: "powerpoint",
      template: "",
      details: "",
      media: null,
    },
  });

  const { isSubmitting } = form.formState;

  const handleFile = (file) => {
    if (file && file.type.match(/^(image|video)\//)) {
      form.setValue("media", file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
const onSubmit = async (values) => {
  setIsCreating(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to create a course");
      return;
    }

    const submitData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "media" && values[key]) {
        submitData.append("media", values[key]);
      } else if (values[key]) {
        submitData.append(key, values[key]);
      }
    });

    const response = await fetch("https://eduai-rsjn.onrender.com/courses/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: submitData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const courseId = responseData.id; // Extract the actual course ID

    // Now, make the second POST request to add course content
    const contentResponse = await fetch(
      `https://eduai-rsjn.onrender.com/courses/${courseId}/contents/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: submitData
      }
    );

    if (!contentResponse.ok) {
      throw new Error(
        `Failed to add course content: ${contentResponse.status}`
      );
    }

    // Redirect to the content preview page
    // router.push(`/course/content-preview/${courseId}`);
  } catch (err) {
    setError("Failed to create course. Please try again.");
    console.error("Error:", err);
  } finally {
    setIsCreating(false);
  }
};


  return (
    <>
      {isCreating && <LoadingSpinner />}

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create Your Course</h1>
                <p className="text-gray-600">
                  Let's create a course that's tailored to your teaching needs.
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Course Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Subject *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("subject", value)}
                    value={form.watch("subject")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject.toLowerCase()}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Course Title *</Label>
                  <Input
                    {...form.register("title")}
                    placeholder="Enter the name of your course"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Course Description *</Label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Briefly describe your course"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Course Media (Optional)</Label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex flex-col items-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                      isDragging
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Upload className="h-8 w-8 mb-4 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                      id="media-upload"
                    />
                    <Label
                      htmlFor="media-upload"
                      className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                    >
                      Drag and drop or click to upload image or video
                    </Label>
                    {mediaPreview && (
                      <div className="mt-4 max-w-xs">
                        {form.watch("media")?.type?.startsWith("image/") ? (
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="rounded-lg max-h-40 w-auto"
                          />
                        ) : (
                          <video
                            src={mediaPreview}
                            controls
                            className="rounded-lg max-h-40 w-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Choose Content Type *</Label>
                  <RadioGroup
                    value={form.watch("content_type")}
                    onValueChange={(value) =>
                      form.setValue("content_type", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="powerpoint" id="powerpoint" />
                      <Label htmlFor="powerpoint">PowerPoint</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="word" id="word" />
                      <Label htmlFor="word">Word</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>Choose a Template *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("template", value)}
                    value={form.watch("template")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a template style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Course Details *</Label>
                  <Textarea
                    {...form.register("details")}
                    placeholder="Describe the topics, assignments, or key points you want to cover."
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="space-x-2"
                disabled={isSubmitting}
              >
                <Wand2 className="h-4 w-4" />
                <span>{isSubmitting ? "Creating..." : "Create Course"}</span>
              </Button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default CourseCreation;
