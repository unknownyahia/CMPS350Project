import fs from "node:fs/promises";
import courses from "../courses/courses.js";
import studentsClasses from "../studentCourses/studentsClasses.js";
class Classes {
  constructor() {
    this.directoryJsonData = "app/data/classes/classes.json";
  }

  async save(updated) {
    await fs.writeFile(this.directoryJsonData, JSON.stringify(updated));
  }

  async getAll() {
    const jsonData = await fs.readFile(this.directoryJsonData, "utf-8");
    const all = JSON.parse(jsonData);
    for (const Class of all) {
      Class.name = (await courses.getCourseById(Class.courseId)).name;
      Class.numberPending = (
        await studentsClasses.getStudentClassesByClassId(Class.id, "pending")
      ).length;
      Class.numberRegistered = (
        await studentsClasses.getStudentClassesByClassId(Class.id, "registered")
      ).length;
      Class.numberFinalized = (
        await studentsClasses.getStudentClassesByClassId(Class.id, "finalized")
      ).length;
      Class.numbeAllStudents =
        Class.numberPending + Class.numberRegistered + Class.numberFinalized;
    }
    return all;
  }
  async createClass(Class) {
    const classes = await this.getAll();
    const nextId = classes.reduce((max, c) => Math.max(max, +c.id), 0) + 1;
    classes.push({ ...Class, id: nextId });
    await this.save(classes);
  }
  async getClassById(id) {
    const Classes = await this.getAll();
    return Classes.find((Class) => +Class.id === +id);
  }
  async getAllClassesByName(name) {
    const classes = await this.getAll();
    return classes.filter((Class) =>
      Class.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  async getClassesByInstructorId(instructorId) {
    const classes = await this.getAll();
    return classes.filter((Class) => +Class.instructorId === +instructorId);
  }
  async getClassesByInstructorIdAndName(instructorId, name) {
    const classes = await this.getClassesByInstructorId(instructorId);
    return classes.filter((Class) =>
      Class.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async updateClass(updated) {
    const classes = await this.getAll();
    const updatedClasses = classes.map((i) =>
      i.id === updated.id ? updated : i
    );
    await this.save(updatedClasses);
  }
}

const classes = new Classes();
export default classes;
