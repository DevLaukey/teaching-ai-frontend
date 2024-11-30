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

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login History</p>
                      <p className="text-sm text-gray-500">
                        View your recent login activity
                      </p>
                    </div>
                    <Button variant="outline">View History</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage your notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive course updates via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive updates on your device
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium">
                      Notification Frequency
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>
                  Manage your platform integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        🎓
                      </div>
                      <div>
                        <p className="font-medium">Google Classroom</p>
                        <p className="text-sm text-gray-500">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Disconnect</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        📚
                      </div>
                      <div>
                        <p className="font-medium">Moodle</p>
                        <p className="text-sm text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>
                  Customize your viewing experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-medium">Font Size</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-500">Use dark theme</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Text-to-Speech</p>
                      <p className="text-sm text-gray-500">
                        Enable screen reader support
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">
                        Professional Plan
                      </p>
                      <p className="text-sm text-blue-700">
                        $29/month • Renews on April 30, 2024
                      </p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-medium">Payment Method</label>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <span>•••• •••• •••• 4242</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsProfile;