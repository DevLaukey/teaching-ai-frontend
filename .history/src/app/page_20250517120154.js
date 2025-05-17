"use client"
import React, { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Clock,
  Star,
  Settings,
  FileText,
  TrendingUp,
  Check,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const NeumorphicNumber = ({ number, color = "blue" }) => (
  <div className="relative inline-block mb-6">
    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]">
      <span className={`text-2xl font-bold text-${color}-600`}>{number}</span>
    </div>
  </div>
);

const LandingPage = () => {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("Math");

  const subjects = ["Math", "Science", "Languages", "History", "Arts"];

  const subjectExamples = {
    Math: "Algebra Equations Interactive Lesson",
    Science: "Solar System Exploration Quiz",
    Languages: "Spanish Conversation Practice",
    History: "World War Timeline Assignment",
    Arts: "Color Theory Creative Project",
  };

  const stats = [
    { number: "50K+", label: "Courses Created" },
    { number: "15K+", label: "Active Teachers" },
    { number: "5+", label: "Hours Saved Weekly" },
    { number: "98%", label: "Teacher Satisfaction" },
  ];

  const features = [
    {
      icon: Clock,
      title: "Smart Content Generation",
      description: "From topic to full lesson in 3 clicks",
      detail:
        "AI analyzes your input and creates comprehensive lesson plans, assignments, and materials instantly",
    },
    {
      icon: FileText,
      title: "Multi-Format Export",
      description: "Presentations, worksheets, quizzes & more",
      detail:
        "Export to PowerPoint, PDF, Google Slides, or print-ready formats",
    },
    {
      icon: Settings,
      title: "Customizable Templates",
      description: "Adapt to your teaching style",
      detail:
        "Pre-built templates for different subjects, grade levels, and teaching methodologies",
    },
    {
      icon: TrendingUp,
      title: "Instant Deployment",
      description: "Ready-to-use materials instantly",
      detail:
        "No more hours of formatting - get professionally designed materials immediately",
    },
  ];

  const testimonials = [
    {
      text: "This platform has completely changed how I create my course materials. What used to take hours now takes minutes.",
      author: "Sarah Johnson",
      role: "High School Teacher",
      subject: "Mathematics",
    },
    {
      text: "The AI-generated content is surprisingly well-tailored to my students' needs. It's like having a teaching assistant.",
      author: "Michael Chen",
      role: "University Professor",
      subject: "Computer Science",
    },
    {
      text: "I've saved over 10 hours a week on lesson planning. The quality is outstanding and my students are more engaged.",
      author: "Emma Rodriguez",
      role: "Elementary Teacher",
      subject: "Science",
    },
  ];

  const comparisonData = [
    { traditional: "6+ Hours Planning", ai: "15 Minutes" },
    { traditional: "Generic Content", ai: "Personalized" },
    { traditional: "Multiple Tools", ai: "All-in-One" },
    { traditional: "Manual Formatting", ai: "Professional Design" },
  ];


  const handleAuthNavigation = () => {
    router.push("/auth/login");
  };
  const handleRegNavigation = () => {
    router.push("/auth/register")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white/90 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">EduAI</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Reviews
          </a>
          {/* <a
            href="#pricing"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Pricing
          </a> */}
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleAuthNavigation}>
            Log In
          </Button>
          <Button
            onClick={handleRegNavigation}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign Up Free
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
              ✨ Trusted by 15,000+ educators worldwide
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
            Create Engaging Courses in Minutes with AI-Powered Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline your lesson planning and content creation with our smart
            AI assistant. Generate presentations, assignments, and more—all
            customized to your needs.
          </p>

          {/* Subject Selector */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubject === subject
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {subject}
                </button>
              ))}
            </div>
            <div className="text-gray-500 text-sm">
              Example: &quot;{subjectExamples[selectedSubject]}&quot;
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              onClick={handleRegNavigation}
            >
              Start Creating for Free
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to transform your teaching</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center flex flex-col h-full">
              <NeumorphicNumber number="1" color="blue" />
              <div className="bg-white p-6 rounded-xl shadow-[10px_10px_30px_rgba(0,0,0,0.05),-10px_-10px_30px_rgba(255,255,255,0.8)] flex-1 flex flex-col min-h-[280px]">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 ">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Input Your Topic</h3>
                <p className="text-gray-600 leading-relaxed">Tell us what you're teaching, grade level, and subject. Our AI will understand your context.</p>
              </div>
            </div>

            <div className="text-center flex flex-col h-full">
              <NeumorphicNumber number="2" color="purple" />
              <div className="bg-white p-6 rounded-xl shadow-[10px_10px_30px_rgba(0,0,0,0.05),-10px_-10px_30px_rgba(255,255,255,0.8)] flex-1 flex flex-col min-h-[280px]">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 ">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Customize Details</h3>
                <p className="text-gray-600 leading-relaxed">Set duration, learning objectives, and teaching style preferences to personalize content.</p>
              </div>
            </div>

            <div className="text-center flex flex-col h-full">
              <NeumorphicNumber number="3" color="green" />
              <div className="bg-white p-6 rounded-xl shadow-[10px_10px_30px_rgba(0,0,0,0.05),-10px_-10px_30px_rgba(255,255,255,0.8)] flex-1 flex flex-col min-h-[280px]">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 ">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Generate & Export</h3>
                <p className="text-gray-600 leading-relaxed">Get polished, professional materials instantly ready for your classroom.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for Modern Educators
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create engaging course content
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-600 font-medium mb-2">
                  {feature.description}
                </p>
                <p className="text-gray-600 text-sm">{feature.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Transform Your Teaching Process
            </h2>
            <p className="text-xl text-gray-600">
              See the difference AI makes in your daily workflow
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                Before AI Tools
              </h3>
              <div className="space-y-4">
                {comparisonData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-gray-600">{item.traditional}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-blue-600">
                With EduAI
              </h3>
              <div className="space-y-4">
                {comparisonData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 font-medium">{item.ai}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Educators Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of teachers who have transformed their workflow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-800">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {testimonial.subject}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of educators who are saving time and creating better
            content with AI
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              onClick={handleRegNavigation}
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 5-minute setup
          </p>
        </div>
      </section>

   
    </div>
  );
};

export default LandingPage;
