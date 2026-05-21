<template>
  <section
    class="mx-auto mb-12 max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
  >
    <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase text-blue-700">
          Prototype plot
        </p>
        <h2 class="mt-1 text-base font-semibold text-gray-800">
          CMIP7 readiness signal
        </h2>
      </div>
      <div class="rounded-lg bg-blue-50 px-3 py-2 text-right">
        <p class="text-xs text-gray-500">Latest</p>
        <p class="text-sm font-semibold text-blue-700">
          {{ primaryLatest }} TCRE
        </p>
      </div>
    </div>

    <div class="relative min-h-72">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <p class="mt-4 text-xs leading-relaxed text-gray-500">
      Dummy values are standing in for a future parquet-backed data source.
      {{ primaryDeltaCopy }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Line } from "vue-chartjs";
import {
  useDummyClimatePlot,
  type PlotSeries,
} from "@/composables/useDummyClimatePlot";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// Replace this stub with rows from loadParquetDataSource/useParquetDataSource once the real CMIP7 source shape is fixed.
const dummySeries = ref<PlotSeries[]>([
  {
    label: "Model 1",
    color: "#2563eb",
    points: [
      { label: "2027", value: 1.55 },
      { label: "2028", value: 1.58 },
      { label: "2029", value: 1.6 },
      { label: "2030", value: 1.62 },
      { label: "2031", value: 1.66 },
      { label: "2032", value: 1.69 },
      { label: "2033", value: 1.71 },
      { label: "2034", value: 1.74 },
    ],
  },
  {
    label: "Model 2",
    color: "#f97316",
    points: [
      { label: "2027", value: 1.42 },
      { label: "2028", value: 1.45 },
      { label: "2029", value: 1.47 },
      { label: "2030", value: 1.51 },
      { label: "2031", value: 1.53 },
      { label: "2032", value: 1.55 },
      { label: "2033", value: 1.59 },
      { label: "2034", value: 1.62 },
    ],
  },
]);

const plot = useDummyClimatePlot(dummySeries);

const primaryLatest = computed(() => {
  const value = plot.latestValues.value.at(0)?.value;
  return value === null || value === undefined ? "n/a" : value.toFixed(2);
});

const primaryDeltaCopy = computed(() => {
  const delta = plot.deltas.value.at(0)?.value;
  if (delta === null || delta === undefined) return "No change available yet.";

  const signedDelta = `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}`;
  return `Model 1 change: ${signedDelta} TCRE.`;
});

const chartData = computed(() => ({
  labels: plot.labels.value,
  datasets: plot.rawSeries.value.map((series) => ({
    label: series.label,
    data: series.values,
    borderColor: series.color,
    borderWidth: 2,
    pointBackgroundColor: series.color,
    pointRadius: 3,
    tension: 0,
  })),
}));

const chartOptions = computed<ChartOptions<"line">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "top",
      labels: {
        boxWidth: 12,
        color: "#374151",
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<"line">) =>
          ctx.parsed.y !== null
            ? `${ctx.dataset.label ?? "Value"}: ${ctx.parsed.y.toFixed(2)} TCRE`
            : "",
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6b7280" },
    },
    y: {
      title: {
        display: true,
        text: "TCRE",
        color: "#4b5563",
      },
      ticks: { color: "#6b7280" },
    },
  },
}));
</script>
