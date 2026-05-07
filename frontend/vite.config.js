import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: parseInt(loadEnv("", process.cwd()).VITE_FRONTEND_PORT) || 5174,
  },
  build: {
    // Optimize chunk size with manual chunks configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for dependencies
          vendor: ["react", "react-dom", "react-router-dom"],
          // Material UI in separate chunk
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          // Socket and API related
          networking: ["socket.io-client"],
          // Firebase chunk
          firebase: ["firebase/app", "firebase/auth", "firebase/storage"],
        },
      },
    },
    // Increase chunk size warning limit to reduce noise
    chunkSizeWarningLimit: 1000,
  },
});
