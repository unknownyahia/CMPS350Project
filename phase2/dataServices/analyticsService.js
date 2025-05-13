// dataServices/analyticsService.js
import { PrismaClient, Role, CourseStatus } from "@prisma/client";

const prisma = new PrismaClient();

export default class AnalyticsService {
  /** Calculate the average grade across all graded enrollments */
  static async getAverageGrade() {
    const records = await prisma.studentCourse.findMany({
      where: { grade: { not: null } },
      select: { grade: true },
    });
    const total = records.reduce((sum, { grade }) => sum + grade, 0);
    const avg = records.length ? total / records.length : 0;
    return Math.round(avg * 100) / 100;
  }

  /** Total number of class sessions */
  static async getClassCount() {
    return prisma.class.count();
  }

  /** Percentage of enrollments that have been finalized */
  static async getCourseCompletionRate() {
    const totalEnroll = await prisma.studentCourse.count();
    const finished = await prisma.studentCourse.count({
      where: { status: CourseStatus.finalized },
    });
    return totalEnroll
      ? Math.round((finished / totalEnroll) * 10000) / 100
      : 0;
  }

  /** Total number of courses available */
  static async getCourseCount() {
    return prisma.course.count();
  }

  /** Enrollment breakdown (pending/registered/finalized) per course */
  static async getEnrollmentStats(limit = 10) {
    const courses = await prisma.course.findMany({
      include: { classes: { include: { studentCourses: true } } },
    });

    const stats = courses.map(({ name, classes }) => {
      let pending = 0, registered = 0, finalized = 0;
      classes.forEach((cls) =>
        cls.studentCourses.forEach((enroll) => {
          if (enroll.status === "pending") pending++;
          else if (enroll.status === "registered") registered++;
          else if (enroll.status === "finalized") finalized++;
        })
      );
      return { name, pending, registered, finalized };
    });

    return stats.slice(0, limit);
  }

  /** Number of finalized enrollments that also have grades */
  static async getGradedFinalizationsCount() {
    return prisma.studentCourse.count({
      where: {
        status: CourseStatus.finalized,
        grade: { not: null },
      },
    });
  }

  /** Total number of instructors in the system */
  static async getInstructorCount() {
    return prisma.user.count({ where: { role: Role.instructor } });
  }

  /** Percentage of students who have at least one enrollment */
  static async getRegistrationRate() {
    const totalStudents = await prisma.user.count({
      where: { role: Role.student },
    });
    const registered = await prisma.studentCourse.groupBy({
      by: ["studentId"],
    });
    return totalStudents
      ? Math.round((registered.length / totalStudents) * 10000) / 100
      : 0;
  }

  /** Total number of students registered */
  static async getStudentCount() {
    return prisma.user.count({ where: { role: Role.student } });
  }

  /** Top instructors by number of classes they teach */
  static async getTopInstructors(limit = 10) {
    const faculty = await prisma.user.findMany({
      where: { role: Role.instructor },
      include: { classes: true },
    });

    return faculty
      .map(({ name, classes }) => ({ name, totalCourses: classes.length }))
      .sort((a, b) => b.totalCourses - a.totalCourses)
      .slice(0, limit);
  }

  /** Top courses based on how many prerequisites they have */
  static async getTopPrerequisiteCourses(limit = 10) {
    const list = await prisma.course.findMany({
      include: { prerequisites: true },
    });

    return list
      .map(({ name, prerequisites }) => ({
        name,
        prerequisitesCount: prerequisites.length,
      }))
      .sort((a, b) => b.prerequisitesCount - a.prerequisitesCount)
      .slice(0, limit);
  }
}
