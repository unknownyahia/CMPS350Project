import createResponse from "../../response.js";
import classModel from "../../data/classes/classes.js";

export async function POST(request) {
  // Parse the incoming JSON payload
  const payload = await request.json();
  
  // Create a new class using the provided data
  classModel.createClass(payload);
  
  // Return a response indicating success
  return createResponse({ data: "done" });
}
