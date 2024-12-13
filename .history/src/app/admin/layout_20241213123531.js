import Footer from "@/components/Footer";
import Navigation from "@/components/Navbar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
