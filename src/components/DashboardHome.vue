<template>
  <main class="container mx-auto px-6 pt-6">
    <UCard id="hero" class="mx-auto mb-8 mt-12 max-w-2xl">
      <div class="mb-5 flex justify-center">
        <a
          href="https://www.access-nri.org.au"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ACCESS-NRI"
        >
          <img
            src="/ACCESS-logo.svg"
            alt="ACCESS-NRI"
            class="h-16 object-contain"
          />
        </a>
      </div>
      <p class="mb-2 text-sm font-semibold uppercase text-primary">
        Climate model intelligence
      </p>
      <h1
        class="mb-3 text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-gray-100"
      >
        CMIP7 Dashboard
      </h1>
      <p class="text-sm leading-relaxed text-muted sm:text-base">
        A lightweight interface for tracking climate model outputs and derived
        metrics as runs progress.
      </p>
    </UCard>

    <section
      class="mx-auto mb-12 grid max-w-2xl gap-4 sm:grid-cols-3"
      aria-label="Dashboard status"
    >
      <UCard
        v-for="item in statusCards"
        :key="item.label"
        class="px-5 py-4"
      >
        <p
          class="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500"
        >
          {{ item.label }}
        </p>
        <p class="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
          {{ item.value }}
        </p>
      </UCard>
    </section>

    <DummyClimatePlot />

    <PayuExperimentAccordion
      :experiments="payuExperiments"
      :loading="payuLoading"
      :error="payuError"
    />

    <UCard class="mx-auto mb-12 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      <h2
        class="text-sm font-semibold uppercase text-gray-700 dark:text-gray-200"
      >
        About
      </h2>
      <p>
        This scaffold will become a browser-based view over CMIP7 model runs and
        derived indicators such as TCRE. For now it keeps the app shell,
        routing, telemetry, test setup, and data-visualisation dependencies in
        place.
      </p>
      <div
        class="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3 dark:border-gray-700"
      >
        <span class="text-xs text-gray-400 dark:text-gray-500">Built with ACCESS-NRI tooling</span>
        <UBadge color="neutral" variant="soft">Nuxt UI</UBadge>
        <a
          href="https://www.access-nri.org.au"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/ACCESS-logo.svg"
            alt="ACCESS-NRI"
            class="h-9 object-contain opacity-80"
          />
        </a>
      </div>
    </UCard>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DummyClimatePlot from "./DummyClimatePlot.vue";
import PayuExperimentAccordion from "./PayuExperimentAccordion.vue";
import { loadPayuExperiments } from "@/services/payuExperiments";
import type { PayuExperiment } from "@/services/payuExperiments";

const statusCards = [
  { label: "App", value: "Nuxt 4 + Nuxt UI" },
  { label: "Metrics", value: "TCRE-ready" },
  { label: "Charts", value: "Chart.js-ready" },
];

const payuExperiments = ref<PayuExperiment[]>([]);
const payuLoading = ref(true);
const payuError = ref<string | null>(null);

onMounted(async () => {
  try {
    payuExperiments.value = await loadPayuExperiments();
  } catch (err) {
    payuError.value =
      err instanceof Error ? err.message : "Failed to load experiments.";
  } finally {
    payuLoading.value = false;
  }
});
</script>
