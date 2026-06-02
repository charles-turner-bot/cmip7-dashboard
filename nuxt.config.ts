export default defineNuxtConfig({
  srcDir: "src/",
  app: {
    baseURL:
      process.env.NODE_ENV === "production" ? "/cmip7-dashboard/" : "/",
  },
  css: ["~/style.css"],
});