import { PrismaClient } from "@prisma/client";
export default class StudentCourse {
  static async getStudentCourses(classId, status) {
    const prisma = new PrismaClient();
    try {
      const studentCourses = await prisma.studentCourse.findMany({
        where: { classId: +classId, status },
        include: { class: { include: { course: true } }, student: true },
      });
      await prisma.$disconnect();
      return studentCourses;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async enterGrade(studentCourseId, grade) {
    const prisma = new PrismaClient();
    try {
      const studentCourse = await prisma.studentCourse.findFirst({
        where: { id: +studentCourseId, status: "registered" },
      });
      if (!studentCourse) {
        throw new Error("Student not found in the class.");
      }
      await prisma.studentCourse.update({
        where: { id: studentCourse.id },
        data: { status: "finalized", grade: +grade },
      });
      await prisma.$disconnect();
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async acceptPending(studentCourseId) {
    const prisma = new PrismaClient();
    try {
      const studentCourse = await prisma.studentCourse.findFirst({
        where: { id: +studentCourseId, status: "pending" },
      });
      if (!studentCourse) {
        throw new Error("Student not found in the class.");
      }
      await prisma.studentCourse.update({
        where: { id: studentCourse.id },
        data: { status: "registered" },
      });
      await prisma.$disconnect();
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async deletePending(studentCourseId) {
    const prisma = new PrismaClient();
    try {
      const studentCourse = await prisma.studentCourse.delete({
        where: { id: +studentCourseId, status: "pending" },
      });
      if (!studentCourse) {
        throw new Error("Student not found in the class.");
      }
      await prisma.$disconnect();
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
}
