const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {
  const timeoutDuration = 30000; // 30 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include", // Important: Include cookies in requests
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. Please try again.");
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error("Cannot connect to server. Please check your connection.");
    }
    throw error;
  }
}

