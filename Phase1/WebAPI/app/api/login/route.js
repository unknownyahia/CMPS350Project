import users from "../../data/users/users.js";
import createResponse from "../../response.js";
export async function POST(request) {
  const data = await request.json();
  const user = await users.getUserByUsernamePassword(
    data.username,
    data.password
  );
  if (user) return createResponse({ data: user });
  return createResponse({ error: "Invalid username or password", status: 401 });
}
