import { format } from "date-fns";

export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getFinancialYear(date: Date): string {
  const year = date.getFullYear();
  const start = date.getMonth() >= 3 ? year : year - 1;
  return `FY ${start}-${String(start + 1).slice(-2)}`;
}

export function formatDateIN(date: Date): string {
  return format(date, "dd/MM/yyyy");
}
