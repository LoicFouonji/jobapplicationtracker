const allowedStatuses = ["Applied", "Interview", "Offer", "Rejected"];

export function createStore(seed = []) {
  let applications = [...seed];
  let currentId = applications.length ? Math.max(...applications.map((item) => item.id)) + 1 : 1;

  function validatePayload(payload, partial = false) {
    const errors = [];
    const required = ["company", "role", "status"];

    if (!partial) {
      for (const key of required) {
        if (!payload[key] || typeof payload[key] !== "string") {
          errors.push(`${key} is required`);
        }
      }
    }

    if (payload.status && !allowedStatuses.includes(payload.status)) {
      errors.push(`status must be one of: ${allowedStatuses.join(", ")}`);
    }

    return errors;
  }

  return {
    all(filters = {}) {
      const { status, q } = filters;
      return applications.filter((item) => {
        const statusMatch = status ? item.status === status : true;
        const qMatch = q
          ? [item.company, item.role, item.notes || ""].join(" ").toLowerCase().includes(q.toLowerCase())
          : true;
        return statusMatch && qMatch;
      });
    },

    get(id) {
      return applications.find((item) => item.id === id) || null;
    },

    create(payload) {
      const errors = validatePayload(payload);
      if (errors.length) {
        return { errors };
      }

      const newItem = {
        id: currentId++,
        company: payload.company.trim(),
        role: payload.role.trim(),
        status: payload.status,
        notes: payload.notes?.trim() || "",
        appliedAt: payload.appliedAt || new Date().toISOString().slice(0, 10)
      };

      applications.push(newItem);
      return { value: newItem };
    },

    update(id, payload) {
      const existing = this.get(id);
      if (!existing) {
        return { missing: true };
      }

      const errors = validatePayload(payload, true);
      if (errors.length) {
        return { errors };
      }

      const fields = ["company", "role", "status", "notes", "appliedAt"];
      for (const field of fields) {
        if (payload[field] !== undefined) {
          existing[field] = typeof payload[field] === "string" ? payload[field].trim() : payload[field];
        }
      }

      return { value: existing };
    },

    remove(id) {
      const startLength = applications.length;
      applications = applications.filter((item) => item.id !== id);
      return applications.length !== startLength;
    },

    stats() {
      return allowedStatuses.reduce((acc, status) => {
        acc[status] = applications.filter((item) => item.status === status).length;
        return acc;
      }, {});
    }
  };
}

export { allowedStatuses };
