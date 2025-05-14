// repos/class.js
import { PrismaClient } from "@prisma/client";

export default class ClassRepository {
  static async getClasses({ searchTerm, instructorId, studentId }) {
    const prisma = new PrismaClient();
    try {
      const classes = await prisma.class.findMany({
        where: {
          ...(searchTerm ? { course: { name: { contains: searchTerm } } } : {}),
          ...(instructorId ? { instructorId: +instructorId } : {}),
        },
        select: {
          id: true,
          maxStudents: true,
          course: {
            select: {
              name: true,
            },
          },
          instructor: {
            select: {
              name: true,
            },
          },
          studentCourses: {
            select: {
              status: true,
              grade: true,
            },
            where: {
              ...(studentId ? { studentId: +studentId } : {}),
            },
          },
        },
      });

      // Process counts at application level
      const formattedClasses = classes.map((cls) => ({
        ...cls,
        numberPending: cls.studentCourses.filter(
          (sc) => sc.status === "pending"
        ).length,
        numberRegistered: cls.studentCourses.filter(
          (sc) => sc.status === "registered"
        ).length,
        numberFinalized: cls.studentCourses.filter(
          (sc) => sc.status === "finalized"
        ).length,
      }));

      await prisma.$disconnect();
      return formattedClasses;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async registerStudentInClass(classId, studentId) {
    const prisma = new PrismaClient();
    try {
      const targetClass = await prisma.class.findUnique({
        where: { id: +classId },
        include: {
          course: {
            include: {
              prerequisites: true,
            },
          },
        },
      });

      if (!targetClass) {
        throw new Error("Class not found");
      }

      const prerequisiteCourseIds = targetClass.course.prerequisites.map(
        (p) => p.prerequisiteId
      );

      // Check if student has passed all prerequisite courses
      for (const courseId of prerequisiteCourseIds) {
        const passedCourse = await prisma.studentCourse.findFirst({
          where: {
            studentId: +studentId,
            class: {
              courseId: +courseId,
            },
            status: "finalized",
            grade: {
              gte: 50,
            },
          },
        });

        if (!passedCourse) {
          throw new Error(
            `Student has not passed prerequisite course ${courseId}`
          );
        }
      }

      // Check current number of registrations in the class
      const currentRegistrations = await prisma.studentCourse.count({
        where: { classId: +classId },
      });

      if (currentRegistrations >= targetClass.maxStudents) {
        throw new Error("Class is full");
      }

      // Check if student is already registered
      const existingRegistration = await prisma.studentCourse.findUnique({
        where: {
          studentId_classId: { studentId: +studentId, classId: +classId },
        },
      });

      if (existingRegistration) {
        throw new Error("Student is already registered in this class");
      }

      // Register the student
      const studentCourse = await prisma.studentCourse.create({
        data: {
          studentId: +studentId,
          classId: +classId,
          status: "pending",
        },
      });

      await prisma.$disconnect();
      return studentCourse;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async addClass(courseId, instructorId, maxStudents) {
    const prisma = new PrismaClient();
    try {
      const Class = await prisma.class.create({
        data: {
          maxStudents: +maxStudents,
          course: { connect: { id: +courseId } },
          instructor: { connect: { id: +instructorId } },
        },
      });

      await prisma.$disconnect();
      return Class;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
}
