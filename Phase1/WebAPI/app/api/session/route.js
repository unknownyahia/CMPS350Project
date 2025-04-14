import usersDatabase from "../../data/users/users.js";
import createResponse from "../../response.js";

export async function POST(request) {
  // Parse the incoming JSON payload containing login credentials
  const payload = await request.json();
  
  // Attempt to retrieve the user matching the provided username and password
  const foundUser = await usersDatabase.getUserByUsernamePassword(
    payload.username,
    payload.password
  );
  
  // If a matching user is found, return a successful response with user data
  if (foundUser) {
    return createResponse({ data: foundUser });
  }
  
  // Otherwise, return an error response indicating invalid credentials
  return createResponse({
    error: "Invalid username or password",
    status: 401,
  });
}
