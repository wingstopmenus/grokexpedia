function sendJson(response, status, payload) {
  response.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.json(payload);
}

function parseBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    const contentType = request.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      return JSON.parse(request.body);
    }
    return Object.fromEntries(new URLSearchParams(request.body));
  }

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

  let payload;
  try {
    payload = parseBody(request);
  } catch {
    sendJson(response, 400, { ok: false, message: "Invalid JSON." });
    return;
  }

  const email = String(payload.email || "").trim().toLowerCase();
  if (!validEmail(email)) {
    sendJson(response, 422, { ok: false, message: "Please enter a valid email address." });
    return;
  }

  sendJson(response, 200, { ok: true, message: "Thanks! You are subscribed." });
};
