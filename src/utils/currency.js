/**
 * Utility helper untuk pemformatan nilai mata uang Rupiah pada form input dan tampilan UI.
 */

/**
 * Format string/angka mentah menjadi string berformat titik ribuan (contoh: 5000000 -> "5.000.000")
 * Menangani respon backend berformat desimal SQL (contoh: "769000.00" -> "769.000") maupun input interaktif user.
 *
 * @param {string|number} value
 * @returns {string}
 */
export function formatRupiahInput(value) {
  if (value === null || value === undefined || value === '') return '';

  const rawString = String(value).trim();

  // 1. Tangani angka desimal dari respon database SQL / API (contoh: "769000.00" atau 769000)
  if (/^\d+\.\d+$/.test(rawString)) {
    const floatVal = Math.round(parseFloat(rawString));
    return new Intl.NumberFormat('id-ID').format(floatVal);
  }

  // 2. Tangani input ketikan user (ambil semua digit angka)
  const digits = rawString.replace(/\D/g, '');
  if (!digits) return '';

  return new Intl.NumberFormat('id-ID').format(Number(digits));
}

/**
 * Mengubah string berformat ribuan kembali menjadi angka integer murni (contoh: "5.000.000" -> 5000000)
 * @param {string|number} formattedValue
 * @returns {number}
 */
export function parseRupiahInput(formattedValue) {
  if (formattedValue === null || formattedValue === undefined || formattedValue === '') return 0;
  if (typeof formattedValue === 'number') return Math.round(formattedValue);

  const str = String(formattedValue).trim();
  if (/^\d+\.\d+$/.test(str)) {
    return Math.round(parseFloat(str));
  }

  const digits = str.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * Format angka menjadi tampilan mata uang Rupiah lengkap (contoh: 5000000 -> "Rp 5.000.000")
 * @param {string|number} value
 * @returns {string}
 */
export function formatRupiahDisplay(value) {
  if (value === null || value === undefined || value === '') return 'Rp 0';
  const num = parseRupiahInput(value);
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
}
