"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreVertical,
  Ban,
  Edit,
  Trash2,
  CheckCircle,

} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - replace with actual data from your backend
  const [courses] = useState([
    {
      id: 1,
      title: "Introduction to Mathematics",
      status: "active",
      teacher: "John Doe",
      school: "Lincoln High",
    },
    {
      id: 2,
      title: "Advanced Physics",
      status: "banned",
      teacher: "Jane Smith",
      school: "Washington Prep",
    },
  ]);

  const [teachers] = useState([
    {
      id: 1,
      name: "John Doe",
      school: "Lincoln High",
      status: "active",
      courses: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      school: "Washington Prep",
      status: "banned",
      courses: 8,
    },
  ]);

  const [schools] = useState([
    {
      id: 1,
      name: "Lincoln High",
      teachers: 45,
      courses: 156,
      status: "active",
    },
    {
      id: 2,
      name: "Washington Prep",
      teachers: 38,
      courses: 142,
      status: "active",
    },
  ]);

  const getStatusBadge = (status) => {
    const styles =
      status === "active"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return <Badge className={styles}>{status}</Badge>;
  };

  const renderActionMenu = (item, type) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex items-center gap-2">
          <Edit className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-4 w-4" /> Remove
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2">
          {item.status === "active" ? (
            <>
              <Ban className="h-4 w-4" /> Ban
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" /> Activate
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card className="py-10w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Add New</Button>
          </div>

          <TabsContent value="courses" className="mt-0">
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Teacher</th>
                    <th className="p-4 text-left">School</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t">
                      <td className="p-4">{course.title}</td>
                      <td className="p-4">{course.teacher}</td>
                      <td className="p-4">{course.school}</td>
                      <td className="p-4">{getStatusBadge(course.status)}</td>
                      <td className="p-4 text-right">
                        {renderActionMenu(course, "course")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="mt-0">
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">School</th>
                    <th className="p-4 text-left">Courses</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-t">
                      <td className="p-4">{teacher.name}</td>
                      <td className="p-4">{teacher.school}</td>
                      <td className="p-4">{teacher.courses}</td>
                      <td className="p-4">{getStatusBadge(teacher.status)}</td>
                      <td className="p-4 text-right">
                        {renderActionMenu(teacher, "teacher")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="schools" className="mt-0">
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Teachers</th>
                    <th className="p-4 text-left">Courses</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school) => (
                    <tr key={school.id} className="border-t">
                      <td className="p-4">{school.name}</td>
                      <td className="p-4">{school.teachers}</td>
                      <td className="p-4">{school.courses}</td>
                      <td className="p-4">{getStatusBadge(school.status)}</td>
                      <td className="p-4 text-right">
                        {renderActionMenu(school, "school")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
