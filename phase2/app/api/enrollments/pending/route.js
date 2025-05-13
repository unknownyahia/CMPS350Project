// app/api/enrollments/pending/route.js
import EnrollmentService from "../../../../dataServices/enrollmentService.js";
import { buildApiResponse } from "../../helpers/apiResponse.js";

export async function PATCH(request) {
  const { studentCourseId: enrollmentId } = await request.json();

  try {
    await EnrollmentService.acceptPending(enrollmentId);
    return buildApiResponse({
      payload: "Enrollment approved successfully",
    });
  } catch (err) {
    return buildApiResponse({
      errorMessage: err.message,
      statusCode: 404,
    });
  }
}

export async function DELETE(request) {
  const { studentCourseId: enrollmentId } = await request.json();

  try {
    await EnrollmentService.deletePending(enrollmentId);
    return buildApiResponse({
      payload: "Pending enrollment removed",
    });
  } catch (err) {
    return buildApiResponse({
      errorMessage: err.message,
      statusCode: 404,
    });
  }
}
