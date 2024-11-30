import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Create Engaging Courses in Minutes with AI-Powered Tools
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mb-8">
          Streamline your lesson planning and content creation with our smart AI
          assistant. Generate presentations, assignments, and more—all
          customized to your needs.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex space-x-4">
          {/* Primary CTA */}
          <Link href="/create-course">
            <p className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg shadow-md transition duration-300">
              Start Creating Your Course
            </p>
          </Link>

          {/* Secondary CTA */}
          <Link href="/features">
            <p className="bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg shadow-md hover:bg-white hover:text-teal-600 transition duration-300">
              Learn More
            </p>
          </Link>
        </div>
      </section>

      {/* Supporting Text */}
      <section className="text-center py-12 px-6 bg-white text-gray-700">
        <p className="text-xl sm:text-2xl max-w-2xl mx-auto">
          Whether you're teaching languages, math, history, or any subject, our
          AI-powered platform helps you save time by generating high-quality
          course materials. Focus on teaching, while we handle the content.
        </p>
      </section>

      {/* Navigation Bar (Simple) */}
      <nav className="absolute top-0 left-0 w-full bg-transparent py-6 px-8 z-10">
        <div className="flex justify-between items-center">
          <div className="text-white text-xl font-bold">
            <Link href="/">
              EduAI
            </Link>
          </div>
          <div className="space-x-6">
            <Link href="/features">
              <p className="text-white hover:text-teal-300 transition duration-300">
                Features
              </p>
            </Link>
            <Link href="/about">
              <p className="text-white hover:text-teal-300 transition duration-300">
                About
              </p>
            </Link>
            <Link href="/contact">
              <p className="text-white hover:text-teal-300 transition duration-300">
                Contact
              </p>
            </Link>
            <Link href="/login">
              <p className="text-white hover:text-teal-300 transition duration-300">
                Sign In
              </p>
            </Link>
          </div>
        </div>
      </nav>

      {/* Optional: Testimonial Section (can be added later) */}
      {/* <section className="py-12 bg-gray-100 text-gray-700">
        <h2 className="text-3xl font-semibold text-center mb-6">What Teachers Are Saying</h2>
        <div className="flex space-x-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <p>"This app has saved me so much time! My lessons are now more engaging and interactive."</p>
            <p className="font-semibold mt-2">— Jane Doe, Math Teacher</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <p>"The AI-generated content is spot on. It makes creating presentations and assignments a breeze."</p>
            <p className="font-semibold mt-2">— John Smith, History Teacher</p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
