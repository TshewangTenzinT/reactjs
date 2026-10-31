import AGENCY from "../config/agency";
import { getTour } from "../data/tours";

// Bookings are stored in the browser (localStorage) so the site works with no
// backend. Swap these functions for API calls when you add a server.
const KEY = "tta_bookings_v1";

export const STATUSES = ["pending", "confirmed", "paid", "completed", "cancelled"];

export function loadBookings() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `TTA-${s}`;
}

export function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: AGENCY.currency,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function toISODate(d) {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${x.getFullYear()}-${m}-${day}`;
}

export function earliestDate() {
  return toISODate(addDays(new Date(), AGENCY.minDaysBeforeTravel));
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Seats already taken on a given tour + date (cancelled bookings ignored).
export function seatsTaken(tourId, date, excludeRef) {
  return loadBookings()
    .filter(
      (b) =>
        b.tourId === tourId &&
        b.date === date &&
        b.status !== "cancelled" &&
        b.reference !== excludeRef
    )
    .reduce((sum, b) => sum + b.adults + b.children, 0);
}

export function seatsLeft(tourId, date) {
  const tour = getTour(tourId);
  if (!tour) return 0;
  return Math.max(0, tour.maxGroup - seatsTaken(tourId, date));
}

export function calculatePrice({ tourId, adults = 1, children = 0, addOns = [] }) {
  const tour = getTour(tourId);
  if (!tour) return null;
  const travellers = adults + children;
  const adultTotal = tour.price * adults;
  const childUnit = tour.price * (1 - AGENCY.childDiscountPercent / 100);
  const childTotal = childUnit * children;
  const base = adultTotal + childTotal;

  const addOnLines = AGENCY.addOns
    .filter((a) => addOns.includes(a.id))
    .map((a) => ({
      ...a,
      total: a.per === "person" ? a.price * travellers : a.price,
    }));
  const addOnTotal = addOnLines.reduce((s, a) => s + a.total, 0);

  const groupDiscount =
    travellers >= AGENCY.groupDiscountMin
      ? Math.round((base * AGENCY.groupDiscountPercent) / 100)
      : 0;

  const total = Math.round(base + addOnTotal - groupDiscount);
  const deposit = Math.round((total * AGENCY.depositPercent) / 100);

  return {
    adultTotal,
    childUnit,
    childTotal,
    addOnLines,
    addOnTotal,
    groupDiscount,
    total,
    deposit,
    balance: total - deposit,
  };
}

export function createBooking(data) {
  const tour = getTour(data.tourId);
  const price = calculatePrice(data);
  const left = seatsLeft(data.tourId, data.date);
  const travellers = data.adults + data.children;
  if (travellers > left) {
    throw new Error(
      left === 0
        ? "Sorry, this departure is fully booked. Please choose another date."
        : `Only ${left} seat(s) left on this date.`
    );
  }
  const booking = {
    ...data,
    reference: makeReference(),
    tourTitle: tour.title,
    endDate: toISODate(addDays(data.date + "T00:00:00", tour.days - 1)),
    total: price.total,
    deposit: price.deposit,
    status: "pending",
    createdAt: new Date().toISOString(),
    notesInternal: "",
  };
  saveBookings([booking, ...loadBookings()]);
  return booking;
}

export function findBooking(reference, email) {
  const ref = (reference || "").trim().toUpperCase();
  const mail = (email || "").trim().toLowerCase();
  return loadBookings().find(
    (b) => b.reference === ref && b.email.toLowerCase() === mail
  );
}

export function updateBooking(reference, patch) {
  const list = loadBookings().map((b) =>
    b.reference === reference ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b
  );
  saveBookings(list);
  return list.find((b) => b.reference === reference);
}

export function deleteBooking(reference) {
  saveBookings(loadBookings().filter((b) => b.reference !== reference));
}

export function bookingsToCSV(list) {
  const cols = [
    "reference", "status", "tourTitle", "date", "endDate", "adults", "children",
    "fullName", "email", "phone", "country", "total", "deposit", "paymentMethod",
    "addOns", "requests", "createdAt",
  ];
  const esc = (v) => `"${String(Array.isArray(v) ? v.join("; ") : v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...list.map((b) => cols.map((c) => esc(b[c])).join(","))].join("\n");
}
