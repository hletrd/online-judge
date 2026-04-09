export function extractLinkedFileIds(description: string): string[] {
  const matches = description.matchAll(/\/api\/v1\/files\/([A-Za-z0-9_-]+)/g);
  return [...new Set(Array.from(matches, (match) => match[1]))];
}
