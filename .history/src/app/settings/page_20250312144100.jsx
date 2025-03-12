"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Upload, Eye, EyeOff, Check } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const SettingsProfile = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  // Get user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!token) {
          toast({
            title: "Error",
            description: "Please log in to view your profile",
            variant: "destructive",
          });
          return;
        }

        console.log("token", token);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

    

        console.log("response", response);
        if (response.ok) {
          const data = await response.json();
          setUserDetails({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            password: "",
          });
        } else {
          throw new Error("Failed to fetch user details");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        });
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const updateData = {
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
      };

      // Only include password if it's been changed
      if (userDetails.password && userDetails.password !== "********") {
        updateData.password = userDetails.password;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log("casd", response);
      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <Button
              className="space-x-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Check className="h-4 w-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-1 w-full max-w-2xl">
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
                        {userDetails.first_name?.[0]}
                        {userDetails.last_name?.[0]}
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
                        <Input
                          name="first_name"
                          value={userDetails.first_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          name="last_name"
                          value={userDetails.last_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <div className="relative">
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          value={userDetails.password}
                          onChange={handleInputChange}
                          placeholder="Leave blank to keep current password"
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
