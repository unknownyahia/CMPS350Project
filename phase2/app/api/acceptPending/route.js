import createResponse from "../response.js";
import studentCourse from "../../../repos/studentCourse.js";
export async function PATCH(request) {
  const data = await request.json();
  try {
    await studentCourse.acceptPending(data.studentCourseId);
    return createResponse({ data: "Grade entered successfully" });
  } catch (error) {
    return createResponse({ error: error.message, status: 404 });
  }
}

export async function DELETE(request) {
  const data = await request.json();
  try {
    await studentCourse.deletePending(data.studentCourseId);
    return createResponse({ data: "Grade entered successfully" });
  } catch (error) {
    return createResponse({ error: error.message, status: 404 });
  }
}
