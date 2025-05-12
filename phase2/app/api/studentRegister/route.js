import createResponse from "../response.js";
import Class from "../../../repos/classes.js";
export async function POST(request) {
  const data = await request.json();
  try {
    await Class.registerStudentInClass(data.classId, data.userId);
    return createResponse({ data: "Student registered successfully" });
  } catch (error) {
    return createResponse({ error: error.message, status: 404 });
  }
}
