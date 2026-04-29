"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Toast, type ToastType } from "./Toast";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: "", type: "info", visible: false });

  const show = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type, visible: true });
  }, []);

  const hide = useCallback(() => {
    setToast((t) => ({ ...t, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hide} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
