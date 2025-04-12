
import createResponse from "../../response.js";
import students from "../../data/students/students.js";
import studentsClasses from "../../data/studentCourses/studentsClasses.js";
import classes from "../../data/classes/classes.js";
import courses from "../../data/courses/courses.js";
export async function POST(request) {
  const data = await request.json();
  const student = await students.getStudentByUserId(data.userId);
  const classesData = await studentsClasses.getAllClassesByStudentId(
    student.id
  );

  const newRegisterClass = await classes.getClassById(data.classId);

  if (newRegisterClass.maxStudents <= newRegisterClass.numbeAllStudents) {
    return createResponse({
      error: "Class is full",
      status: 401,
    });
  }

  const newRegisterCours = await courses.getCourseById(
    newRegisterClass.courseId
  );
  const studentCoursesFinalizedIDs = classesData
    .filter((classData) => classData.studentClasse?.status === "finalized")
    .map((classData) => classData.courseId);
  console.log(newRegisterCours, studentCoursesFinalizedIDs);
  for (const prerequisiteID of newRegisterCours.prerequisites) {
    if (!studentCoursesFinalizedIDs.includes(prerequisiteID)) {
      return createResponse({
        error: "Prerequisite not completed",
        status: 401,
      });
    }
  }
  studentsClasses.createStudentClass({
    classId: data.classId,
    studentId: student.id,
    status: "pending",
    grade: null,
  });
  return createResponse({ data: "done" });
}
