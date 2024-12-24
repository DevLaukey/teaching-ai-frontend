"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart,
  Book,
  Edit,
  Download,
  Share2,
  Users,
  Star,
  MessageSquare,
  MoreVertical,
  PlayCircle,
  FileText,
  Settings,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CourseView = () => {
  const param = useParams();
  const { id } = param;
  const router = useRouter();
  const { toast } = useToast();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Error",
            description: "Please login to view course details",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch(
          `https://eduai-rsjn.onrender.com/courses/${id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }

        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No course data available</p>
        </div>
      </div>
    );
  }

  const isVideo = courseData.media?.toLowerCase().endsWith('.mp4') || 
                 courseData.media?.toLowerCase().endsWith('.mov') || 
                 courseData.media?.toLowerCase().endsWith('.webm');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{courseData.title}</h1>
                <p className="text-sm text-gray-500">
                  Last updated {new Date(courseData.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                className="space-x-2"
                onClick={() => router.push(`/course/${id}/edit`)}
              >
                <Edit className="h-4 w-4" />
                <span>Edit Course</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Course Content - 2/3 width */}
          <div className="col-span-2 space-y-6">
            {/* Course Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                  {courseData.media ? (
                    isVideo ? (
                      <video 
                        src={courseData.media}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={courseData.media}
                        alt={courseData.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="h-16 w-16 mb-2" />
                      <p className="text-sm">No media available</p>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">{courseData.description}</p>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {courseData.duration || "Not specified"}
                    </div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {courseData.content_type}
                    </div>
                    <div className="text-xs text-gray-500">Content Type</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {courseData.enrolled_students || 0}
                    </div>
                    <div className="text-xs text-gray-500">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <Star className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm font-medium">
                      {courseData.rating || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Additional information about the course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {courseData.details || "No detailed information available."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Template</span>
                      <span className="capitalize">{courseData.template}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full">Start Learning</Button>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Materials
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium">
                      {new Date(courseData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {new Date(courseData.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subject</span>
                    <span className="font-medium capitalize">{courseData.subject}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditCoursePage = () => {
  const param = useParams();
  const router = useRouter();
  const id = param.id;
  const { toast } = useToast();
  const [mediaPreview, setMediaPreview] = useState(null);
  const [existingMedia, setExistingMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      title: "",
      description: "",
      content_type: "",
      template: "",
      details: "",
      media: null,
    },
  });

  // Fetch course data
  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/${id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch course data");
      }

      const data = await response.json();
      // Reset form with fetched data
      form.reset({
        subject: data.subject || "",
        title: data.title || "",
        description: data.description || "",
        content_type: data.content_type || "",
        template: data.template || "",
        details: data.details || "",
      });

      // Set existing media if available
      if (data.media) {
        setExistingMedia(data.media);
        // Determine media type from URL
        const isVideo = data.media.toLowerCase().match(/\.(mp4|mov|webm)$/);
        setMediaType(isVideo ? "video" : "image");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({
        title: "Error",
        description: "Failed to load course data. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handleMediaChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Update form field
      field.onChange(file);

      // Create preview URL and set media type
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      setMediaType(file.type.startsWith("image/") ? "image" : "video");
      setExistingMedia(null); // Clear existing media when new file is selected
    }
  };

  const clearMedia = () => {
    form.setValue("media", null);
    setMediaPreview(null);
    setExistingMedia(null);
    setMediaType(null);
  };

  // Submit handler
  const onSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "media" && values[key]) {
          formData.append("media", values[key]);
        } else if (values[key]) {
          formData.append(key, values[key]);
        }
      });

      const response = await fetch(
        `https://eduai-rsjn.onrender.com/courses/${id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      router.push("/course");
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderMediaPreview = () => {
    if (mediaPreview) {
      return mediaType === "image" ? (
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
      );
    } else if (existingMedia) {
      return mediaType === "image" ? (
        <img
          src={existingMedia}
          alt="Current media"
          className="rounded-lg max-h-40 w-auto"
        />
      ) : (
        <video
          src={existingMedia}
          controls
          className="rounded-lg max-h-40 w-auto"
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Course</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter course description"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content Type */}
                <FormField
                  control={form.control}
                  name="content_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="powerpoint">PowerPoint</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Template */}
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Details */}
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter additional details"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Media Upload */}
                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Media</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg border-gray-300 hover:border-gray-400 transition-colors">
                          <Upload className="h-8 w-8 mb-4 text-gray-400" />
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => handleMediaChange(e, field)}
                            className="hidden"
                            id="media-upload"
                          />
                          <label
                            htmlFor="media-upload"
                            className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                          >
                            Click to upload image or video
                          </label>

                          {/* Preview section */}
                          {(mediaPreview || existingMedia) && (
                            <div className="mt-4 relative">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200"
                                onClick={clearMedia}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              {renderMediaPreview()}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditCoursePage;