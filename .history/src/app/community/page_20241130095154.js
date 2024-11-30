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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterVisible, setFilterVisible] = useState(false);

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      author: "John Doe",
      description:
        "A comprehensive introduction to machine learning concepts and applications.",
      category: "Computer Science",
      rating: 4.8,
      reviews: 24,
      isPublic: true,
      date: "2 days ago",
      downloads: 156,
      shares: 45,
      thumbnail: "ML",
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      author: "Sarah Johnson",
      description:
        "Deep dive into advanced mathematical concepts for high school students.",
      category: "Mathematics",
      rating: 4.5,
      reviews: 18,
      isPublic: false,
      date: "5 days ago",
      downloads: 89,
      shares: 23,
      thumbnail: "AM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">
                  Community & Course Sharing
                </h1>
                <p className="text-gray-500">
                  Discover and share educational content
                </p>
              </div>
              <Button className="space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share Your Course</span>
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Courses</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="math">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="language">Languages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="4plus">4+ Stars</SelectItem>
                          <SelectItem value="3plus">3+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {course.thumbnail}
                    </span>
                  </div>
                  {course.isPublic ? (
                    <div className="flex items-center text-green-600 text-sm">
                      <Globe className="h-4 w-4 mr-1" />
                      Public
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Lock className="h-4 w-4 mr-1" />
                      Private
                    </div>
                  )}
                </div>
                <CardTitle className="mt-4">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                      <span>({course.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>Created by {course.author}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm border-t pt-4">
                    <div>
                      <div className="font-medium">{course.downloads}</div>
                      <div className="text-gray-500">Downloads</div>
                    </div>
                    <div>
                      <div className="font-medium">{course.shares}</div>
                      <div className="text-gray-500">Shares</div>
                    </div>
                    <div>
                      <div className="font-medium">{course.reviews}</div>
                      <div className="text-gray-500">Reviews</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </Button>
                    <Button className="flex-1 space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
