import fs from "node:fs/promises";
import users from "../users/users.js";
class Courses {
  constructor() {
    this.directoryJsonData = "app/data/courses/courses.json";
  }

  async save(updated) {
    await fs.writeFile(this.directoryJsonData, JSON.stringify(updated));
  }

  async getAll() {
    const jsonData = await fs.readFile(this.directoryJsonData, "utf-8");
    const all = JSON.parse(jsonData);
    return all;
  }
  async createCourse(course) {
    const coursees = await this.getAll();
    const nextId = coursees.reduce((max, c) => Math.max(max, +c.id), 0) + 1;
    coursees.push({ ...course, id: nextId });
    await this.save(coursees);
  }
  async getCourseById(id) {
    const courses = await this.getAll();
    return courses.find((course) => +course.id === +id);
  }
  async getCourseByName(name) {
    const courses = await this.getAll();
    return courses.filter((course) => course.name.includes(name));
  }
  async updateCourse(updated) {
    const courses = await this.getAll();
    const updatedCourses = courses.map((i) =>
      +i.id === +updated.id ? updated : i
    );
    await this.save(updatedCourses);
  }
}

const courses = new Courses();
export default courses;
