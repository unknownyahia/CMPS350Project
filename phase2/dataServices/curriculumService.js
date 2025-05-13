// dataServices/curriculumService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class CurriculumService {
  /**  
   * Create a new course with its prerequisite links  
   * @param {string} title        – The course name  
   * @param {Array<string>} preReqIds – Array of prerequisite course IDs  
   * @returns {Promise<object>}   – The created course record  
   */
  static async createCourse(title, preReqIds) {
    const course = await prisma.course.create({
      data: {
        name: title,
        prerequisites: {
          create: preReqIds.map((id) => ({
            prerequisite: { connect: { id: Number(id) } },
          })),
        },
      },
    });
    return course;
  }

  /**  
   * Fetch all courses in the catalog  
   * @returns {Promise<Array<object>>} – List of course records  
   */
  static async fetchAllCourses() {
    const all = await prisma.course.findMany();
    return all;
  }
}
