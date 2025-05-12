// app/(your-app-folder)/stats/page.jsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Statistics from "@/repos/statistics";
import DashboardClient from "./DashboardClient";

export default async function StatsPage() {
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }
  const statsData = {
    getCourseEnrollmentStats: await Statistics.getCourseEnrollmentStats(),
    countStudents: await Statistics.countStudents(),
    countInstructors: await Statistics.countInstructors(),
    countCourses: await Statistics.countCourses(),
    countClasses: await Statistics.countClasses(),
    getTopInstructors: await Statistics.getTopInstructors(),
    getTopCoursesByPrerequisites:
      await Statistics.getTopCoursesByPrerequisites(),
    getAverageGrade: await Statistics.getAverageGrade(),
    getRegistrationRate: await Statistics.getRegistrationRate(),
    getCourseCompletionRate: await Statistics.getCourseCompletionRate(),
  };

  return <DashboardClient {...statsData} />;
}
