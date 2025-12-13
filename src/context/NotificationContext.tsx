"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Notification from "@/components/ui/Notification";

interface NotificationContextType {
  showNotification: (title: string, message: string, productImage?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    productImage?: string;
  }>({
    show: false,
    title: "",
    message: "",
  });

  const showNotification = useCallback((title: string, message: string, productImage?: string) => {
    setNotification({
      show: true,
      title,
      message,
      productImage,
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        show={notification.show}
        title={notification.title}
        message={notification.message}
        productImage={notification.productImage}
        onClose={closeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
