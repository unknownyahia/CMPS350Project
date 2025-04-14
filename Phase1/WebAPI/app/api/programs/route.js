import createResponse from "../../response.js";
import coursesModel from "../../data/courses/courses.js";
// Note: The following import remains if needed in other parts of the code, though it is not used here.
// import studentsClasses from "../../data/studentCourses/studentsClasses.js";

export async function GET(request) {
  const allCourses = await coursesModel.getAll();
  return createResponse({ data: allCourses });
}

export async function POST(request) {
  const payload = await request.json();
  coursesModel.createCourse(payload);
  return createResponse({ data: "done" });
}
