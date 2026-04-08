import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc"; // Keep swc for performance, it supports JSX
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8085,
  },
  plugins: [
    // dyadComponentTagger(), // DISABLED for CSP compliance
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": "react",
      "react-dom/client": "react-dom/client",
      "react-dom": "react-dom",
    },
  },
}));