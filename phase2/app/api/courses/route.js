// app/api/courses/route.js
import CurriculumService from "../../../dataServices/curriculumService.js";
import { buildApiResponse } from "../helpers/apiResponse.js";

export async function POST(request) {
  // Map incoming JSON to clearer names
  const {
    name: courseName,
    prerequisites: prerequisiteIds,
  } = await request.json();

  try {
    await CurriculumService.createCourse(courseName, prerequisiteIds);

    return buildApiResponse({
      payload: "Course created successfully",
    });
  } catch (err) {
    return buildApiResponse({
      errorMessage: err.message,
      statusCode: 400,
    });
  }
}
