"use client";
import { toast } from "sonner";

export function showToastSuccess(message: string) {
  toast.success(message);
}

export function showToastError(message: string) {
  toast.error(message);
}
