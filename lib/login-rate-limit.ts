const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Bucket = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, Bucket>();

function prune(now: number) {
  if (attempts.size < 500) return;
  for (const [key, bucket] of attempts) {
    if (bucket.resetAt <= now) attempts.delete(key);
  }
}

export function getLoginRateLimitKey(ip: string, email: string) {
  return `${ip}::${email}`;
}

export function isLoginRateLimited(key: string) {
  const now = Date.now();
  prune(now);
  const bucket = attempts.get(key);
  if (!bucket || bucket.resetAt <= now) return false;
  return bucket.count >= MAX_ATTEMPTS;
}

export function registerLoginFailure(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  current.count += 1;
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}

export function clientIpFromHeaders(headers: Headers | Record<string, string | string[] | undefined>) {
  const read = (name: string) => {
    if (headers instanceof Headers) return headers.get(name) ?? "";
    const value = headers[name] ?? headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  };

  const forwarded = read("x-forwarded-for").split(",")[0]?.trim();
  return forwarded || read("x-real-ip").trim() || "unknown";
}
