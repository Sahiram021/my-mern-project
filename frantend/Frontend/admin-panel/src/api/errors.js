export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;
  const apiError = responseData?.error;

  if (typeof apiError === "string" && apiError.trim()) return apiError;
  if (apiError && typeof apiError === "object") {
    const detail = Object.values(apiError).find(
      (value) => typeof value === "string" && value.trim()
    );
    if (detail) return detail;
  }

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }

  if (typeof error?.message === "string" && error.message !== "Network Error") {
    return error.message;
  }

  return `${fallbackMessage}. Check that the backend API is running and reachable.`;
}
