import { PrismaClient, Role, CourseStatus } from "@prisma/client";

const prisma = new PrismaClient();

export default class Statistics {
  static async countStudents() {
    return prisma.user.count({ where: { role: Role.student } });
  }

  static async countInstructors() {
    return prisma.user.count({ where: { role: Role.instructor } });
  }

  static async countCourses() {
    return prisma.course.count();
  }

  static async countClasses() {
    return prisma.class.count();
  }

  static async getCourseEnrollmentStats(limit = 10) {
    const courses = await prisma.course.findMany({
      include: {
        classes: {
          include: {
            studentCourses: true,
          },
        },
      },
    });

    const stats = courses.map((course) => {
      let pending = 0;
      let registered = 0;
      let finalized = 0;

      course.classes.forEach((cls) => {
        cls.studentCourses.forEach((sc) => {
          if (sc.status === "pending") pending++;
          else if (sc.status === "registered") registered++;
          else if (sc.status === "finalized") finalized++;
        });
      });

      return {
        name: course.name,
        pending,
        registered,
        finalized,
      };
    });

    return stats.slice(0, limit);
  }

  static async getTopInstructors(limit = 10) {
    const instructors = await prisma.user.findMany({
      where: { role: "instructor" },
      include: {
        classes: true,
      },
    });

    const result = instructors
      .map((instructor) => ({
        name: instructor.name,
        totalCourses: instructor.classes.length,
      }))
      .sort((a, b) => b.totalCourses - a.totalCourses)
      .slice(0, limit);

    return result;
  }

  static async getTopCoursesByPrerequisites(limit = 10) {
    const courses = await prisma.course.findMany({
      include: {
        prerequisites: true,
      },
    });

    const result = courses
      .map((course) => ({
        name: course.name,
        prerequisitesCount: course.prerequisites.length,
      }))
      .sort((a, b) => b.prerequisitesCount - a.prerequisitesCount)
      .slice(0, limit);

    return result;
  }

  static async getAverageGrade() {
    const grades = await prisma.studentCourse.findMany({
      where: {
        grade: {
          not: null,
        },
      },
      select: {
        grade: true,
      },
    });

    const sum = grades.reduce((acc, item) => acc + item.grade, 0);
    const avg = grades.length ? sum / grades.length : 0;

    return Math.round(avg * 100) / 100;
  }

  static async getRegistrationRate() {
    const totalStudents = await prisma.user.count({
      where: {
        role: "student",
      },
    });

    const registeredStudents = await prisma.studentCourse.groupBy({
      by: ["studentId"],
    });

    return totalStudents
      ? Math.round((registeredStudents.length / totalStudents) * 10000) / 100
      : 0;
  }

  static async getCourseCompletionRate() {
    const total = await prisma.studentCourse.count();
    const completed = await prisma.studentCourse.count({
      where: {
        status: "finalized",
      },
    });

    return total ? Math.round((completed / total) * 10000) / 100 : 0;
  }

  static async countFinalizedWithGrades() {
    return prisma.studentCourse.count({
      where: {
        status: CourseStatus.finalized,
        grade: { not: null },
      },
    });
  }
}
