import { useNavigationState } from "~/composables/useNavigationState";
import { usePosthog } from "~/composables/usePosthog";

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const route = useRoute();
  const isNavigating = useNavigationState();
  const { capture } = usePosthog();
  let navigationTimeout: ReturnType<typeof setTimeout> | undefined;

  const clearNavigationState = () => {
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
      navigationTimeout = undefined;
    }

    isNavigating.value = false;
  };

  const startNavigationState = () => {
    clearNavigationState();
    isNavigating.value = true;

    // Never let the overlay stick forever if a navigation is aborted or a hook throws.
    navigationTimeout = setTimeout(() => {
      isNavigating.value = false;
      navigationTimeout = undefined;
    }, 10000);
  };

  useHead(() => {
    const title = route.meta?.title;

    return title ? { title: String(title) } : {};
  });

  router.beforeEach((_to, _from, next) => {
    startNavigationState();
    next();
  });

  router.afterEach((to) => {
    try {
      capture("$pageview", { path: to.fullPath, name: to.name });
    } finally {
      clearNavigationState();
    }
  });

  router.onError(() => {
    clearNavigationState();
  });

  nuxtApp.hook("app:mounted", () => {
    clearNavigationState();
  });

  nuxtApp.hook("page:finish", () => {
    clearNavigationState();
  });

  nuxtApp.hook("page:error", () => {
    clearNavigationState();
  });
});
