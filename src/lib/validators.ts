export function normalizePhone(input: string) {
  return input.replace(/\s+/g, "").trim();
}

export function isValidTurkishPhone(phone: string) {
  const p = normalizePhone(phone);
  // Accept: 05XXXXXXXXX or +905XXXXXXXXX
  if (/^05\d{9}$/.test(p)) return true;
  if (/^\+905\d{9}$/.test(p)) return true;
  return false;
}

export function isValidTimeSlot(t: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}
