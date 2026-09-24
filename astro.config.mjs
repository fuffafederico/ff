import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://federicofuffa.it",
  trailingSlash: "always",
  build: { inlineStylesheets: "always" },
  compressHTML: true,
});
