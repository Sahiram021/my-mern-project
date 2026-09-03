import Cookies from "js-cookie";

const TOKEN_KEY = "token";

function cookieOptions() {
  return {
    expires: 7,
    path: "/",
    sameSite: "lax",
    secure:
      typeof window !== "undefined" && window.location.protocol === "https:",
  };
}

export function getAuthToken() {
  const cookieToken = Cookies.get(TOKEN_KEY) || "";

  if (typeof window === "undefined") {
    return cookieToken;
  }

  const storedToken = window.localStorage.getItem(TOKEN_KEY) || "";

  // Older sessions stored the token only in localStorage. Restore the cookie so
  // server-side route checks and client-side API calls see the same session.
  if (!cookieToken && storedToken) {
    Cookies.set(TOKEN_KEY, storedToken, cookieOptions());
    return storedToken;
  }

  return cookieToken || storedToken;
}

export function setAuthToken(token) {
  const nextToken = String(token || "").trim();

  if (!nextToken || typeof window === "undefined") {
    return "";
  }

  window.localStorage.setItem(TOKEN_KEY, nextToken);
  Cookies.set(TOKEN_KEY, nextToken, cookieOptions());
  return nextToken;
}

export function clearAuthToken() {
  Cookies.remove(TOKEN_KEY, { path: "/" });

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}
