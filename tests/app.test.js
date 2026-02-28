import { describe, expect, it } from "vitest";
import { createStore } from "../src/store.js";

describe("job application tracker store", () => {
  it("creates and lists applications", () => {
    const store = createStore();
    const createRes = store.create({
      company: "Stripe",
      role: "Software Engineer",
      status: "Applied"
    });

    expect(createRes.value.company).toBe("Stripe");
    expect(store.all()).toHaveLength(1);
  });

  it("validates status", () => {
    const store = createStore();
    const res = store.create({
      company: "Acme",
      role: "Backend Engineer",
      status: "Waiting"
    });

    expect(res.errors[0]).toContain("status must be one of");
  });

  it("returns status counts", () => {
    const store = createStore([
      { id: 1, company: "A", role: "SE", status: "Applied", notes: "", appliedAt: "2026-01-10" },
      { id: 2, company: "B", role: "SE", status: "Interview", notes: "", appliedAt: "2026-01-11" },
      { id: 3, company: "C", role: "SE", status: "Interview", notes: "", appliedAt: "2026-01-12" }
    ]);

    const stats = store.stats();
    expect(stats.Interview).toBe(2);
    expect(stats.Applied).toBe(1);
  });
});
