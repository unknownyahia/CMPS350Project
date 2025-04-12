import createResponse from "../../response.js";
import classes from "../../data/classes/classes.js";
export async function POST(request) {
  const data = await request.json();
  classes.createClass(data);
  return createResponse({ data: "done" });
}
