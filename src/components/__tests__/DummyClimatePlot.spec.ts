import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import DummyClimatePlot from "../DummyClimatePlot.vue";

vi.mock("vue-chartjs", () => ({
  Line: {
    name: "Line",
    props: ["data", "options"],
    template: '<div data-test="line-chart" />',
  },
}));

describe("DummyClimatePlot", () => {
  it("renders the raw dummy plot shell", () => {
    const wrapper = mount(DummyClimatePlot);

    expect(wrapper.text()).toContain("CMIP7 readiness signal");
    expect(wrapper.text()).toContain("1.74 TCRE");
    expect(wrapper.text()).toContain("Model 1 change: +0.20 TCRE.");
    expect(wrapper.find('[data-test="line-chart"]').exists()).toBe(true);
  });
});
