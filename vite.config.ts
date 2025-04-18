import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "rapidamente",

  plugins: [react(), sentryVitePlugin({
    org: "limboteams",
    project: "rapidamente"
  })],

  resolve: {
    alias: {
      src: "/src",
    },
  },

  build: {
    sourcemap: true
  }
});