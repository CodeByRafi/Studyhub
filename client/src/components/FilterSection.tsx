"use client";

import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDept: string;
  setSelectedDept: (val: string) => void;
  selectedCourse: string;
  setSelectedCourse: (val: string) => void;
  departments: any[];
  courses: any[];
  onReset: () => void;
}

export default function FilterSection({
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  selectedCourse,
  setSelectedCourse,
  departments,
  courses,
  onReset
}: FilterSectionProps) {
  return (
    <Card className="p-8 mb-12 shadow-inner">
      <div className="flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Search Database</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 pl-12 text-white placeholder:text-zinc-700 focus:outline-none focus:border-sky-500 transition-all font-medium"
            />
            <svg className="w-5 h-5 text-zinc-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Department</label>
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-sky-500 transition-all font-medium appearance-none"
            >
              <option value="">All Departments</option>
              {departments.map((dept: any) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Academic Course</label>
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-sky-500 transition-all font-medium appearance-none disabled:opacity-50"
              disabled={!selectedDept}
            >
              <option value="">All Courses</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
}
