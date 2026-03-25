"use client";

import * as React from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return { toasts: [...state.toasts, action.toast] };
    case "REMOVE_TOAST":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
};

let toastCount = 0;
const listeners: Array<(action: ToastAction) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: ToastAction) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => listener(action));
}

function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
}: Omit<Toast, "id">) {
  const id = String(toastCount++);
  dispatch({ type: "ADD_TOAST", toast: { id, title, description, variant, duration } });

  if (duration > 0) {
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", id });
    }, duration);
  }

  return id;
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    const listener = () => setState({ ...memoryState });
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id: string) => dispatch({ type: "REMOVE_TOAST", id }),
  };
}

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-white border-border",
  success: "bg-white border-success-200",
  error: "bg-white border-error-200",
  warning: "bg-white border-warning-200",
  info: "bg-white border-primary-200",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-error-500 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-primary-500 shrink-0" />,
};

function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "relative flex items-start gap-3 rounded-xl border p-4 shadow-floating animate-slide-in-from-right",
            variantStyles[t.variant || "default"]
          )}
        >
          {variantIcons[t.variant || "default"]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{t.title}</p>
            {t.description && (
              <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export { ToastContainer, useToast, toast };
export type { Toast, ToastVariant };
