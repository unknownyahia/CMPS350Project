import createResponse from "../response.js";
import Courses from "../../../repos/courses.js";
export async function POST(request) {
  const data = await request.json();
  try {
    await Courses.addCourse(data.name, data.prerequisites);
    return createResponse({ data: "Course added successfully" });
  } catch (error) {
    return createResponse({ error: error.message, status: 404 });
  }
}
