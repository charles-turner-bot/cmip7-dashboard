import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DashboardHome from "./DashboardHome.vue";

describe("DashboardHome", () => {
  it("renders the dashboard home page", () => {
    const wrapper = mount(DashboardHome);

    expect(wrapper.text()).toContain("CMIP7 Dashboard");
    expect(wrapper.text()).toContain("Vue 3 + Vite");
    expect(wrapper.text()).toContain("ACCESS-NRI tooling");
  });
});
