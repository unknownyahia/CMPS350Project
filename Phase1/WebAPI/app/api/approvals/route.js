import createResponse from "../../response.js";
import studentsClassesModel from "../../data/studentCourses/studentsClasses.js";
import classModel from "../../data/classes/classes.js";

// Retrieve class details along with pending registrations
export async function GET(request) {
  // Get query parameters from the URL
  const { searchParams } = request.nextUrl;
  const classIdParam = searchParams.get("classId");

  // Fetch class information using the provided classId
  const classDetails = await classModel.getClassById(classIdParam);
  // Retrieve student registration data for the class where the status is "pending"
  const pendingStudents = await studentsClassesModel.getStudentClassesByClassId(classIdParam, "pending");

  // Merge the class details with the pending student data into the response
  return createResponse({ data: { ...classDetails, studentsClassesData: pendingStudents } });
}

// Update a student's registration status
export async function PATCH(request) {
  // Parse the JSON payload from the request
  const payload = await request.json();
  
  // Retrieve the specific student registration record by its identifier
  const studentRecord = await studentsClassesModel.getStudentClassById(payload.studentClassId);
  
  // Change the status to "registered" and update the record
  studentRecord.status = "registered";
  await studentsClassesModel.updatedStudentClass(studentRecord);
  
  return createResponse({ data: "done" });
}

// Delete a student's registration record
export async function DELETE(request) {
  // Parse the JSON payload containing the record to remove
  const payload = await request.json();
  
  // Remove the student registration entry
  await studentsClassesModel.deleteStudentClass(payload.studentClassId);
  
  return createResponse({ data: "done" });
}
