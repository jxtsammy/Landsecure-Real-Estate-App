import API from "../../config";

export const verifyEmail = async (token) => {
  try {
    const response = await API.get("/auth/verify-email", {
      params: {
        token
      },
      headers: {
        Accept: "application/json"
      }
    });

    // Check for the specific success response from the API documentation
    if (response.data && response.data.statusCode === 0) {
      return {
        success: true,
        data: response.data
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
