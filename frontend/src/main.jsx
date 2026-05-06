import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
);
