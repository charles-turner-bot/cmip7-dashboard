import { execSync } from "child_process";

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

export default defineNuxtConfig({
  srcDir: "src/",
  modules: ["@nuxt/ui"],
  app: {
    baseURL:
      process.env.NODE_ENV === "production" ? "/cmip7-dashboard/" : "/",
  },
  css: ["~/style.css"],
  vite: {
    define: {
      __GIT_COMMIT_SHA__: JSON.stringify(getGitCommitSha()),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __APP_VERSION__: JSON.stringify(getAppVersion()),
    },
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
          "nuxt.config.ts",
          "tailwind.config.js",
          "postcss.config.js",
          "dist/assets/**",
        ],
      },
    },
  },
});