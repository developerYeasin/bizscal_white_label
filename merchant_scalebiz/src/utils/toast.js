import { toast } from "react-toastify";

export const showSuccess = (message) => {
  // console.log("Showing success toast:", message);
  toast.success(message);
};

export const showError = (message) => {
  // console.log("Showing error toast:", message);
  toast.error(message);
};

export const showLoading = (message) => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};