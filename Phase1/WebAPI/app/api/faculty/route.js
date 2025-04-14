import createResponse from "../../response.js";
import instructorsData from "../../data/instructors/instructors.js";

export async function GET(request) {
  // Retrieve all instructors' details and send them in the response
  const result = await instructorsData.getInstructorsData();
  return createResponse({ data: result });
}
