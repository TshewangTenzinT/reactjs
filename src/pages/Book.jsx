import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import AGENCY from "../config/agency";
import TOURS, { getTour } from "../data/tours";
import {
  calculatePrice, createBooking, earliestDate, formatDate, money, seatsLeft, addDays, toISODate,
} from "../utils/bookings";

const STEPS = ["Trip", "Travellers", "Payment", "Review"];

const PAYMENT_METHODS = [
  { id: "bank", label: "Bank transfer", note: "We email bank details with your confirmation." },
  { id: "card", label: "Card payment link", note: "A secure payment link is sent by our team." },
  { id: "cash", label: "Pay on arrival (local guests)", note: "Deposit may still be requested." },
];

function notifyAgency(booking) {
  const { serviceId, templateId, publicKey } = AGENCY.emailjs;
  if (!serviceId || !templateId || !publicKey) return;
  emailjs
    .send(serviceId, templateId, {
      ...booking,
      addOns: booking.addOns.join(", "),
      total: money(booking.total),
      deposit: money(booking.deposit),
    }, publicKey)
    .catch(() => {});
}

export default function Book() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialTour = getTour(params.get("tour")) ? params.get("tour") : TOURS[0].id;
  const minDate = earliestDate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tourId: initialTour,
    date: params.get("date") && params.get("date") >= minDate ? params.get("date") : minDate,
    adults: Math.max(1, Number(params.get("guests")) || 2),
    children: 0,
    addOns: [],
    fullName: "",
    email: "",
    phone: "",
    country: "",
    passport: "",
    requests: "",
    paymentMethod: "bank",
    agree: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const tour = getTour(form.tourId);
  const price = useMemo(() => calculatePrice(form), [form]);
  const left = seatsLeft(form.tourId, form.date);
  const travellers = form.adults + form.children;

  const toggleAddOn = (id) =>
    set("addOns", form.addOns.includes(id) ? form.addOns.filter((a) => a !== id) : [...form.addOns, id]);

  const validate = () => {
    if (step === 0) {
      if (!form.date || form.date < minDate) return `Earliest travel date is ${formatDate(minDate)}.`;
      if (form.adults < 1) return "At least one adult is required.";
      if (travellers > left) return left === 0 ? "This date is fully booked — please pick another." : `Only ${left} seat(s) left on this date.`;
    }
    if (step === 1) {
      if (!form.fullName.trim()) return "Please enter the lead traveller's full name.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
      if (form.phone.replace(/\D/g, "").length < 7) return "Please enter a valid phone / WhatsApp number.";
      if (!form.country.trim()) return "Please enter your country.";
    }
    if (step === 3 && !form.agree) return "Please accept the booking terms.";
    return "";
  };

  const next = () => {
    const err = validate();
    setError(err);
    if (err) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }
    try {
      const { agree, ...data } = form;
      const booking = createBooking(data);
      notifyAgency(booking);
      navigate(`/confirmation/${booking.reference}`, { state: { booking } });
    } catch (e) {
      setError(e.message);
      setStep(0);
    }
  };

  const back = () => { setError(""); setStep(step - 1); };

  return (
    <section className="container section">
      <h1>Book your trip</h1>
      <ol className="stepper">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "active" : i < step ? "done" : ""}>
            <span>{i + 1}</span> {s}
          </li>
        ))}
      </ol>

      <div className="booking">
        <div className="card card-body">
          {step === 0 && (
            <>
              <label className="field">
                Tour package
                <select value={form.tourId} onChange={(e) => set("tourId", e.target.value)}>
                  {TOURS.map((t) => (
                    <option key={t.id} value={t.id}>{t.title} — {t.days} days — {money(t.price)}</option>
                  ))}
                </select>
              </label>
              <div className="row">
                <label className="field">
                  Start date
                  <input type="date" min={minDate} value={form.date} onChange={(e) => set("date", e.target.value)} />
                </label>
                <div className="field">
                  Ends
                  <div className="static">{form.date && formatDate(toISODate(addDays(form.date + "T00:00:00", tour.days - 1)))}</div>
                </div>
              </div>
              <div className="row">
                <label className="field">
                  Adults (12+)
                  <input type="number" min={1} max={tour.maxGroup} value={form.adults} onChange={(e) => set("adults", Math.max(0, +e.target.value))} />
                </label>
                <label className="field">
                  Children (2–11)
                  <input type="number" min={0} max={tour.maxGroup} value={form.children} onChange={(e) => set("children", Math.max(0, +e.target.value))} />
                </label>
              </div>
              <p className={`availability ${travellers > left ? "bad" : "ok"}`}>
                {left === 0 ? "Fully booked on this date" : `${left} of ${tour.maxGroup} seats available on ${formatDate(form.date)}`}
              </p>
              <h3>Optional extras</h3>
              <div className="addons">
                {AGENCY.addOns.map((a) => (
                  <label key={a.id} className={`addon ${form.addOns.includes(a.id) ? "on" : ""}`}>
                    <input type="checkbox" checked={form.addOns.includes(a.id)} onChange={() => toggleAddOn(a.id)} />
                    <span>{a.label}</span>
                    <span className="muted small">{money(a.price)} / {a.per}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h3>Lead traveller</h3>
              <div className="row">
                <label className="field">Full name *<input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} /></label>
                <label className="field">Email *<input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></label>
              </div>
              <div className="row">
                <label className="field">Phone / WhatsApp *<input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></label>
                <label className="field">Country *<input value={form.country} onChange={(e) => set("country", e.target.value)} /></label>
              </div>
              <label className="field">Passport number (optional, needed for permits)<input value={form.passport} onChange={(e) => set("passport", e.target.value)} /></label>
              <label className="field">Special requests (diet, rooms, accessibility…)
                <textarea rows={4} value={form.requests} onChange={(e) => set("requests", e.target.value)} />
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <h3>How would you like to pay?</h3>
              <p className="muted">
                Pay a {AGENCY.depositPercent}% deposit of <strong>{money(price.deposit)}</strong> to secure your
                seats. The balance of {money(price.balance)} is due before departure.
              </p>
              <div className="addons">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.id} className={`addon ${form.paymentMethod === m.id ? "on" : ""}`}>
                    <input type="radio" name="pay" checked={form.paymentMethod === m.id} onChange={() => set("paymentMethod", m.id)} />
                    <span>{m.label}</span>
                    <span className="muted small">{m.note}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Review your booking</h3>
              <dl className="review">
                <dt>Tour</dt><dd>{tour.title}</dd>
                <dt>Dates</dt><dd>{formatDate(form.date)} – {formatDate(toISODate(addDays(form.date + "T00:00:00", tour.days - 1)))}</dd>
                <dt>Travellers</dt><dd>{form.adults} adult(s){form.children ? `, ${form.children} child(ren)` : ""}</dd>
                <dt>Lead traveller</dt><dd>{form.fullName} · {form.email} · {form.phone}</dd>
                <dt>Country</dt><dd>{form.country}</dd>
                <dt>Payment</dt><dd>{PAYMENT_METHODS.find((m) => m.id === form.paymentMethod).label}</dd>
                {form.requests && (<><dt>Requests</dt><dd>{form.requests}</dd></>)}
              </dl>
              <label className="agree">
                <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} />
                I agree to the booking terms. Deposits are refundable up to 30 days before departure.
              </label>
            </>
          )}

          {error && <p className="error">{error}</p>}

          <div className="actions">
            {step > 0 && <button className="btn btn-ghost" onClick={back}>Back</button>}
            <button className="btn" onClick={next}>
              {step === STEPS.length - 1 ? "Confirm booking" : "Continue"}
            </button>
          </div>
        </div>

        <aside className="card card-body summary">
          <h3>{tour.title}</h3>
          <p className="muted small">{tour.days} days · {tour.destination}</p>
          <table>
            <tbody>
              <tr><td>{form.adults} × adult</td><td>{money(price.adultTotal)}</td></tr>
              {form.children > 0 && <tr><td>{form.children} × child</td><td>{money(price.childTotal)}</td></tr>}
              {price.addOnLines.map((a) => <tr key={a.id}><td>{a.label}</td><td>{money(a.total)}</td></tr>)}
              {price.groupDiscount > 0 && <tr className="discount"><td>Group discount</td><td>−{money(price.groupDiscount)}</td></tr>}
              <tr className="total"><td>Total</td><td>{money(price.total)}</td></tr>
              <tr><td>Deposit due now ({AGENCY.depositPercent}%)</td><td>{money(price.deposit)}</td></tr>
            </tbody>
          </table>
        </aside>
      </div>
    </section>
  );
}
