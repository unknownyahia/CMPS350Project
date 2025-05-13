import createResponse from "../response.js";
import studentCourse from "../../../repos/studentCourse.js";
export async function PATCH(request) {
  const data = await request.json();
  try {
    await studentCourse.enterGrade(data.studentCourseId, data.grade);
    return createResponse({ data: "Grade entered successfully" });
  } catch (error) {
    return createResponse({ error: error.message, status: 404 });
  }
}
