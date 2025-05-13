import React from "react";
import SectionHeader from "../../common/SectionHeader.jsx";
import { LogoutButton } from "../../common/UserSession.js";
import StatsOverview from "./StatsOverview.jsx";
import AnalyticsService from "../../../../dataServices/analyticsService.js";

export default async function StatsPage() {
  const [
    enrollmentStats,
    countStudents,
    countInstructors,
    countCourses,
    countClasses,
    topInstructors,
    topPrereqCourses,
    avgGrade,
    registrationRate,
    completionRate,
  ] = await Promise.all([
    AnalyticsService.getEnrollmentStats(50),
    AnalyticsService.getStudentCount(),
    AnalyticsService.getInstructorCount(),
    AnalyticsService.getCourseCount(),
    AnalyticsService.getClassCount(),
    AnalyticsService.getTopInstructors(),
    AnalyticsService.getTopPrerequisiteCourses(),
    AnalyticsService.getAverageGrade(),
    AnalyticsService.getRegistrationRate(),
    AnalyticsService.getCourseCompletionRate(),
  ]);

  return (
    <>
      <SectionHeader text="Admin Dashboard" />

      <nav className="navbar">
        <div className="navbar-buttons">
          <LogoutButton />
        </div>
      </nav>

      <StatsOverview
        enrollmentStats={enrollmentStats}
        countStudents={countStudents}
        countInstructors={countInstructors}
        countCourses={countCourses}
        countClasses={countClasses}
        topInstructors={topInstructors}
        topPrereqCourses={topPrereqCourses}
        avgGrade={avgGrade}
        registrationRate={registrationRate}
        completionRate={completionRate}
      />
    </>
  );
}
