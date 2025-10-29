/**
 * Convert number to currency format
 * @param {number} amount - Angka yang ingin diformat
 * @param {string} currencyCode - Kode mata uang (misalnya: "USD", "IDR", "EUR")
 * @param {string} [locale] - (Opsional) Locale seperti "en-US" atau "id-ID"
 * @returns {string} - Angka yang sudah diformat dalam bentuk mata uang
 */
export function formatCurrency(
  amount,
  currencyCode,
  locale = getDefaultLocale(currencyCode)
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}
