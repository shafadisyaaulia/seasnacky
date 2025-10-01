export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCurrency(value: number, currency: string = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export function generateOrderCode(prefix = "INV") {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  const time = Date.now().toString().slice(-5);
  return `${prefix}-${time}-${random}`;
}

export function ensureArray<T>(value: T | T[] | undefined) {
  if (!value) return [] as T[];
  return Array.isArray(value) ? value : [value];
}
