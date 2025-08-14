import API from "../../config" // Adjust import path based on your API config

export const verifyEmail = async (token, email) => {
  // Basic token validation
  if (!token || typeof token !== "string") {
    throw new Error("Invalid verification token")
  }

  // Basic email validation
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Valid email is required for verification")
  }

  try {
    console.log("Attempting to verify email with:", { token, email })

    const requestBody = {
      token: token.trim(),
      email: email.trim(),
    }

    console.log("Sending verification request:", requestBody)

    const response = await API.post("/auth/verify-email", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: (status) => status < 500, // Don't throw for 4xx errors
    })

    console.log("Verification API response:", response)

    // Handle successful responses - FIXED to match your API format
    if (response.status === 200 || response.status === 201) {
      // Check for your actual API response structure
      if (response.data?.statusCode === 200 && response.data?.data?.access_token) {
        console.log("✅ Verification successful - extracting tokens")

        return {
          accessToken: response.data.data.access_token,
          refreshToken: response.data.data.refresh_token,
          accessExpiresIn: response.data.data.expires_in_access === "1h" ? 3600 : 3600,
          refreshExpiresIn: response.data.data.expires_in_refresh === "7d" ? 604800 : 604800,
        }
      }
      // Alternative structure (direct in response.data)
      else if (response.data?.access_token) {
        console.log("✅ Verification successful - alternative structure")

        return {
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token || null,
          accessExpiresIn: response.data.expires_in_access === "1h" ? 3600 : 3600,
          refreshExpiresIn: response.data.expires_in_refresh === "7d" ? 604800 : 604800,
        }
      }
      // Check if it's a success message without tokens (shouldn't happen but just in case)
      else if (response.data?.message === "EMAIL_VERIFIED") {
        console.log("✅ Email verified but no tokens found")
        throw new Error("Email verified successfully but no access tokens received")
      }
    }

    // Handle specific error responses
    if (response.status === 400) {
      const errorMessage = response.data?.message || "Invalid or expired verification code"

      if (errorMessage.includes("No registration found")) {
        throw new Error("Registration not found. Please sign up again or contact support.")
      } else if (errorMessage.includes("token")) {
        throw new Error("Invalid or expired verification code. Please request a new code.")
      } else {
        throw new Error(errorMessage)
      }
    }

    if (response.status === 404) {
      throw new Error("Verification code not found. Please request a new code.")
    }

    if (response.status === 422) {
      throw new Error("Invalid verification code format. Please enter a valid 6-digit code.")
    }

    // If we get here, something unexpected happened
    console.error("Unexpected API response:", response)
    throw new Error(response.data?.message || "Email verification failed")
  } catch (error) {
    console.error("Verify email error:", error)

    // Network errors
    if (error.message === "Network Error") {
      throw new Error("Network connection failed. Please check your internet connection.")
    }

    // API errors with specific messages
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    // Re-throw already processed errors
    if (
      error.message.includes("Registration not found") ||
      error.message.includes("Invalid") ||
      error.message.includes("expired") ||
      error.message.includes("not found") ||
      error.message.includes("Email verified successfully")
    ) {
      throw error
    }

    // Default error
    throw new Error("Email verification failed. Please try again later.")
  }
}

// Resending Email Verification tokens
export const resendVerificationEmail = async (email) => {
  // Basic email validation
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Please enter a valid email address")
  }

  try {
    console.log("Attempting to resend verification email to:", email)

    const requestBody = { email: email.trim() }
    console.log("Sending resend request:", requestBody)

    const response = await API.post("/auth/resend-verification", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: (status) => status < 500, // Don't throw for 4xx errors
    })

    console.log("Resend API response:", response)

    // Handle different success responses
    if (response.status === 200 || response.status === 202) {
      // Check for success in response body
      if (response.data?.statusCode === 200 || response.data?.message?.includes("sent")) {
        return true
      }
      return true
    }

    // Handle specific error responses
    if (response.status === 400) {
      const errorMessage = response.data?.message || "Bad request"

      if (errorMessage.includes("No registration found")) {
        throw new Error("Email not registered. Please sign up first.")
      } else {
        throw new Error(errorMessage)
      }
    }

    if (response.status === 404) {
      throw new Error("Email not found in our system. Please sign up first.")
    }

    if (response.status === 429) {
      throw new Error("Please wait before requesting another verification email.")
    }

    throw new Error(response.data?.message || "Failed to resend verification email")
  } catch (error) {
    console.error("Resend verification error:", error)

    // Network errors
    if (error.message === "Network Error") {
      throw new Error("Network connection failed. Please check your internet connection.")
    }

    // API errors with specific messages
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    // Re-throw already processed errors
    if (
      error.message.includes("Email not") ||
      error.message.includes("Please wait") ||
      error.message.includes("not registered")
    ) {
      throw error
    }

    // Default error
    throw new Error("Failed to resend verification email. Please try again later.")
  }
}
