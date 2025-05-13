import { PrismaClient } from "@prisma/client";

// Reuse a single Prisma client instance
const prisma = new PrismaClient();

export default class ClassService {
  /**
   * Create a new class session with a capacity limit
   */
  static async createSession(courseId, instructorId, capacity) {
    try {
      const created = await prisma.class.create({
        data: {
          maxStudents: Number(capacity),
          course: { connect: { id: Number(courseId) } },
          instructor: { connect: { id: Number(instructorId) } },
        },
      });
      return created;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Enroll a student after validating prerequisites and capacity
   */
  static async enrollStudent(classId, studentId) {
    try {
      const session = await prisma.class.findUnique({
        where: { id: Number(classId) },
        include: { course: { include: { prerequisites: true } } },
      });

      if (!session) throw new Error("Class not found");

      const prereqs = session.course.prerequisites.map(p => p.prerequisiteId);
      for (const cid of prereqs) {
        const passed = await prisma.studentCourse.findFirst({
          where: {
            studentId: Number(studentId),
            class: { courseId: Number(cid) },
            status: "finalized",
            grade: { gte: 50 },
          },
        });
        if (!passed) {
          throw new Error(`Missing prerequisite course ${cid}`);
        }
      }

      const count = await prisma.studentCourse.count({ where: { classId: Number(classId) } });
      if (count >= session.maxStudents) throw new Error("Class capacity reached");

      const existing = await prisma.studentCourse.findUnique({
        where: { studentId_classId: { studentId: Number(studentId), classId: Number(classId) } },
      });
      if (existing) throw new Error("Already enrolled");

      const registration = await prisma.studentCourse.create({
        data: { studentId: Number(studentId), classId: Number(classId), status: "pending" },
      });
      return registration;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieve class sessions with optional filters and counts
   */
  static async fetchSessions({ search, instructorId, studentId }) {
    try {
      const where = {
        ...(search ? { course: { name: { contains: search } } } : {}),
        ...(instructorId ? { instructorId: Number(instructorId) } : {}),
      };

      const sessions = await prisma.class.findMany({
        where,
        select: {
          id: true,
          maxStudents: true,
          course: { select: { name: true } },
          instructor: { select: { name: true } },
          studentCourses: {
            where: studentId ? { studentId: Number(studentId) } : {},
            select: { status: true, grade: true },
          },
        },
      });

      return sessions.map(s => ({
        ...s,
        pendingCount: s.studentCourses.filter(sc => sc.status === "pending").length,
        registeredCount: s.studentCourses.filter(sc => sc.status === "registered").length,
        finalizedCount: s.studentCourses.filter(sc => sc.status === "finalized").length,
      }));
    } catch (error) {
      throw error;
    }
  }
}
