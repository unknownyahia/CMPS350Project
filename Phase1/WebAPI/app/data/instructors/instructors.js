import fs from "node:fs/promises";
import users from "../users/users.js";
class Instructors {
  constructor() {
    this.directoryJsonData = "app/data/instructors/instructors.json";
  }

  async save(updated) {
    await fs.writeFile(this.directoryJsonData, JSON.stringify(updated));
  }

  async getAll() {
    const jsonData = await fs.readFile(this.directoryJsonData, "utf-8");
    const all = JSON.parse(jsonData);
    return all;
  }

  async getInstructorById(id) {
    const instructors = await this.getAll();
    return instructors.find((instructor) => +instructor.id === +id);
  }
  async getInstructorByUserId(id) {
    const instructors = await this.getAll();
    return instructors.find((instructor) => +instructor.userId === +id);
  }

  async getInstructorData(id) {
    const instructors = await this.getAll();
    const instructor = instructors.find((instructor) => +instructor.id === +id);
    const user = await users.getUserById(instructor.userId);
    return { ...instructor, name: user.name };
  }
  async getInstructorsData() {
    const instructors = await this.getAll();
    for (const instructor of instructors) {
      const user = await users.getUserById(instructor.userId);
      instructor.name = user.name;
    }
    return instructors;
  }

  async updateInstructor(instructor) {
    const instructors = await this.getAll();
    const updatedInstructors = instructors.map((i) =>
      i.id === instructor.id ? instructor : i
    );
    await this.save(updatedInstructors);
  }
}

const instructors = new Instructors();
export default instructors;
