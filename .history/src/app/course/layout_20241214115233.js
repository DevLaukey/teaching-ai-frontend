"use client";

import CourseNavigation from "@/components/CourseNavigation";

export default function CourseLayout({ children, params }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 p-4 border-r">
        <CourseNavigation courseId={params.id} />
      </div>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
