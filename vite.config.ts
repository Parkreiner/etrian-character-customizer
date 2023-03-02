import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/components": resolve(__dirname, "./src/components/"),
      "@/contexts": resolve(__dirname, "./src/contexts/"),
      "@/helpers": resolve(__dirname, "./src/helpers/"),
      "@/hooks": resolve(__dirname, "./src/hooks/"),
      "@/typesConstants": resolve(__dirname, "./src/typesConstants/"),
    },
  },
});
