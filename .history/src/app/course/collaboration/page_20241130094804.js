import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  History,
  MessageSquare,
  Settings,
  UserPlus,
  Mail,
  Link,
  Clock,
  Check,
  MoreVertical,
  Edit3,
  Eye,
} from "lucide-react";

const CollaborationScreen = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Sarah Johnson",
      text: "Can we add more examples to this section?",
      time: "10 minutes ago",
      resolved: false,
      replies: [
        {
          id: 101,
          user: "John Doe",
          text: "Good idea, I'll work on it.",
          time: "5 minutes ago",
        },
      ],
    },
  ]);

  const collaborators = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Editor",
      online: true,
      avatar: "JD",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Viewer",
      online: true,
      avatar: "SJ",
    },
  ];

  const versions = [
    {
      id: 1,
      date: "Mar 30, 2024",
      time: "2:30 PM",
      user: "John Doe",
      changes: "Updated slide content and added new examples",
    },
    {
      id: 2,
      date: "Mar 29, 2024",
      time: "4:15 PM",
      user: "Sarah Johnson",
      changes: "Added new exercise section",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                Introduction to Machine Learning
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">
                  Last edited 2 minutes ago
                </span>
                <div className="flex -space-x-2">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 ring-2 ring-white"
                      title={collaborator.name}
                    >
                      {collaborator.avatar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Share Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Invite</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Invite Collaborators</SheetTitle>
                    <SheetDescription>
                      Invite people to collaborate on this course
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Email Invitation
                        </label>
                        <div className="flex space-x-2">
                          <Input placeholder="Enter email address" />
                          <Button>
                            <Mail className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Share Link
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            value="https://edu.ai/collaborate/xyz123"
                            readOnly
                          />
                          <Button variant="outline">
                            <Link className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="outline" size="icon">
                <History className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-6">
                {/* Placeholder for course content */}
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                  Course content editor area
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="w-80">
            <Tabs defaultValue="comments" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comments">
                  <MessageSquare className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="people">
                  <Users className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              {/* Comments Tab */}
              <TabsContent value="comments">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {comment.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{comment.user}</div>
                              <div className="text-sm text-gray-600">
                                {comment.text}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {comment.time}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="ml-10 flex items-start space-x-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {reply.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {reply.user}
                              </div>
                              <div className="text-sm text-gray-600">
                                {reply.text}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {reply.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* People Tab */}
              <TabsContent value="people">
                <Card>
                  <CardHeader>
                    <CardTitle>Collaborators</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {collaborator.avatar}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {collaborator.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {collaborator.role}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {collaborator.online && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Remove Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Version History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {versions.map((version) => (
                      <div key={version.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{version.user}</div>
                            <div className="text-sm text-gray-600">
                              {version.changes}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {version.date} at {version.time}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Restore
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationScreen;
