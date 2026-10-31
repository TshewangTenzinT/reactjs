import { useState } from "react";
import { findBooking, formatDate, money, updateBooking } from "../utils/bookings";

export default function MyBooking() {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState(null);
  const [msg, setMsg] = useState("");

  const lookup = (e) => {
    e.preventDefault();
    const b = findBooking(ref, email);
    setBooking(b || null);
    setMsg(b ? "" : "No booking found with that reference and email.");
  };

  const cancel = () => {
    if (!window.confirm("Request cancellation of this booking?")) return;
    setBooking(updateBooking(booking.reference, { status: "cancelled", cancelledBy: "customer" }));
    setMsg("Your booking has been cancelled. Our team will contact you about any refund.");
  };

  const canCancel = booking && !["cancelled", "completed"].includes(booking.status);

  return (
    <section className="container section narrow">
      <h1>Manage my booking</h1>
      <form className="card card-body" onSubmit={lookup}>
        <div className="row">
          <label className="field">Booking reference<input placeholder="TTA-XXXXXX" value={ref} onChange={(e) => setRef(e.target.value)} required /></label>
          <label className="field">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        </div>
        <button className="btn">Find booking</button>
      </form>
      {msg && <p className="notice">{msg}</p>}
      {booking && (
        <div className="card card-body">
          <h3>{booking.tourTitle}</h3>
          <dl className="review">
            <dt>Reference</dt><dd>{booking.reference}</dd>
            <dt>Status</dt><dd><span className={`status s-${booking.status}`}>{booking.status}</span></dd>
            <dt>Dates</dt><dd>{formatDate(booking.date)} – {formatDate(booking.endDate)}</dd>
            <dt>Travellers</dt><dd>{booking.adults} adult(s){booking.children ? `, ${booking.children} child(ren)` : ""}</dd>
            <dt>Total</dt><dd>{money(booking.total)} (deposit {money(booking.deposit)})</dd>
          </dl>
          {canCancel && <button className="btn btn-danger" onClick={cancel}>Cancel booking</button>}
        </div>
      )}
    </section>
  );
}
