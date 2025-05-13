"use client";
import CountCard from "./CountCard";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const sampleData = [
  {
    name: "Computer Science",
    pending: 12,
    registered: 45,
    finalized: 28,
  },
  {
    name: "Mathematics",
    pending: 9,
    registered: 36,
    finalized: 22,
  },
  {
    name: "Physics",
    pending: 6,
    registered: 28,
    finalized: 15,
  },
  {
    name: "Biology",
    pending: 8,
    registered: 32,
    finalized: 18,
  },
  {
    name: "Chemistry",
    pending: 7,
    registered: 25,
    finalized: 14,
  },
];

export default function DashboardClient(props) {
  return (
    <div className="statistics">
      <CountCard label="Total Students" count={props.countStudents} />
      <CountCard label="Total Instructors" count={props.countInstructors} />
      <CountCard label="Total Courses" count={props.countCourses} />
      <CountCard label="Total Classes" count={props.countClasses} />
      <div className="chart">
        <h2>Course Enrollment Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={props.getCourseEnrollmentStats}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" fill="#FFC107" name="Pending" />
            <Bar dataKey="registered" fill="#3b82f6" name="Registered" />
            <Bar dataKey="finalized" fill="#10B981" name="Finalized" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart">
        <h2>Instructors by Number of Courses Taught</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={props.getTopInstructors}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalCourses" fill="#FFC107" name="totalCourses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart">
        <h2>Courses by Prerequisite Complexity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={props.getTopCoursesByPrerequisites}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="prerequisitesCount"
              fill="#3b82f6"
              name="prerequisitesCount"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <CountCard label="Average Grade" count={props.getAverageGrade + "%"} />
      <CountCard
        label="Registration Rate"
        count={props.getRegistrationRate + "%"}
      />
      <CountCard
        label="Course Completion Rate"
        count={props.getCourseCompletionRate + "%"}
      />
    </div>
  );
}
