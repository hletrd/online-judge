type HeaderCarrier = {
  get(name: string): string | null;
};

export function extractClientIp(headers: HeaderCarrier) {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip")?.trim();

  if (forwardedFor) {
    const firstForwardedIp = forwardedFor
      .split(",")
      .map((part) => part.trim())
      .find(Boolean);

    if (firstForwardedIp) {
      return firstForwardedIp;
    }
  }

  return realIp || "unknown";
}
