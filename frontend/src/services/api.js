const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiRequest(endpoint, options = {}) {
  // Create AbortController for timeout
  // Longer timeout for form submissions (5 minutes)
  const isFormSubmission = options.method === 'POST' && (
    endpoint.includes('/tutor-profile') || 
    endpoint.includes('/tutor-requests')
  );
  const timeoutDuration = isFormSubmission ? 300000 : 30000; // 5 min for forms, 30 sec for others
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  const startTime = Date.now();
  console.log(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include", // Important: Include cookies in requests
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      ...options,
    });
    
    // Note: Set-Cookie header is forbidden and cannot be read by JavaScript
    // But the cookie should still be set by the browser automatically
    if (endpoint.includes('/auth/login')) {
      console.log("🍪 Login response received - cookie should be set automatically by browser");
      console.log("🔍 Check DevTools → Application → Cookies to verify cookie exists");
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    console.log(`✅ API Response: ${endpoint} (${duration}ms)`);

    let data = null;

    // ✅ Safe JSON parsing (NO crash)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      console.error(`❌ API Error: ${endpoint} - ${data?.message || response.statusText}`);
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    console.error(`❌ API Request Failed: ${endpoint} (${duration}ms)`, error);
    
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error("Cannot connect to server. Please make sure the backend is running.");
    }
    throw error;
  }
}
