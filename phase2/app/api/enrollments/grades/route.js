// app/api/enrollments/grades/route.js
import EnrollmentService from "../../../../dataServices/enrollmentService.js";
import { buildApiResponse } from "../../helpers/apiResponse.js";

export async function PATCH(request) {
  // Map incoming JSON to clearer names
  const { studentCourseId: enrollmentId, grade: score } = await request.json();

  try {
    // Finalize the grade for that enrollment
    await EnrollmentService.enterGrade(enrollmentId, score);

    return buildApiResponse({
      payload: "Grade entered successfully",
    });
  } catch (err) {
    // If the enrollment wasn’t found or already finalized, return 404
    return buildApiResponse({
      errorMessage: err.message,
      statusCode: 404,
    });
  }
}
