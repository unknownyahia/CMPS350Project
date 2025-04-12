import createResponse from "../../response.js";
import studentsClasses from "../../data/studentCourses/studentsClasses.js";
import courses from "../../data/courses/courses.js";

export async function GET(request) {
  return createResponse({ data: await courses.getAll() });
}
export async function POST(request) {
  const data = await request.json();
  courses.createCourse(data);
  return createResponse({ data: "done" });
}
