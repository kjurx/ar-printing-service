export const BUSINESS = {
  name: "AR. Printing Service & Gift Gallery",
  short: "AR.",
  sub: "✛ Print & Gift Studio",
  phone: "+917999865547",
  phoneDisplay: "7999865547",
  location: "Bagicha, Jashpur",
  instagram: "https://instagram.com/ar_printing_service",
  instagramHandle: "@ar_printing_service",
};

export function whatsappDigits(settings?: Record<string, string>): string {
  const raw = settings?.whatsapp || settings?.phone || BUSINESS.phone;
  return raw.replace(/[^0-9]/g, "");
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
}

export const WA_QUERIES = {
  general: "Hi! I am interested in your printing services.",
  order: "Hi! I want to order a custom print.",
  bulk: "Hi! I want bulk order pricing.",
};