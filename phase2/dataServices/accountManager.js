import { PrismaClient } from "@prisma/client";

// Initialize a single Prisma client for reuse
const prisma = new PrismaClient();

export default class AccountManager {
  /**
   * Fetch a user by their numeric ID
   */
  static async retrieveById(id) {
    try {
      const userId = Number(id);
      return await prisma.user.findUnique({
        where: { id: userId }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Fetch a user matching given credentials
   */
  static async retrieveByCredentials(username, password) {
    try {
      return await prisma.user.findUnique({
        where: { username, password }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * List all users with the 'instructor' role
   */
  static async listInstructors() {
    try {
      return await prisma.user.findMany({
        where: { role: "instructor" }
      });
    } catch (err) {
      throw err;
    }
  }
}
