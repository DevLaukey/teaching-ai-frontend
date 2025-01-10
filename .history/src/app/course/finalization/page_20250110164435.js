"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  FileDown,
  Share2,
  Check,
  ExternalLink,
  Book,
  File,
  FileText,
  Laptop,
  Settings,
  BarChart,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CourseFinalization = () => {

    const router = useRouter();
  const [exportProgress] = useState(100);

  const lmsPlatforms = [
    { id: "moodle", name: "Moodle", icon: "🎓" },
    { id: "classroom", name: "Google Classroom", icon: "📚" },
    { id: "blackboard", name: "Blackboard", icon: "🖥️" },
    { id: "canvas", name: "Canvas", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.back()} variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Course Finalization</h1>
                <p className="text-sm text-gray-500">
                  Export and share your course
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => router.push(`/course/export-settings`)}
                variant="outline"
                className="space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Export Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Course Summary */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>
                Review your course details before exporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Book className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Introduction to Machine Learning
                    </h3>
                    <p className="text-sm text-gray-500">
                      Computer Science • 12 Slides
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-gray-500">Slides</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-gray-500">Exercises</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-gray-500">Resources</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Completion</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export Course</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Export Options</SheetTitle>
                    <SheetDescription>
                      Choose your preferred export format
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                    >
                      <File className="h-4 w-4" />
                      <span>PowerPoint (PPTX)</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Word Document (DOCX)</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start space-x-2"
                    >
                      <FileDown className="h-4 w-4" />
                      <span>PDF Document</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                onClick={() => router.push(`/course/analytics/`)}
                variant="outline"
                className="w-full space-x-2"
              >
                <BarChart className="h-4 w-4" />
                <span>View Analytics</span>
              </Button>
            </CardContent>
          </Card>

          {/* LMS Integration */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>LMS Integration</CardTitle>
              <CardDescription>
                Export directly to your Learning Management System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {lmsPlatforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className="h-auto p-4 justify-start space-x-4"
                  >
                    <div className="text-2xl">{platform.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{platform.name}</div>
                      <div className="text-sm text-gray-500">
                        Connect & Export
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
              <CardDescription>Share with other educators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div className="text-sm font-medium">Community Rating</div>
                </div>
                <div className="text-2xl font-bold">4.8</div>
              </div>
              <Button variant="outline" className="w-full">
                Share with Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center py-4 border-t">
          <Button variant="outline">Save as Draft</Button>
          <Button className="space-x-2">
            <Check className="h-4 w-4" />
            <span>Finalize Course</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CourseFinalization;
