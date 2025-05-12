import User from "../../../repos/user.js";
import createResponse from "../response.js";
export async function POST(request) {
  const data = await request.json();
  try {
    const user = await User.getUserByUsernamePassword(
      data.username,
      data.password
    );
    if (user) return createResponse({ data: user });
    return createResponse({
      error: "Invalid username or password",
      status: 401,
    });
  } catch (error) {
    return createResponse({ error: "Internal server error", status: 500 });
  }
}
