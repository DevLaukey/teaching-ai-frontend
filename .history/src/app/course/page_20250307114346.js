"use client"

import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Share2,
  Users,
  Star,
  Filter,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Eye,
  CheckCircle,
  BarChart,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MyCourses = () => {
 const router = useRouter();
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedStatus, setSelectedStatus] = useState("all");
 const [selectedCourses, setSelectedCourses] = useState([]);
 const [sortBy, setSortBy] = useState("newest");
 const [courses, setCourses] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 // Fetch courses from the API
 const fetchCourses = async () => {
   try {
     setLoading(true);
     const token = localStorage.getItem("token");
     if (!token) {
       throw new Error("No authentication token found");
     }

     const response = await fetch(`${${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/`, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Token ${token}`,
       },
     });

     if (!response.ok) {
       throw new Error("Failed to fetch courses");
     }

     const data = await response.json();

     console.log(data);
     // Transform the API data to match our component's expected format
     const transformedCourses = data.map((course) => ({
       id: course.id,
       title: course.title,
       status: course.status || "Draft",
       created: new Date(course.created_at).toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
       }),
       progress: course.progress || 0,
       students: course.enrolled_students || 0,
       rating: course.rating || 0,
       updates: course.updates || 0,
       comments: course.comments || 0,
       thumbnail: course.title
         .split(" ")
         .map((word) => word[0])
         .join("")
         .slice(0, 2)
         .toUpperCase(),
     }));

     setCourses(transformedCourses);
     setError(null);
   } catch (err) {
     setError(err.message);
     console.error("Error fetching courses:", err);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchCourses();
 }, []);

 // Filter and sort courses
 const filteredCourses = courses
   .filter((course) => {
     const matchesSearch = course.title
       .toLowerCase()
       .includes(searchQuery.toLowerCase());
     const matchesStatus =
       selectedStatus === "all" ||
       course.status.toLowerCase() === selectedStatus.toLowerCase();
     return matchesSearch && matchesStatus;
   })
   .sort((a, b) => {
     switch (sortBy) {
       case "title":
         return a.title.localeCompare(b.title);
       case "rating":
         return b.rating - a.rating;
       case "students":
         return b.students - a.students;
       case "newest":
         return new Date(b.created) - new Date(a.created);
       default:
         return 0;
     }
   });

 const handleSelectCourse = (courseId) => {
   setSelectedCourses((prev) =>
     prev.includes(courseId)
       ? prev.filter((id) => id !== courseId)
       : [...prev, courseId]
   );
 };

 const handleSelectAll = () => {
   setSelectedCourses(
     selectedCourses.length === courses.length
       ? []
       : courses.map((course) => course.id)
   );
 };

 const handleCourseClick = (courseId) => {
   router.push(`/course/${courseId}`);
 };

 const handleCreateCourse = () => {
   router.push("/course/creation");
 };

 const handleDeleteCourses = async () => {
   try {
     const token = localStorage.getItem("token");
     if (!token) {
       throw new Error("No authentication token found");
     }


     if (!selectedCourses.length) {
       throw new Error("No courses selected");
     }
     console.log("Deleting courses:", selectedCourses);
     // Delete each selected course
     await Promise.all(
       selectedCourses.map(async (courseId) => {
         const response = await fetch(
           `${process.env.NEXT_PUBLIC_BACKEND_URL}/${courseId}/`,
           {
             method: "DELETE",
             headers: {
               Authorization: `Token ${token}`,
             },
           }
         );

         if (!response.ok) {
           throw new Error(`Failed to delete course ${courseId}`);
         }
       })
     );


     // Refresh the courses list
     fetchCourses();
     setSelectedCourses([]);
   } catch (err) {
     console.error("Error deleting courses:", err);
     setError(err.message);
   }
 };

 if (loading) {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
         <p className="mt-4">Loading courses...</p>
       </div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="text-center">
         <p className="text-red-600 mb-4">{error}</p>
         <Button onClick={fetchCourses}>Retry</Button>
       </div>
     </div>
   );
 }


 return (
   <div className="min-h-screen bg-gray-50">
     {/* Page Header */}
     <div className="bg-white border-b">
       <div className="max-w-7xl mx-auto px-4 py-6">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
           <div>
             <h1 className="text-2xl font-bold">My Courses</h1>
             <p className="text-sm text-gray-500">
               Manage and track your courses
             </p>
           </div>
           <div className="flex items-center space-x-4">
             {/* <Button
               variant="outline"
               onClick={() => router.push("/course/analytics")}
             >
               <MessageSquare className="h-4 w-4 mr-2" />
               <span>Analytics</span>
             </Button> */}
             <Button
               variant="outline"
               onClick={() => router.push("/community")}
             >
               <Users className="h-4 w-4 mr-2" />
               <span>Community</span>
             </Button>
             <Button
               onClick={() => router.push(`/course/analytics/`)}
               variant="outline"
               className="w-full space-x-2"
             >
               <BarChart className="h-4 w-4" />
               <span>View Analytics</span>
             </Button>

             <Button className="space-x-2" onClick={handleCreateCourse}>
               <Plus className="h-4 w-4" />
               <span>Create New Course</span>
             </Button>
           </div>
         </div>
       </div>
     </div>

     {/* Main Content */}
     <div className="max-w-7xl mx-auto px-4 py-8">
       {/* Search and Filter Bar */}
       <Card className="mb-8">
         <CardContent className="p-4">
           <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
             <div className="flex-1 relative">
               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
               <Input
                 placeholder="Search courses..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9"
               />
             </div>
             <div className="flex space-x-4">
               <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="Filter by status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Courses</SelectItem>
                   <SelectItem value="published">Published</SelectItem>
                   <SelectItem value="draft">Draft</SelectItem>
                   <SelectItem value="in-progress">In Progress</SelectItem>
                 </SelectContent>
               </Select>
               <Select value={sortBy} onValueChange={setSortBy}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="Sort by" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="newest">Newest First</SelectItem>
                   <SelectItem value="title">Title</SelectItem>
                   <SelectItem value="rating">Rating</SelectItem>
                   <SelectItem value="students">Students</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>

           {/* Bulk Actions */}
           {selectedCourses.length > 0 && (
             <div className="mt-4 pt-4 border-t flex justify-between items-center">
               <div className="flex items-center space-x-2">
                 <Checkbox
                   checked={selectedCourses.length === courses.length}
                   onCheckedChange={handleSelectAll}
                 />
                 <span className="text-sm text-gray-600">
                   {selectedCourses.length} selected
                 </span>
               </div>
               <div className="flex space-x-2">
                 <Button variant="outline" size="sm">
                   <Download className="h-4 w-4 mr-2" />
                   Export
                 </Button>
                 <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button
                       variant="outline"
                       size="sm"
                       className="text-red-600"
                     >
                       <Trash2 className="h-4 w-4 mr-2" />
                       Delete
                     </Button>
                   </AlertDialogTrigger>
                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>
                         Delete Selected Courses
                       </AlertDialogTitle>
                       <AlertDialogDescription>
                         Are you sure you want to delete the selected courses?
                         This action cannot be undone.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction
                         className="bg-red-600"
                         onClick={handleDeleteCourses}
                       >
                         Delete
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
               </div>
             </div>
           )}
         </CardContent>
       </Card>

       {/* Course Grid */}
       {filteredCourses.length === 0 ? (
         <div className="text-center py-12">
           <p className="text-gray-500">
             No courses found matching your criteria
           </p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredCourses.map((course) => (
             <Card
               key={course.id}
               className="relative cursor-pointer hover:shadow-lg transition-shadow"
               onClick={() => handleCourseClick(course.id)}
             >
               <div
                 className="absolute top-4 left-4"
                 onClick={(e) => e.stopPropagation()}
               >
                 <Checkbox
                   checked={selectedCourses.includes(course.id)}
                   onCheckedChange={() => handleSelectCourse(course.id)}
                 />
               </div>

               <CardHeader className="pt-12">
                 <div className="flex justify-between items-start">
                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                     <span className="text-blue-600 font-medium">
                       {course.thumbnail}
                     </span>
                   </div>
                   <DropdownMenu>
                     <DropdownMenuTrigger
                       asChild
                       onClick={(e) => e.stopPropagation()}
                     >
                       <Button variant="ghost" size="icon">
                         <MoreHorizontal className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuItem
                         onClick={(e) => {
                           e.stopPropagation();
                           router.push(`/course/${course.id}/edit`);
                         }}
                       >
                         <Edit className="h-4 w-4 mr-2" />
                         Edit
                       </DropdownMenuItem>

                       <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                         <Download className="h-4 w-4 mr-2" />
                         Export
                       </DropdownMenuItem>
                       <DropdownMenuItem
                         className="text-red-600"
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedCourses([course.id]);
                           handleDeleteCourses();
                         }}
                       >
                         <Trash2 className="h-4 w-4 mr-2" />
                         Delete
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </div>
                 <CardTitle className="mt-4">{course.title}</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div className="flex justify-between text-sm">
                     <div
                       className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          course.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : course.status === "Draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                     >
                       {course.status}
                     </div>
                     <span className="text-gray-500">
                       Created {course.created}
                     </span>
                   </div>

                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span>Progress</span>
                       <span>{course.progress}%</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div
                         className="bg-blue-600 h-2 rounded-full"
                         style={{ width: `${course.progress}%` }}
                       />
                     </div>
                   </div>

                   <div className="flex justify-between pt-4 border-t">
                     <div className="flex items-center space-x-1">
                       <Users className="h-4 w-4 text-gray-400" />
                       <span className="text-sm">{course.students}</span>
                     </div>
                     <div className="flex items-center space-x-1">
                       <Star className="h-4 w-4 text-yellow-400" />
                       <span className="text-sm">{course.rating || "-"}</span>
                     </div>
                     <div className="flex items-center space-x-1">
                       <MessageSquare className="h-4 w-4 text-gray-400" />
                       <span className="text-sm">{course.comments}</span>
                     </div>
                     {course.updates > 0 && (
                       <div className="flex items-center space-x-1">
                         <Bell className="h-4 w-4 text-blue-400" />
                         <span className="text-sm">{course.updates}</span>
                       </div>
                     )}
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       )}

       {/* Pagination */}
       {filteredCourses.length > 0 && (
         <div className="mt-8 flex justify-center">
           <Button variant="outline" className="mx-2">
             Previous
           </Button>
           <Button variant="outline" className="mx-2">
             Next
           </Button>
         </div>
       )}
     </div>
   </div>
 );
};

export default MyCourses;
