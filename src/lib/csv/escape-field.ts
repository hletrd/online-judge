/**
 * Escape a field value for safe inclusion in a CSV file.
 *
 * - Prefixes values starting with `=`, `+`, `-`, `@`, tab, or carriage-return
 *   with a tab character to prevent CSV formula injection in spreadsheet apps.
 * - Wraps values containing commas, double quotes, or newlines in double quotes,
 *   escaping internal double quotes per RFC 4180.
 */
export function escapeCsvField(value: string | number | null | undefined): string {
  let str = value == null ? "" : String(value);

  // Prevent CSV injection: prefix dangerous leading characters with a tab
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "\t" + str;
  }

  // RFC 4180: wrap fields containing commas, double quotes, or newlines
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
}
