import usersDb from "../../data/users/users.js";
import createResponse from "../../response.js";
import studentModel from "../../data/students/students.js";
import studentCourses from "../../data/studentCourses/studentsClasses.js";
import instructorModel from "../../data/instructors/instructors.js";
import classModel from "../../data/classes/classes.js";
import adminModel from "../../data/administrators/administrators.js";

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const userIdParam = searchParams.get("userId");
  const searchTerm = searchParams.get("search");
  
  // Retrieve user details using the provided userId
  const currentUser = await usersDb.getUserById(userIdParam);
  
  if (currentUser.role === "student") {
    // Get student info linked to the user id
    const studentInfo = await studentModel.getStudentByUserId(userIdParam);
    // Retrieve the classes for the student, applying a search filter if provided
    const studentClassesData = searchTerm
      ? await studentCourses.getAllClassesByStudentIdAndName(studentInfo.id, searchTerm)
      : await studentCourses.getAllClassesByStudentId(studentInfo.id);
    return createResponse({ data: studentClassesData });
    
  } else if (currentUser.role === "instructor") {
    // Fetch instructor info by their user id
    const instructorInfo = await instructorModel.getInstructorByUserId(currentUser.id);
    // Retrieve classes associated with the instructor, with optional search filtering
    const instructorClasses = searchTerm
      ? await classModel.getClassesByInstructorIdAndName(instructorInfo.id, searchTerm)
      : await classModel.getClassesByInstructorId(instructorInfo.id);
    return createResponse({ data: instructorClasses });
    
  } else if (currentUser.role === "administrator") {
    // For administrators, fetch all classes or filter by name if a search term exists
    const classesData = searchTerm
      ? await classModel.getAllClassesByName(searchTerm)
      : await classModel.getAll();
    return createResponse({ data: classesData });
  }
  
  return createResponse({ error: "Invalid username or password", status: 401 });
}
