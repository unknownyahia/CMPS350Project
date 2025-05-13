// app/api/login/route.js
import AccountManager from "../../../dataServices/accountManager.js";
import { buildApiResponse } from "../helpers/apiResponse.js";

export async function POST(request) {
  const { username: userId, password: secretKey } = await request.json();

  try {
    const account = await AccountManager.retrieveByCredentials(
      userId,
      secretKey
    );

    if (account) {
      return buildApiResponse({ payload: account });
    }

    return buildApiResponse({
      errorMessage: "Invalid username or password",
      statusCode: 401,
    });
  } catch (err) {
    // Optionally log err here
    return buildApiResponse({
      errorMessage: "Internal server error",
      statusCode: 500,
    });
  }
}
