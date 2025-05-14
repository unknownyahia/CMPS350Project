import { PrismaClient } from "@prisma/client";

export default class User {
  static async getUserById(id) {
    const prisma = new PrismaClient();
    try {
      const user = await prisma.user.findUnique({
        where: { id: +id },
      });
      await prisma.$disconnect();
      return user;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async getUserByUsernamePassword(username, password) {
    const prisma = new PrismaClient();
    try {
      const user = await prisma.user.findUnique({
        where: { username, password },
      });
      await prisma.$disconnect();
      return user;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async getInstructors() {
    const prisma = new PrismaClient();
    try {
      const instructors = await prisma.user.findMany({
        where: { role: "instructor" },
      });
      await prisma.$disconnect();
      return instructors;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
}
