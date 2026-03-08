/**
 * Wrapper around fetch() that adds the required X-Requested-With header
 * for CSRF protection on all requests.
 */
export function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);

  if (!headers.has("X-Requested-With")) {
    headers.set("X-Requested-With", "XMLHttpRequest");
  }

  return fetch(input, { ...init, headers });
}
