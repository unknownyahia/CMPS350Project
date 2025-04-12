import createResponse from "../../response.js";
import instructors from "../../data/instructors/instructors.js";

export async function GET(request) {
  return createResponse({ data: await instructors.getInstructorsData() });
}
