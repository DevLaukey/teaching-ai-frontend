import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  GraduationCap,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">EduAI</span>
            </div>
            <p className="text-sm">
              Empowering educators with AI-powered tools to create engaging and
              effective learning experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Release Notes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Templates
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Tutorials
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for the latest updates and resources.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm">
              © {new Date().getFullYear()} EduAI. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap space-x-8 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
