"use client";

import React, { useState } from "react";
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
import { ArrowLeft, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CourseCreation = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    description: "",
    content_type: "powerpoint",
    template: "",
    details: "",
  });

  // Validation state
  const [validation, setValidation] = useState({
    subject: true,
    title: true,
    description: true,
    content_type: true,
    template: true,
    details: true,
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

  const validateField = (name, value) => {
    switch (name) {
      case "title":
      case "subject":
        return value.length >= 1 && value.length <= 100;
      case "description":
      case "details":
        return value.length > 0;
      case "content_type":
      case "template":
        return value.length >= 1 && value.length <= 100;
      default:
        return true;
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidation((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newValidation = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const fieldIsValid = validateField(key, formData[key]);
      newValidation[key] = fieldIsValid;
      if (!fieldIsValid) isValid = false;
    });

    setValidation(newValidation);

    if (!isValid) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to create a course");
        return;
      }

      console.log("Creating course with data:", token);

      const response = await fetch("https://eduai-rsjn.onrender.com/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      router.push("/courses"); // Redirect to courses page after successful creation
    } catch (err) {
      setError("Failed to create course. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="space-y-8">
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
                  onValueChange={(value) => handleChange("subject", value)}
                  value={formData.subject}
                >
                  <SelectTrigger
                    className={`w-full ${
                      !validation.subject ? "border-red-500" : ""
                    }`}
                  >
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
                  placeholder="Enter the name of your course"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={!validation.title ? "border-red-500" : ""}
                />
              </div>

              <div className="space-y-4">
                <Label>Course Description *</Label>
                <Textarea
                  placeholder="Briefly describe your course"
                  className={`min-h-[100px] ${
                    !validation.description ? "border-red-500" : ""
                  }`}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
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
                  value={formData.content_type}
                  onValueChange={(value) => handleChange("content_type", value)}
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
                  onValueChange={(value) => handleChange("template", value)}
                  value={formData.template}
                >
                  <SelectTrigger
                    className={`w-full ${
                      !validation.template ? "border-red-500" : ""
                    }`}
                  >
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
                  placeholder="Describe the topics, assignments, or key points you want to cover."
                  className={`min-h-[150px] ${
                    !validation.details ? "border-red-500" : ""
                  }`}
                  value={formData.details}
                  onChange={(e) => handleChange("details", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              className="space-x-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Wand2 className="h-4 w-4" />
              <span>{loading ? "Creating..." : "Generate Course"}</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseCreation;
