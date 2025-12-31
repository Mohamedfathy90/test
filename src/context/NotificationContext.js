import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success", // success, error, info
  });

  const showNotification = (message, type = "success", duration = 2000) => {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "success",
      });
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification.show && (
        <div className="fixed top-0 left-0 w-full z-50 animate-slideDown">
          <div
            className={`text-white text-center py-3 text-sm tracking-wide ${
              notification.type === "success"
                ? "bg-black"
                : notification.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
