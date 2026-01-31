const API_BASE_URL = import.meta.env.VITE_API_URL || "https://gvtutor.onrender.com/api";

// Submit contact form
export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("🔍 Contact form response status:", response.status);
    console.log("🔍 Contact form response headers:", response.headers.get("content-type"));
    
    const responseText = await response.text();
    console.log("🔍 Contact form response text:", responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse response as JSON:", parseError);
      throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 200)}...`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit contact form");
    }

    return data;
  } catch (error) {
    console.error("Contact form submission error:", error);
    throw error;
  }
};

// Get all contact messages (Admin only)
export const getContactMessages = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/contact/all?${queryString}`, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch contact messages");
    }

    return data;
  } catch (error) {
    console.error("Fetch contact messages error:", error);
    throw error;
  }
};

// Update message status (Admin only)
export const updateMessageStatus = async (messageId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/${messageId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update message status");
    }

    return data;
  } catch (error) {
    console.error("Update message status error:", error);
    throw error;
  }
};

// Delete message (Admin only)
export const deleteContactMessage = async (messageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/${messageId}`, {
      method: "DELETE",
      credentials: "include", // Include cookies for authentication
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete message");
    }

    return data;
  } catch (error) {
    console.error("Delete message error:", error);
    throw error;
  }
};
