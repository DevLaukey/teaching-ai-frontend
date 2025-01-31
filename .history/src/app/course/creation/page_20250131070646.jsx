"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  imageUrl: z.string().optional(),
  price: z.coerce
    .number()
    .min(1, "Price is required")
    .max(1000, "Price must be less than $1000"),
  categoryId: z.string().min(1, "Category is required"),
});

const CourseForm = ({ initialData, courseId, categories = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      price: initialData?.price || undefined,
      categoryId: initialData?.categoryId || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      if (courseId) {
        // Update course
        const response = await fetch(`/api/courses/${courseId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to update course");
        }
      } else {
        // Create course
        const response = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to create course");
        }
      }

      router.push(`/teacher/courses`);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.match(/^(image|video)\//)) {
      // Update form data with file
      form.setValue("imageUrl", URL.createObjectURL(file));

      // Create preview URL
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
        <Card>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 'Advanced web development'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isSubmitting}
                          placeholder="e.g. 'This course will teach you advanced web development concepts...'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isSubmitting}
                            placeholder="e.g. '19.99'"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Combobox
                            options={categories.map((category) => ({
                              label: category.name,
                              value: category.id,
                            }))}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Media</FormLabel>
                      <FormControl>
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "flex flex-col items-center p-6 border-2 border-dashed rounded-lg transition-colors",
                            isDragging
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          )}
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
                              {field.value?.includes("image/") ? (
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {initialData && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {initialData ? "Save changes" : "Create course"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CourseForm;
