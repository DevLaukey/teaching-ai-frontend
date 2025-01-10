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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Link,
  Shield,
  CreditCard,
  Settings,
  Upload,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

const SettingsProfile = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Settings & Profile</h1>
              <p className="text-gray-500">Manage your account preferences</p>
            </div>
            <Button className="space-x-2">
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-medium text-blue-600">
                        JD
                      </span>
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>

                  {/* Profile Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          First Name
                        </label>
                        <Input defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" defaultValue="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <div className="relative">
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          defaultValue="********"
                        />
                        <button
                          className="absolute right-3 top-2.5"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default SettingsProfile;
