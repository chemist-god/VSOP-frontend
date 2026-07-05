import { toast } from "sonner";

type ToastOptions = {
  description?: string;
};

export function toastSuccess(message: string, options?: ToastOptions) {
  toast.success(message, {
    description: options?.description,
    duration: 4000,
  });
}

export function toastError(message: string, options?: ToastOptions) {
  toast.error(message, {
    description: options?.description,
    duration: 5000,
  });
}

export function toastInfo(message: string, options?: ToastOptions) {
  toast.info(message, {
    description: options?.description,
    duration: 4000,
  });
}
