export function checkLocalRequest(method: string, host: string | null, origin: string | null, lanAuthority?: string): string | null {
  const lanMatch = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}):\d{1,5}$/.test(lanAuthority ?? "");
  const allowedLan = lanMatch && lanAuthority === host && host!.split(":")[0].split(".").every(part => Number(part) <= 255);
  if (!host || (!/^(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(host) && !allowedLan)) return "Unexpected host";
  const port = host.split(":")[1];
  if (port && (Number(port) < 1 || Number(port) > 65535)) return "Invalid host port";
  if (["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())) return null;
  if (!origin) return "Origin required for changes";
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:" || parsed.origin !== origin || parsed.host !== host) return "Unexpected origin";
  } catch { return "Invalid origin"; }
  return null;
}
