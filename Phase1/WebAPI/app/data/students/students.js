import fs from "node:fs/promises";
import users from "../users/users.js";
class Students {
  constructor() {
    this.directoryJsonData = "app/data/students/students.json";
  }

  async save(updated) {
    await fs.writeFile(this.directoryJsonData, JSON.stringify(updated));
  }

  async getAll() {
    const jsonData = await fs.readFile(this.directoryJsonData, "utf-8");
    const all = JSON.parse(jsonData);
    return all;
  }

  async getStudentById(id) {
    const students = await this.getAll();
    return students.find((student) => +student.id === +id);
  }
  async getStudentByUserId(userId) {
    const students = await this.getAll();
    return students.find((student) => +student.userId === +userId);
  }

  async getstudentData(id) {
    const student = await this.getStudentById(id);
    const user = await users.getUserById(student.userId);
    return { ...student, name: user.name };
  }

  async updateStudent(student) {
    const students = await this.getAll();
    const updatedStudents = students.map((s) =>
      s.id === student.id ? student : s
    );
    await this.save(updatedStudents);
  }
}

const students = new Students();
export default students;
