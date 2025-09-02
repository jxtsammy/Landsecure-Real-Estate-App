import API from "../../config";

export const verifyEmail = async (token) => {
  try {
    console.log("Verifying email with token:", token);
    if (!token) {
      return {
        success: false,
        status: 400,
        error: "Verification token is required."
      };
    }
    console.log("Sending verification request to API with token:", token);
    const response = await API.post("/auth/verify-email", token);
    console.log("Email verification response:", response);

    // Check for the specific success response from the API documentation
    // The tokens are in response.data.data.tokens
    if (response.data ) {
      const tokens = response.data.tokens;
      return {
        success: true,
        tokens: tokens,
        user: response.data.user,
        message: response.data.message
      };
    } else {
      // Handle cases where the HTTP status is 200, but the API indicates an error
      const backendMessage = response.data?.message || "An unexpected success response was received.";
      return {
        success: false,
        status: 200,
        error: backendMessage
      };
    }

  } catch (error) {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.response) {
      const status = error.response.status;
      const backendMessage = error.response.data?.error || error.response.data?.message;

      if (status === 400) {
        errorMessage = backendMessage || "Missing or invalid token.";
      } else if (status === 401) {
        errorMessage = backendMessage || "Token expired or invalid.";
      } else if (status === 500) {
        errorMessage = backendMessage || "Unable to verify email due to server error.";
      } else {
        errorMessage = backendMessage || `Unexpected error (status: ${status}).`;
      }

      return {
        success: false,
        status,
        error: errorMessage
      };
    }

    if (error.request) {
      return {
        success: false,
        status: null,
        error: "No response from server. Please check your internet connection."
      };
    }

    return {
      success: false,
      status: null,
      error: error.message || errorMessage
    };
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    if (!email) {
      return {
        success: false,
        status: 400,
        error: "Email address is required."
      };
    }

    const response = await API.post(
      "/auth/resend-verification",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    if (response.data && response.data.statusCode === 0) {
      return {
        success: true,
        message: response.data.message
      };
    } else {
      return {
        success: false,
        status: response.status,
        error: response.data?.error || response.data?.message || "Unexpected response from server."
      };
    }
  } catch (error) {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.response) {
      const status = error.response.status;
      const backendMessage = error.response.data?.error || error.response.data?.message;

      if (status === 400) {
        errorMessage = backendMessage || "Invalid or missing email address.";
      } else if (status === 404) {
        errorMessage = backendMessage || "User account not found.";
      } else if (status === 429) {
        errorMessage = backendMessage || "Too many resend attempts. Please try again later.";
      } else if (status === 500) {
        errorMessage = backendMessage || "Failed to resend verification email.";
      } else {
        errorMessage = backendMessage || `Unexpected error (status: ${status}).`;
      }

      return {
        success: false,
        status,
        error: errorMessage
      };
    }

    if (error.request) {
      return {
        success: false,
        status: null,
        error: "No response from server. Please check your internet connection."
      };
    }

    return {
      success: false,
      status: null,
      error: error.message || errorMessage
    };
  }
};
