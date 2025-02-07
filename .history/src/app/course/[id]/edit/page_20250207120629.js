"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema
const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content_type: z.string().min(1, "Content type is required"),
  template: z.string().min(1, "Template is required"),
  details: z.string().optional(),
  media: z.any().optional(),
});
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


const clearMedia = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Create FormData with null media
    const formData = new FormData();
    formData.append("media", ""); // Send empty string to clear media

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
      throw new Error("Failed to clear media");
    }

    // Update local state
    form.setValue("media", null);
    setMediaPreview(null);
    setExistingMedia(null);
    setMediaType(null);

    toast({
      title: "Success",
      description: "Media cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing media:", error);
    toast({
      title: "Error",
      description: "Failed to clear media. Please try again.",
      variant: "destructive",
    });
  }
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

      router.push(`/course/${id}`);
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
    }
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
