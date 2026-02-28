import express from "express";
import { allowedStatuses, createStore } from "./store.js";

export function createApp(seed = []) {
  const app = express();
  const store = createStore(seed);

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/applications", (req, res) => {
    const { status, q } = req.query;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "invalid status filter" });
    }

    return res.json(store.all({ status, q }));
  });

  app.get("/applications/stats", (_req, res) => {
    res.json(store.stats());
  });

  app.get("/applications/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = store.get(id);
    if (!item) {
      return res.status(404).json({ error: "application not found" });
    }
    return res.json(item);
  });

  app.post("/applications", (req, res) => {
    const result = store.create(req.body || {});
    if (result.errors) {
      return res.status(400).json({ errors: result.errors });
    }
    return res.status(201).json(result.value);
  });

  app.patch("/applications/:id", (req, res) => {
    const id = Number(req.params.id);
    const result = store.update(id, req.body || {});

    if (result.missing) {
      return res.status(404).json({ error: "application not found" });
    }

    if (result.errors) {
      return res.status(400).json({ errors: result.errors });
    }

    return res.json(result.value);
  });

  app.delete("/applications/:id", (req, res) => {
    const id = Number(req.params.id);
    const removed = store.remove(id);
    if (!removed) {
      return res.status(404).json({ error: "application not found" });
    }
    return res.status(204).send();
  });

  return app;
}
