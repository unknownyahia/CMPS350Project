"use client";

import React from "react";
import StatCard from "./StatCard.jsx";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

/**
 * Renders cards and bar-charts for admin metrics.
 */
export default function StatsOverview({
  countStudents,
  countInstructors,
  countCourses,
  countClasses,
  enrollmentStats,
  topInstructors,
  topPrereqCourses,
  avgGrade,
  registrationRate,
  completionRate,
}) {
  return (
    <div className="statistics-dashboard">
      <div className="stats-grid">
        <StatCard label="Students" value={countStudents} />
        <StatCard label="Instructors" value={countInstructors} />
        <StatCard label="Courses" value={countCourses} />
        <StatCard label="Classes" value={countClasses} />
        <StatCard label="Avg Grade" value={`${avgGrade}%`} />
        <StatCard label="Reg. Rate" value={`${registrationRate}%`} />
        <StatCard label="Comp. Rate" value={`${completionRate}%`} />
      </div>

      <div className="chart-section">
        <h3>Enrollment Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={enrollmentStats} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" name="Pending" />
            <Bar dataKey="registered" name="Registered" />
            <Bar dataKey="finalized" name="Finalized" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Top Instructors</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topInstructors} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalCourses" name="Courses Taught" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Course Prerequisites</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topPrereqCourses} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="prerequisitesCount" name="Prerequisites" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
