const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "PLN",
});

export function formatCurrency(value: string | number) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isNaN(amount) ? String(value) : currencyFormatter.format(amount);
}
