import { PrismaClient } from "@prisma/client";
export default class Courses {
  static async getCourses() {
    const prisma = new PrismaClient();
    try {
      const courses = await prisma.course.findMany();
      await prisma.$disconnect();
      return courses;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async addCourse(name, prerequisites) {
    const prisma = new PrismaClient();
    try {
      const course = await prisma.course.create({
        data: {
          name,
          prerequisites: {
            create: prerequisites.map((prerequisiteId) => ({
              prerequisite: {
                connect: { id: +prerequisiteId },
              },
            })),
          },
        },
      });

      await prisma.$disconnect();
      return course;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
}
