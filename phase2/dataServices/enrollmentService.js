// dataServices/enrollmentService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class EnrollmentService {
  /**
   * Approve a pending enrollment by its ID
   * @param   {number|string} enrollmentId
   * @returns {Promise<void>}
   */
  static async acceptPending(enrollmentId) {
    const record = await prisma.studentCourse.findFirst({
      where: { id: Number(enrollmentId), status: "pending" },
    });
    if (!record) throw new Error("No pending enrollment found for that ID.");
    await prisma.studentCourse.update({
      where: { id: record.id },
      data: { status: "registered" },
    });
  }

  /**
   * Remove a pending enrollment by its ID
   * @param   {number|string} enrollmentId
   * @returns {Promise<void>}
   */
  static async deletePending(enrollmentId) {
    const deleted = await prisma.studentCourse.delete({
      where: { id: Number(enrollmentId), status: "pending" },
    });
    if (!deleted) throw new Error("Failed to delete: pending enrollment not found.");
  }

  /**
   * Finalize a grade on a registered enrollment
   * @param   {number|string} enrollmentId
   * @param   {number|string} score
   * @returns {Promise<void>}
   */
  static async enterGrade(enrollmentId, score) {
    const record = await prisma.studentCourse.findFirst({
      where: { id: Number(enrollmentId), status: "registered" },
    });
    if (!record) throw new Error("Cannot grade: enrollment not in registered status.");
    await prisma.studentCourse.update({
      where: { id: record.id },
      data: { status: "finalized", grade: Number(score) },
    });
  }

  /**
   * List all enrollments for a class with given status
   * @param   {number|string} classId
   * @param   {string}        status    – e.g. "pending", "registered", "finalized"
   * @returns {Promise<Array<object>>}
   */
  static async getStudentCourses(classId, status) {
    return prisma.studentCourse.findMany({
      where: { classId: Number(classId), status },
      include: {
        class:    { include: { course: true } },
        student:  true
      },
    });
  }
}
