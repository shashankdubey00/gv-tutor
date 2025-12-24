// Utility to prevent redirect loops
const REDIRECT_KEY = 'gv_tutor_redirecting';
const REDIRECT_TIMEOUT = 2000; // 2 seconds

export function setRedirecting(path) {
  sessionStorage.setItem(REDIRECT_KEY, JSON.stringify({
    path,
    timestamp: Date.now()
  }));
}

export function isRedirecting() {
  const data = sessionStorage.getItem(REDIRECT_KEY);
  if (!data) return false;
  
  try {
    const { timestamp } = JSON.parse(data);
    const elapsed = Date.now() - timestamp;
    
    // Clear if timeout exceeded
    if (elapsed > REDIRECT_TIMEOUT) {
      clearRedirecting();
      return false;
    }
    
    return true;
  } catch {
    clearRedirecting();
    return false;
  }
}

export function getRedirectingPath() {
  const data = sessionStorage.getItem(REDIRECT_KEY);
  if (!data) return null;
  
  try {
    const { path } = JSON.parse(data);
    return path;
  } catch {
    return null;
  }
}

export function clearRedirecting() {
  sessionStorage.removeItem(REDIRECT_KEY);
}

export function shouldRedirect(from, to) {
  // Don't redirect if we're already redirecting
  if (isRedirecting()) {
    const redirectingPath = getRedirectingPath();
    // Only allow redirect if it's to a different path
    if (redirectingPath === to) {
      return false;
    }
  }
  
  // Don't allow redirect loop
  if (from === '/apply-tutor' && to === '/complete-profile') {
    // Check if we just came from complete-profile
    const redirectingPath = getRedirectingPath();
    if (redirectingPath === '/apply-tutor') {
      return false; // Prevent loop
    }
  }
  
  if (from === '/complete-profile' && to === '/apply-tutor') {
    // Check if we just came from apply-tutor
    const redirectingPath = getRedirectingPath();
    if (redirectingPath === '/complete-profile') {
      return false; // Prevent loop
    }
  }
  
  return true;
}




