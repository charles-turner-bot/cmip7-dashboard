import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    persistence: "memory",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export { posthog };

export function usePosthog() {
  function capture(event: string, properties?: Record<string, unknown>) {
    if (!posthogKey) {
      return;
    }

    posthog.capture(event, properties);
  }

  return { capture };
}
