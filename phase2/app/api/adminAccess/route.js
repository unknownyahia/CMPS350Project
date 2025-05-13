// app/api/adminAccess/route.js
import AccountManager from "../../../dataServices/accountManager.js";
import { buildApiResponse } from "../helpers/apiResponse.js";

export async function POST(request) {
  // Pull & rename credentials from the request
  const { username: adminUser, password: adminPass } = await request.json();

  try {
    // Verify credentials
    const user = await AccountManager.retrieveByCredentials(
      adminUser,
      adminPass
    );

    // Check we got back an admin
    if (!user || user.role !== "admin") {
      return buildApiResponse({
        errorMessage: "Unauthorized access",
        statusCode: 401,
      });
    }

    // Success: return the admin’s info
    return buildApiResponse({ payload: user });
  } catch (err) {
    // Unexpected error
    return buildApiResponse({
      errorMessage: "Internal server error",
      statusCode: 500,
    });
  }
}
