"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Star,
  Upload,
  ThumbsUp,
  MessageSquare,
  Send,
  Sparkles,
  Zap,
  Settings,
  CheckCircle2,
} from "lucide-react";

const FeedbackEvaluation = () => {
  const [overallRating, setOverallRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const features = [
    { name: "AI Content Generation", id: "ai", rating: 0 },
    { name: "Course Creation", id: "course", rating: 0 },
    { name: "User Interface", id: "ui", rating: 0 },
    { name: "Performance", id: "performance", rating: 0 },
  ];

  const renderStars = (rating, setRating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`focus:outline-none ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Feedback and Evaluation</h1>
            <p className="text-gray-500">Help us improve your experience</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {!submitted ? (
          <div className="space-y-6">
            {/* Overall Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Rating</CardTitle>
                <CardDescription>
                  How would you rate your overall experience?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {renderStars(overallRating, setOverallRating)}
                </div>
                {overallRating > 0 && (
                  <div className="text-center text-sm text-gray-500">
                    {overallRating} out of 5 stars
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feature Ratings */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Ratings</CardTitle>
                <CardDescription>
                  Rate specific features of our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{feature.name}</span>
                    {renderStars(feature.rating, () => {})}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Detailed Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Feedback</CardTitle>
                <CardDescription>
                  Share your thoughts and suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="improvement">
                        Suggestion for Improvement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Feedback</label>
                  <Textarea
                    placeholder="Tell us what you think..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Attachments</label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports images and documents up to 10MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Survey Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Survey</CardTitle>
                <CardDescription>
                  Help us understand your needs better
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      How often do you use our platform?
                    </label>
                    <RadioGroup className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <label htmlFor="daily">Daily</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <label htmlFor="weekly">Weekly</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <label htmlFor="monthly">Monthly</label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      What features would you like to see added?
                    </label>
                    <Textarea placeholder="Share your feature requests..." />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button className="w-full" onClick={() => setSubmitted(true)}>
              Submit Feedback
            </Button>
          </div>
        ) : (
          // Thank You Message
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Thank You for Your Feedback!
              </h2>
              <p className="text-gray-600 mb-6">
                Your input helps us improve our platform and better serve our
                users. We appreciate you taking the time to share your thoughts.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another Response
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedbackEvaluation;
