"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  Star,
  Share2,
  Download,
  Clock,
  Users,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Eye,
  Globe,
  Lock,
} from "lucide-react";

const CommunitySharing = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: "Introduction to Algebra", author: "John Doe", rating: 4.5, description: "A basic introduction to algebra concepts.", category: "Math", public: true },
    { id: 2, title: "English Grammar Basics", author: "Jane Smith", rating: 4.2, description: "An overview of essential English grammar rules.", category: "Languages", public: false },
  ]);

  const [filters, setFilters] = useState({
    category: "",
    rating: "",
    public: "all",
  });

  const handleShareCourse = (courseId) => {
    // Handle sharing course logic here
    alert(`Sharing course ${courseId}`);
  };

  const handleRating = (courseId, rating) => {
    // Handle rating logic here
    alert(`Rating course ${courseId} with ${rating} stars`);
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Header Section */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Community & Course Sharing</h1>
        <div>
          <button className="bg-green-500 text-white p-2 rounded-lg">Share Your Course</button>
        </div>
      </header>

      {/* Filters Section */}
      <div className="mt-6 flex space-x-4">
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="p-2 border border-gray-400 rounded-md">
          <option value="">Category</option>
          <option value="Math">Math</option>
          <option value="Languages">Languages</option>
          <option value="History">History</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, rating: e.target.value })} className="p-2 border border-gray-400 rounded-md">
          <option value="">Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, public: e.target.value })} className="p-2 border border-gray-400 rounded-md">
          <option value="all">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Course Cards Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <div className="mt-2">
              <span className="text-yellow-500">Rating: {course.rating} ★</span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Link href={`/courses/${course.id}`}>
                <a className="text-blue-600">View Course</a>
              </Link>
              <button onClick={() => handleShareCourse(course.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="mx-2">
            Previous
          </Button>
          <Button variant="outline" className="mx-2">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunitySharing;
