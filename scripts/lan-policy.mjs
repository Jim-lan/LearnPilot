import { isIPv4 } from "node:net";

export function ipv4Number(address) {
  if (!isIPv4(address)) throw new Error("An IPv4 address is required");
  return address.split(".").reduce((value, part) => value * 256 + Number(part), 0);
}

export function isPrivateIPv4(address) {
  if (!isIPv4(address)) return false;
  const [a, b] = address.split(".").map(Number);
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

export function subnetFor(address, cidr) {
  const [interfaceAddress, bits, extra] = (cidr ?? "").split("/");
  if (extra || interfaceAddress !== address || !/^\d{1,2}$/.test(bits ?? "")) throw new Error("Missing interface subnet");
  const prefix = Number(bits);
  if (!isPrivateIPv4(address) || prefix < 16 || prefix > 30) throw new Error("Choose a private home-network IPv4 subnet (/16–/30)");
  const size = 2 ** (32 - prefix);
  const first = Math.floor(ipv4Number(address) / size) * size;
  return { first, last: first + size - 1, prefix };
}

export function selectInterface(interfaces, requested) {
  const candidates = Object.entries(interfaces).flatMap(([name, entries]) =>
    (entries ?? []).filter(entry => entry.family === "IPv4" && !entry.internal && isPrivateIPv4(entry.address))
      .map(entry => ({ ...entry, name })));
  const selected = requested ? candidates.filter(entry => entry.name === requested) : candidates;
  if (selected.length !== 1) throw new Error("Select one home Wi-Fi interface with LEARNPILOT_LAN_INTERFACE (run npm run lan:info)");
  const entry = selected[0];
  return { name: entry.name, address: entry.address, subnet: subnetFor(entry.address, entry.cidr) };
}

export function allowsPeer(remoteAddress, subnet) {
  const address = remoteAddress?.replace(/^::ffff:/, "");
  if (!isPrivateIPv4(address)) return false;
  const value = ipv4Number(address);
  return value > subnet.first && value < subnet.last;
}

export function checkLanRequest({ peer, method, host, origin, target }, config) {
  if (!allowsPeer(peer, config.subnet)) return "This device is outside the selected local network";
  if (host !== config.authority) return "Unexpected host";
  // Only origin-form requests: this server is never an open forward proxy.
  if (!target?.startsWith("/") || target.startsWith("//")) return "Unexpected request target";
  if (!["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase()) && origin !== `http://${config.authority}`) return "Unexpected origin";
  return null;
}
