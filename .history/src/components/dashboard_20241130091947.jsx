import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  Book,
  GraduationCap,
  Layout,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";

const Navigation = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: "New Course Template Available",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Student Feedback Received",
      time: "5 hours ago",
    },
  ]);

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">EduAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Layout className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
            <a
              href="/courses"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Book className="h-4 w-4" />
              <span>My Courses</span>
            </a>
            <a
              href="/community"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Users className="h-4 w-4" />
              <span>Community</span>
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Messages */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MessageSquare className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id}>
                    <div className="flex flex-col">
                      <span>{notification.title}</span>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      JD
                    </span>
                  </div>
                  <span>John Doe</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  <a
                    href="/dashboard"
                    className="flex items-center space-x-2 text-lg"
                  >
                    <Layout className="h-5 w-5" />
                    <span>Dashboard</span>
                  </a>
                  <a
                    href="/courses"
                    className="flex items-center space-x-2 text-lg"
                  >
                    <Book className="h-5 w-5" />
                    <span>My Courses</span>
                  </a>
                  <a
                    href="/community"
                    className="flex items-center space-x-2 text-lg"
                  >
                    <Users className="h-5 w-5" />
                    <span>Community</span>
                  </a>
                  <a
                    href="/messages"
                    className="flex items-center space-x-2 text-lg"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </a>
                  <a
                    href="/profile"
                    className="flex items-center space-x-2 text-lg"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
