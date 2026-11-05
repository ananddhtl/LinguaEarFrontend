const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const dateTime = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const formatDate = (iso: string | null) => (iso ? date.format(new Date(iso)) : "–");
export const formatDateTime = (iso: string | null) => (iso ? dateTime.format(new Date(iso)) : "Never");

export const TYPE_LABEL: Record<string, string> = {
  admin: "Admin",
  pro: "Pro",
  standard: "Standard",
  trial: "Trial",
  expired: "Expired",
};
