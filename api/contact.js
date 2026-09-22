function sendJson(response, status, payload) {
  response.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.json(payload);
}

function parseBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return Object.fromEntries(new URLSearchParams(request.body));
  return {};
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = (request, response) => {
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, message: "POST is required." });
    return;
  }

  const payload = parseBody(request);
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const message = String(payload.message || "").trim();

  if (!name || !validEmail(email) || !message) {
    sendJson(response, 422, { ok: false, message: "Please complete all required fields." });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    message: "Thanks. Your message has been received by the GrokExpedia team.",
  });
};
