export function checkLocalRequest(method: string, host: string | null, origin: string | null): string | null {
  if (!host || !/^(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(host)) return "Unexpected host";
  const port = host.split(":")[1];
  if (port && (Number(port) < 1 || Number(port) > 65535)) return "Invalid host port";
  if (["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())) return null;
  if (!origin) return "Origin required for changes";
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:" || parsed.host !== host || !["localhost", "127.0.0.1"].includes(parsed.hostname)) return "Unexpected origin";
  } catch { return "Invalid origin"; }
  return null;
}
