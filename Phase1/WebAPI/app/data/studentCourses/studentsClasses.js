import fs from "node:fs/promises";
import classes from "../classes/classes.js";
import students from "../students/students.js";
class StudentsClasses {
  constructor() {
    this.directoryJsonData = "app/data/studentCourses/studentsClasses.json";
  }

  async save(updated) {
    await fs.writeFile(this.directoryJsonData, JSON.stringify(updated));
  }

  async getAll() {
    const jsonData = await fs.readFile(this.directoryJsonData, "utf-8");
    const all = JSON.parse(jsonData);
    return all;
  }
  async createStudentClass(studentClass) {
    const studentClasses = await this.getAll();
    const nextId =
      studentClasses.reduce(
        (max, studentClass) => Math.max(max, +studentClass.id),
        0
      ) + 1;
    studentClasses.push({ ...studentClass, id: nextId });
    await this.save(studentClasses);
  }
  async getStudentClassById(id) {
    const studentsClasses = await this.getAll();
    return studentsClasses.find((studentClass) => +studentClass.id === +id);
  }
  async getStudentClassesByClassId(classId, status = "All") {
    const studentClasses = (await this.getAll()).filter(
      (studentClass) =>
        +studentClass.classId === +classId &&
        (studentClass.status === status || status === "All")
    );
    for (const studentClass of studentClasses) {
      studentClass.student_name = (
        await students.getstudentData(studentClass.studentId)
      ).name;
    }
    return studentClasses;
  }
  async getStudentClassesByStudentId(studentId) {
    const studentClasses = await this.getAll();
    return studentClasses.filter(
      (studentClass) => +studentClass.studentId === +studentId
    );
  }
  async getAllClassesByStudentId(studentId) {
    const classesData = await classes.getAll();
    const studentClasses = await this.getStudentClassesByStudentId(studentId);
    return classesData.map((Class) => ({
      ...Class,
      studentClasse: studentClasses.find(
        (studentClass) => +studentClass.classId === +Class.id
      ),
    }));
  }
  async getAllClassesByStudentIdAndName(studentId, name) {
    const allClassesByStudentId = await this.getAllClassesByStudentId(
      studentId
    );
    return allClassesByStudentId.filter((Class) =>
      Class.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async updatedStudentClass(updated) {
    const studentClasses = await this.getAll();
    const updatedStudentClasses = studentClasses.map((i) =>
      +i.id === +updated.id ? updated : i
    );
    await this.save(updatedStudentClasses);
  }

  async deleteStudentClass(id) {
    const studentClasses = await this.getAll();
    const updatedStudentClasses = studentClasses.filter(
      (studentClass) => +studentClass.id !== +id
    );
    await this.save(updatedStudentClasses);
  }
}

const studentsClasses = new StudentsClasses();
export default studentsClasses;
