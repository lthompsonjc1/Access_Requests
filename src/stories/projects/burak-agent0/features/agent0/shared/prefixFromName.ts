/** Suggested MCP tool prefix from a display name (max 8 chars). */
export function generatePrefixFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 8);
  }
  const word = words[0] ?? '';
  const slice = word.slice(0, 3);
  if (!slice) return '';
  return (slice.charAt(0).toUpperCase() + slice.slice(1).toLowerCase()).slice(0, 8);
}

/** Mock edit: derive prefix from server slug when no dedicated prefix field exists */
export function prefixFromServerSlug(slug: string): string {
  const s = slug.replace(/[^a-zA-Z0-9]/g, '');
  return s.slice(0, 8).toUpperCase();
}
