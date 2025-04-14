import createResponse from "../../response.js";
import studentModel from "../../data/students/students.js";
import studentCoursesModel from "../../data/studentCourses/studentsClasses.js";
import classesModel from "../../data/classes/classes.js";
import coursesModel from "../../data/courses/courses.js";

export async function POST(request) {
  // Parse the incoming JSON payload
  const payload = await request.json();
  
  // Retrieve the student record based on the user ID provided
  const studentRecord = await studentModel.getStudentByUserId(payload.userId);
  
  // Get all classes that the student is currently associated with
  const registeredClasses = await studentCoursesModel.getAllClassesByStudentId(studentRecord.id);
  
  // Fetch the class information for the class the student wants to register in
  const selectedClass = await classesModel.getClassById(payload.classId);
  
  // Check for available seats by comparing the maximum capacity with the current count
  if (selectedClass.maxStudents <= selectedClass.numbeAllStudents) {
    return createResponse({
      error: "Class is full",
      status: 401,
    });
  }
  
  // Retrieve course details for the selected class
  const courseInfo = await coursesModel.getCourseById(selectedClass.courseId);
  
  // Build an array of course IDs for which the student's registration is finalized
  const finalizedCourseIds = registeredClasses
    .filter((registration) => registration.studentClasse?.status === "finalized")
    .map((registration) => registration.courseId);
  
  console.log(courseInfo, finalizedCourseIds);
  
  // Verify that the student has completed all prerequisites for the course
  for (const prerequisiteId of courseInfo.prerequisites) {
    if (!finalizedCourseIds.includes(prerequisiteId)) {
      return createResponse({
        error: "Prerequisite not completed",
        status: 401,
      });
    }
  }
  
  // Create a new registration entry for the student with a pending status and no grade yet
  studentCoursesModel.createStudentClass({
    classId: payload.classId,
    studentId: studentRecord.id,
    status: "pending",
    grade: null,
  });
  
  // Return a success response
  return createResponse({ data: "done" });
}
