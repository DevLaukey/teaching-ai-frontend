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
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  Book,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
} from "lucide-react";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create my first course?",
          a: "To create your first course, click the 'Create Course' button on your dashboard. Follow the step-by-step wizard to add content, quizzes, and materials.",
        },
        {
          q: "How do I invite students to my course?",
          a: "You can invite students by sharing a course link or sending email invitations from the course settings page.",
        },
      ],
    },
    {
      category: "Account & Billing",
      questions: [
        {
          q: "How do I update my subscription?",
          a: "Go to Settings > Subscription to view and modify your current plan.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
        },
      ],
    },
  ];

  const systemStatus = {
    api: { status: "operational", uptime: "99.9%" },
    website: { status: "operational", uptime: "99.9%" },
    classroom: { status: "maintenance", uptime: "98.5%" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Help & Support</h1>
                <p className="text-gray-500">Find answers and get assistance</p>
              </div>
              {/* <Button className="space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Start Live Chat</span>
              </Button> */}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="md:col-span-2 w-full grid grid-cols-2 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Book className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Browse Tutorials</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Learn how to use our platform
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Get help via email
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Available Mon-Fri, 9am-5pm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Left Column - FAQs and Guides */}
          <div className="md:col-span-2 space-y-6">
            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.map((category, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {category.category}
                      </h3>
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`${index}-${faqIndex}`}
                        >
                          <AccordionTrigger>{faq.q}</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-gray-600">{faq.a}</p>
                            <div className="flex items-center space-x-4 mt-4">
                              <p className="text-sm text-gray-500">
                                Was this helpful?
                              </p>
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </div>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Learn through step-by-step guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((video) => (
                    <div key={video} className="bg-gray-50 p-4 rounded-lg">
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <PlayCircle className="h-10 w-10 text-gray-400" />
                      </div>
                      <h4 className="font-medium">Getting Started Guide</h4>
                      <p className="text-sm text-gray-500">3:45 mins</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - System Status and Contact */}
          <div className="space-y-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current platform status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemStatus).map(([service, details]) => (
                  <div
                    key={service}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      {details.status === "operational" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="capitalize">{service}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {details.uptime}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Our support team is available Monday through Friday, 9:00 AM
                  to 5:00 PM EST.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>support@example.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>1-800-123-4567</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Submit Support Ticket</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Live Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat with Support
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Live Chat Support</SheetTitle>
            </SheetHeader>
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4">
                {/* Chat messages would go here */}
                <div className="text-center text-gray-500 mt-4">
                  Start a conversation with our support team
                </div>
              </div>
              <div className="flex space-x-2">
                <Input placeholder="Type your message..." />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default HelpSupport;
