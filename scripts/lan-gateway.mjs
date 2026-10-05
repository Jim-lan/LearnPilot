import { createServer, request } from "node:http";
import { checkLanRequest } from "./lan-policy.mjs";

export function createLanGateway(config) {
  const server = createServer((incoming, outgoing) => {
    const problem = checkLanRequest({ peer: incoming.socket.remoteAddress, method: incoming.method ?? "GET", host: incoming.headers.host,
      origin: incoming.headers.origin, target: incoming.url }, config);
    if (problem) {
      outgoing.writeHead(403, { "Cache-Control": "private, no-store", "Content-Type": "text/plain" });
      outgoing.end(problem);
      return;
    }
    const headers = { ...incoming.headers };
    // The socket is the network boundary. Client-supplied forwarding headers cannot override it.
    for (const key of Object.keys(headers)) {
      if (key === "forwarded" || key.startsWith("x-forwarded-") || key === "x-real-ip" || key === "connection" || key === "upgrade") delete headers[key];
    }
    headers.host = config.authority;
    headers["x-forwarded-proto"] = "http";
    const upstream = request({ hostname: "127.0.0.1", port: config.backendPort, path: incoming.url,
      method: incoming.method, headers }, response => {
      outgoing.writeHead(response.statusCode ?? 502, { ...response.headers, "cache-control": "private, no-store" });
      response.pipe(outgoing);
    });
    upstream.setTimeout(30_000, () => upstream.destroy());
    upstream.on("error", () => {
      if (!outgoing.headersSent) outgoing.writeHead(502, { "Cache-Control": "private, no-store", "Content-Type": "text/plain" });
      outgoing.end("LearnPilot is unavailable. Restart the local server.");
    });
    incoming.on("aborted", () => upstream.destroy());
    outgoing.on("close", () => { if (!outgoing.writableFinished) upstream.destroy(); });
    incoming.pipe(upstream);
  });
  server.on("upgrade", (_req, socket) => socket.destroy());
  server.on("connect", (_req, socket) => socket.destroy());
  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;
  return server;
}
