// app/api/classes/route.js
import ClassService from "../../../dataServices/classService.js";
import { buildApiResponse } from "../helpers/apiResponse.js";

export async function POST(request) {
  const {
    courseId,
    instructorId,
    maxStudents: capacity,
  } = await request.json();

  try {
    await ClassService.createSession(courseId, instructorId, capacity);
    return buildApiResponse({
      payload: "Class created successfully",
    });
  } catch (err) {
    return buildApiResponse({
      errorMessage: err.message,
      statusCode: 400,
    });
  }
}
