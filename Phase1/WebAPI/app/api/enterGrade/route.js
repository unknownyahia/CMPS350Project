import createResponse from "../../response.js";
import studentsClasses from "../../data/studentCourses/studentsClasses.js";
import classes from "../../data/classes/classes.js";

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const classId = searchParams.get("classId");
  const Class = await classes.getClassById(classId);
  const studentsClassesData = await studentsClasses.getStudentClassesByClassId(
    classId,
    "registered"
  );
  return createResponse({ data: { ...Class, studentsClassesData } });
}
export async function PATCH(request) {
  const data = await request.json();
  const StudentClass = await studentsClasses.getStudentClassById(
    data.studentClassId
  );
  StudentClass.grade = +data.grade;
  StudentClass.status = 'finalized';
  await studentsClasses.updatedStudentClass(StudentClass);
  return createResponse({ data: "done" });
}
