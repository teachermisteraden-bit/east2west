// Gregorian + Hijri (Umm al-Qura) formatting for events and confirmations.
export function formatDual(date: Date, locale: "en" | "ar") {
  const tz = "Asia/Riyadh";
  const gregorian = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
    dateStyle: "long", timeZone: tz,
  }).format(date);
  const hijri = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-islamic-umalqura-nu-latn" : "en-u-ca-islamic-umalqura", {
    dateStyle: "long", timeZone: tz,
  }).format(date);
  return { gregorian, hijri };
}
