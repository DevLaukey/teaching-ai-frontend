import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CourseNavigation = ({ courseId }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: `/course/${courseId}`,
    },
    {
      name: "Analytics",
      href: `/course/${courseId}/analytics`,
    },
    {
      name: "Collaboration",
      href: `/course/${courseId}/collaboration`,
    },
    {
      name: "Content Preview",
      href: `/course/${courseId}/content-preview`,
    },
    {
      name: "Creation",
      href: `/course/${courseId}/creation`,
    },
    {
      name: "Finalization",
      href: `/course/${courseId}/finalization`,
    },
  ];

  return (
    <nav className="flex flex-col space-y-1 p-4 bg-gray-100 rounded-lg">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-4 py-2 text-sm rounded-md transition-colors",
            pathname === item.href
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-200"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default CourseNavigation;
