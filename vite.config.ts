/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { execSync } from "child_process";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const getGitCommitSha = () => {
  try {
    return execSync("git rev-parse HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
};

const getAppVersion = () => {
  if (process.env.APP_VERSION) {
    return process.env.APP_VERSION;
  }

  try {
    return execSync("git describe --tags --exact-match HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    try {
      const lastTag = execSync("git describe --tags --abbrev=0", {
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim();
      return `${lastTag}.dirty`;
    } catch {
      return "dev";
    }
  }
};

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/cmip7-dashboard/" : "/",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __GIT_COMMIT_SHA__: JSON.stringify(getGitCommitSha()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __APP_VERSION__: JSON.stringify(getAppVersion()),
  },
  server: {},
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "cobertura"],
      exclude: [
        "node_modules/",
        "python/",
        "src/test/",
        "**/*.spec.ts",
        "**/*.d.ts",
        "vite.config.ts",
        "tailwind.config.js",
        "postcss.config.js",
        "dist/assets/**",
      ],
    },
  },
});
