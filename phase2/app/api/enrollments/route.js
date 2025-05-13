// app/api/enrollments/route.js
import ClassService from "../../../dataServices/classService.js";
import { buildApiResponse } from "../helpers/apiResponse.js";

export async function POST(request) {
  // Map incoming JSON to clearer names
  const { classId: sessionId, userId: learnerId } = await request.json();

  try {
    // Enroll the student in the specified class session
    await ClassService.enrollStudent(sessionId, learnerId);

    return buildApiResponse({
      payload: "Student enrolled successfully",
    });
  } catch (err) {
    // If something goes wrong (e.g. class not found), return a 404
    return buildApiResponse({
      errorMessage: err.message,
      statusCode: 404,
    });
  }
}
