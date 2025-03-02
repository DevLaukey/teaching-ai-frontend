import Footer from "@/components/Footer";
import Navigation from "@/components/Navbar";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
