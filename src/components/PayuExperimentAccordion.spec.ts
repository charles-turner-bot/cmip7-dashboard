import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PrimeVue from "primevue/config";
import PayuExperimentAccordion from "./PayuExperimentAccordion.vue";

const experiments = [
  {
    name: "red-run",
    uuid: "1",
    modelStartTime: "0001-01-01T00:00:00",
    modelCurrentTime: "0020-01-01T00:00:00",
    modelEndTime: "0100-01-01T00:00:00",
    serviceUnitsDisplay: "1",
    progress: { percent: 20, label: "20% complete", tone: "red" as const },
    details: {},
  },
  {
    name: "green-run",
    uuid: "2",
    modelStartTime: "0001-01-01T00:00:00",
    modelCurrentTime: "0090-01-01T00:00:00",
    modelEndTime: "0100-01-01T00:00:00",
    serviceUnitsDisplay: "9",
    progress: { percent: 90, label: "90% complete", tone: "green" as const },
    details: {},
  },
];

describe("PayuExperimentAccordion", () => {
  it("renders a progress bar and label for each experiment", () => {
    const wrapper = mount(PayuExperimentAccordion, {
      props: { experiments },
      global: {
        plugins: [PrimeVue],
      },
    });

    const labels = wrapper.findAll('[data-test="progress-label"]');
    expect(labels).toHaveLength(2);
    expect(labels[0]!.text()).toContain("20% complete");
    expect(labels[1]!.text()).toContain("90% complete");

    const fills = wrapper.findAll('[data-test="progress-fill"]');
    expect(fills[0]!.attributes("style")).toContain("width: 20%");
    expect(fills[1]!.attributes("style")).toContain("width: 90%");
    expect(fills[0]!.classes()).toContain("bg-red-500");
    expect(fills[1]!.classes()).toContain("bg-green-500");
  });
});
