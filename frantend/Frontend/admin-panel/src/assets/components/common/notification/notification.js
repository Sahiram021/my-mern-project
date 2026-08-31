import { toast } from "react-toastify";

const getMessage = (message) => {
  if (typeof message === "string") return message;
  if (message && typeof message === "object") return Object.values(message).join(", ");
  return "Something went wrong";
};

export const showSuccess = (message) => toast.success(getMessage(message));
export const showError = (message) => toast.error(getMessage(message));
export const showWarning = (message) => toast.warning(getMessage(message));
