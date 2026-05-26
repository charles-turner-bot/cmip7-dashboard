import { describe, expect, it } from "vitest";
import {
  calculateExperimentProgress,
  normalizePayuExperiment,
} from "./payuExperiments";

describe("payu experiment progress", () => {
  it("calculates a coloured completion state from known run length", () => {
    expect(
      calculateExperimentProgress({
        experiment_model_start_time: "0001-01-01T00:00:00",
        experiment_model_current_time: "0025-01-01T00:00:00",
        experiment_model_end_time: "0100-01-01T00:00:00",
      }),
    ).toEqual({ percent: 24, label: "24% complete", tone: "red" });

    expect(
      calculateExperimentProgress({
        experiment_model_start_time: "0001-01-01T00:00:00",
        experiment_model_current_time: "0050-01-01T00:00:00",
        experiment_model_end_time: "0100-01-01T00:00:00",
      }),
    ).toEqual({ percent: 49, label: "49% complete", tone: "yellow" });

    expect(
      calculateExperimentProgress({
        experiment_model_start_time: "0001-01-01T00:00:00",
        experiment_model_current_time: "0090-01-01T00:00:00",
        experiment_model_end_time: "0100-01-01T00:00:00",
      }),
    ).toEqual({ percent: 90, label: "90% complete", tone: "green" });
  });

  it("falls back cleanly when run length is unknown", () => {
    expect(
      normalizePayuExperiment({
        experiment_name: "test",
        experiment_uuid: "abc",
        experiment_model_start_time: "1850-01-01T00:00:00",
        experiment_model_current_time: "1900-01-01T00:00:00",
      }).progress,
    ).toEqual({ percent: null, label: "Run length unknown", tone: "neutral" });
  });
});
