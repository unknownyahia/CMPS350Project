import createResponse from "../response.js";
import ClassRepository from "../../../repos/classes.js";
export async function POST(request) {
  const data = await request.json();
  try {
    await ClassRepository.addClass(
      data.courseId,
      data.instructorId,
      data.maxStudents
    );
    return createResponse({ data: "Course added successfully" });
  } catch (error) {
    return createResponse({ error: error.message, status: 404 });
  }
}
