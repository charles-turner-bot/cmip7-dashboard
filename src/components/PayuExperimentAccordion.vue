<template>
  <section
    class="mx-auto mb-12 max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
    aria-label="Payu experiment runs"
  >
    <div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
      <h2
        class="text-sm font-semibold uppercase text-gray-700 dark:text-gray-200"
      >
        Experiment runs
      </h2>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      data-test="payu-loading"
      class="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
    >
      Loading experiments…
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      data-test="payu-error"
      class="px-5 py-6 text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- Empty state -->
    <div
      v-else-if="experiments.length === 0"
      data-test="payu-empty"
      class="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
    >
      {{ emptyMessage }}
    </div>

    <!-- Accordion list -->
    <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
      <UCollapsible
        v-for="experiment in experiments"
        :key="experiment.uuid"
        :open="isPanelOpen(experiment.uuid)"
        :unmount-on-hide="false"
        class="payu-collapsible"
        data-test="accordion-item"
        @update:open="(value) => setPanelOpen(experiment.uuid, value)"
      >
        <button
          type="button"
          class="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/70"
          data-test="accordion-trigger"
        >
          <div class="flex min-w-0 flex-1 items-center gap-4">
            <span
              class="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 dark:!text-gray-100"
            >
              {{ experiment.name }}
            </span>
            <span class="shrink-0 text-xs text-gray-400 dark:text-gray-400">
              {{ experiment.modelCurrentTime }}
            </span>
            <UBadge color="primary" variant="soft" class="shrink-0">
              {{ experiment.serviceUnitsDisplay }} SU
            </UBadge>
          </div>
        </button>

        <template #content>
          <div data-test="accordion-content" class="px-5 pb-5 pt-0">
            <dl class="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
              <template
                v-for="[key, value] in Object.entries(experiment.details)"
                :key="key"
              >
                <div class="min-w-0">
                  <dt
                    class="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500"
                  >
                    {{ formatKey(key) }}
                  </dt>
                  <dd
                    class="mt-0.5 break-all text-sm text-gray-700 dark:text-gray-300"
                  >
                    {{ formatValue(value) }}
                  </dd>
                </div>
              </template>
            </dl>
          </div>
        </template>
      </UCollapsible>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { PayuExperiment } from "@/services/payuExperiments";

const props = withDefaults(
  defineProps<{
    experiments: PayuExperiment[];
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
  }>(),
  {
    loading: false,
    error: null,
    emptyMessage: "No experiment runs found.",
  },
);

// Track open panel UUIDs; multiple open at once is always allowed.
const openPanels = ref<string[]>([]);

// Expose for testing
defineExpose({ openPanels });

function isPanelOpen(uuid: string): boolean {
  return openPanels.value.includes(uuid);
}

function setPanelOpen(uuid: string, isOpen: boolean): void {
  if (isOpen) {
    if (!openPanels.value.includes(uuid)) {
      openPanels.value = [...openPanels.value, uuid];
    }
    return;
  }

  openPanels.value = openPanels.value.filter((panelUuid) => panelUuid !== uuid);
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatKey(key: string): string {
  return key.replaceAll("_", " ");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return String(value);
}
</script>

<style scoped>
.payu-collapsible {
  border-top: 1px solid rgb(243 244 246);
}

:deep(.dark .payu-collapsible) {
  border-top-color: rgb(55 65 81);
}

.payu-collapsible:first-child {
  border-top: 0;
}

:deep(.dark .payu-collapsible > button) {
  color: #f3f4f6;
}

@media (prefers-color-scheme: dark) {
  :deep(.payu-collapsible > button:hover) {
    background-color: rgb(31 41 55 / 0.7);
  }
}
</style>
