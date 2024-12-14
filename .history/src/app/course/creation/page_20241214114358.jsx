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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Eye, Save, BookOpen, Wand2 } from "lucide-react";
import { useHistory } from "react-router-dom";
const CourseCreation = () => {
  const [contentType, setContentType] = useState("powerpoint");
  const history = useHistory();
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

  const exerciseTypes = [
    { id: "multiple", label: "Multiple Choice" },
    { id: "truefalse", label: "True/False" },
    { id: "fillin", label: "Fill in the Blanks" },
    { id: "essay", label: "Essay Questions" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => history.back()}>
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
          {/* Course Setup Section */}
          <Card>
            <CardHeader>
              <CardTitle>Course Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Select Subject</Label>
                <Select>
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
                <Label>Course Title</Label>
                <Input placeholder="Enter the name of your course" />
              </div>

              <div className="space-y-4">
                <Label>Course Description</Label>
                <Textarea
                  placeholder="Briefly describe your course"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Customization Section */}
          <Card>
            <CardHeader>
              <CardTitle>Content Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Choose Content Type</Label>
                <RadioGroup
                  defaultValue="powerpoint"
                  onValueChange={setContentType}
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
                <Label>Choose a Template</Label>
                <Select>
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
                <Label>Provide Course Details</Label>
                <Textarea
                  placeholder="Describe the topics, assignments, or key points you want to cover."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options Section */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Add Media</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button variant="outline" className="mt-4">
                    Upload Files
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Generate Exercises</Label>
                <div className="grid grid-cols-2 gap-4">
                  {exerciseTypes.map(({ id, label }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox id={id} />
                      <Label htmlFor={id}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="space-x-4">
              <Button variant="outline" className="space-x-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
              <Button variant="outline" className="space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
            </div>
            <Button className="space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>Generate Course</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseCreation;
