import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Clock,
  Star,
} from "lucide-react";
import { useRouter } from "next/router";

const LandingPage = () => {
  const router = useRouter();

  const testimonials = [
    {
      text: "This platform has revolutionized how I create my course materials. What used to take hours now takes minutes.",
      author: "Sarah Johnson",
      role: "High School Teacher",
    },
    {
      text: "The AI-generated content is surprisingly well-tailored to my students' needs. It's like having a teaching assistant.",
      author: "Michael Chen",
      role: "University Professor",
    },
  ];

  const handleAuthNavigation = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">EduAI</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-600 hover:text-blue-600">
            Features
          </a>
          <a href="#about" className="text-gray-600 hover:text-blue-600">
            About
          </a>
          <a href="#contact" className="text-gray-600 hover:text-blue-600">
            Contact
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleAuthNavigation}>
            Log In
          </Button>
          <Button onClick={handleAuthNavigation}>Sign Up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Create Engaging Courses in Minutes with AI-Powered Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your lesson planning and content creation with our smart
            AI assistant. Generate presentations, assignments, and more—all
            customized to your needs.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAuthNavigation}
            >
              Start Creating Your Course
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleAuthNavigation}>
              Learn More
              <BookOpen className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Reduce hours of preparation to minutes with AI-powered content
                generation.
              </p>
            </Card>
            <Card className="p-6">
              <GraduationCap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Content</h3>
              <p className="text-gray-600">
                Generate materials tailored to your subject and teaching style.
              </p>
            </Card>
            <Card className="p-6">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Any Subject</h3>
              <p className="text-gray-600">
                From languages to math, create content for any field of study.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Educators Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting Text */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl text-gray-600">
            Whether you're teaching languages, math, history, or any subject,
            our AI-powered platform helps you save time by generating
            high-quality course materials. Focus on teaching, while we handle
            the content.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-blue-600 hover:bg-blue-700"
            onClick={handleAuthNavigation}
          >
            Get Started Now
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
