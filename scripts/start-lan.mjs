import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { selectInterface, isPrivateIPv4 } from "./lan-policy.mjs";
import { createLanGateway } from "./lan-gateway.mjs";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const interfaces = networkInterfaces();
if (process.argv.includes("--info")) {
  for (const [name, entries] of Object.entries(interfaces)) {
    for (const entry of entries ?? []) if (entry.family === "IPv4" && !entry.internal && isPrivateIPv4(entry.address)) console.log(`${name}: ${entry.address} (${entry.cidr})`);
  }
  process.exit(0);
}

function port(value, fallback) {
  const result = Number(value ?? fallback);
  if (!Number.isInteger(result) || result < 1024 || result > 65535) throw new Error("Ports must be integers between 1024 and 65535");
  return result;
}

async function assertPortFree(host, port) {
  const probe = createServer();
  await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(port, host, resolve); });
  await new Promise(resolve => probe.close(resolve));
}

let backend;
let gateway;
let monitor;
let closing = false;
const docker = process.argv.includes("--docker");
let backendStarted = false;
let env;

function run(command, args, environment) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: environment, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", code => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

async function stop(code) {
  if (closing) return;
  closing = true;
  clearInterval(monitor);
  gateway?.close();
  gateway?.closeAllConnections();
  backend?.kill("SIGTERM");
  if (docker && backendStarted) {
    try { await run("docker", ["compose", "stop"], env); } catch { console.error("Stop the container with docker compose stop."); }
  }
  process.exitCode = code;
}

process.once("SIGINT", () => void stop(0));
process.once("SIGTERM", () => void stop(0));

try {
  const selected = selectInterface(interfaces, process.env.LEARNPILOT_LAN_INTERFACE);
  const publicPort = port(process.env.LEARNPILOT_LAN_PORT, 3000);
  const backendPort = port(process.env.LEARNPILOT_BACKEND_PORT, 3100);
  if (publicPort === backendPort) throw new Error("Public and backend ports must differ");
  const authority = `${selected.address}:${publicPort}`;
  await assertPortFree(selected.address, publicPort);
  await assertPortFree("127.0.0.1", backendPort);
  env = { ...process.env, NODE_ENV: "production", LEARNPILOT_LAN_AUTHORITY: authority, LEARNPILOT_BACKEND_PORT: String(backendPort), NEXT_TELEMETRY_DISABLED: "1" };
  if (docker) {
    backendStarted = true;
    await run("docker", ["compose", "up", "--build", "--wait"], env);
  } else {
    backend = spawn(process.execPath, [resolve(cwd, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(backendPort)], { cwd, env, stdio: "inherit" });
    backend.once("error", () => void stop(1));
    backend.once("exit", () => { if (!closing) { console.error("Backend stopped; closing LAN access."); void stop(1); } });
  }
  let ready = false;
  for (let attempt = 0; attempt < 60 && !closing; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${backendPort}/api/health`, { signal: AbortSignal.timeout(1000) });
      ready = response.ok && (await response.json()).mode === "synthetic_demo";
    } catch { /* Wait for the local backend only. */ }
    if (ready) break;
    await delay(500);
  }
  if (!ready || closing) throw new Error("The local backend did not become ready");
  gateway = createLanGateway({ ...selected, authority, backendPort });
  await new Promise((resolve, reject) => { gateway.once("error", reject); gateway.listen(publicPort, selected.address, resolve); });
  console.log(`LearnPilot home-network address: http://${authority}`);
  console.log(`Interface ${selected.name}, subnet /${selected.subnet.prefix}. Two selectable synthetic profiles; no login protection. Press Ctrl+C to stop.`);
  console.log("Keep router port forwarding, public tunnels and remote-access VPN routes disabled for this service.");
  monitor = setInterval(() => {
    try {
      const current = selectInterface(networkInterfaces(), selected.name);
      if (current.address !== selected.address || current.subnet.first !== selected.subnet.first || current.subnet.prefix !== selected.subnet.prefix) throw new Error("Network changed");
    } catch {
      console.error("Network interface changed. Restart LearnPilot on your home network.");
      void stop(1);
    }
  }, 3000);
} catch (error) {
  console.error(`LAN startup failed: ${error.message}`);
  await stop(1);
}
