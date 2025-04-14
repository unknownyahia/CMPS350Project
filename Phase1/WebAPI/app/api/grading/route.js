import createResponse from "../../response.js";
import studentClassesModel from "../../data/studentCourses/studentsClasses.js";
import classModel from "../../data/classes/classes.js";

export async function GET(request) {
  // Extract the query parameters from the URL
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("classId");

  // Retrieve the class details based on the provided id
  const classInfo = await classModel.getClassById(id);
  // Fetch the students registered in this class
  const registeredStudents = await studentClassesModel.getStudentClassesByClassId(id, "registered");

  // Merge and return the class information along with registration details
  return createResponse({ data: { ...classInfo, studentsClassesData: registeredStudents } });
}

export async function PATCH(request) {
  // Parse the request payload containing updates
  const payload = await request.json();

  // Retrieve a specific student-class record by its id
  const studentRecord = await studentClassesModel.getStudentClassById(payload.studentClassId);

  // Update the student's grade and status
  studentRecord.grade = Number(payload.grade);
  studentRecord.status = 'finalized';

  // Save the updated record
  await studentClassesModel.updatedStudentClass(studentRecord);

  // Return success confirmation
  return createResponse({ data: "done" });
}
