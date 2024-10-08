import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      emitWarning: true, // This will show warnings instead of errors
      emitError: false, // This will prevent errors from blocking the build
    }),
  ],
});
