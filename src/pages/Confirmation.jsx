import { Link, useLocation, useParams } from "react-router-dom";
import { FaCheckCircle, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import AGENCY from "../config/agency";
import { loadBookings, money, formatDate } from "../utils/bookings";

export default function Confirmation() {
  const { reference } = useParams();
  const { state } = useLocation();
  const booking = state?.booking || loadBookings().find((b) => b.reference === reference);

  if (!booking) {
    return (
      <section className="container section empty">
        Booking not found. <Link to="/my-booking">Look up a booking</Link>
      </section>
    );
  }

  const waText = encodeURIComponent(
    `Hello ${AGENCY.name}, I just booked ${booking.tourTitle} (ref ${booking.reference}) for ${formatDate(booking.date)}.`
  );

  return (
    <section className="container section narrow center">
      <FaCheckCircle className="success-icon" />
      <h1>Booking received!</h1>
      <p className="lead">
        Thank you, {booking.fullName.split(" ")[0]}. Your reference is
      </p>
      <div className="ref">{booking.reference}</div>
      <p className="muted">
        Keep this reference — use it with your email on the “My Booking” page. Our team will contact you
        at {booking.email} within 24 hours with payment instructions for your deposit of{" "}
        <strong>{money(booking.deposit)}</strong>.
      </p>
      <div className="card card-body left">
        <dl className="review">
          <dt>Tour</dt><dd>{booking.tourTitle}</dd>
          <dt>Dates</dt><dd>{formatDate(booking.date)} – {formatDate(booking.endDate)}</dd>
          <dt>Travellers</dt><dd>{booking.adults} adult(s){booking.children ? `, ${booking.children} child(ren)` : ""}</dd>
          <dt>Total</dt><dd>{money(booking.total)}</dd>
          <dt>Status</dt><dd><span className={`status s-${booking.status}`}>{booking.status}</span></dd>
        </dl>
      </div>
      <div className="social-cta">
        <a className="btn btn-wa" href={`https://wa.me/${AGENCY.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer"><FaWhatsapp /> Message us on WhatsApp</a>
        <a className="btn btn-fb" href={AGENCY.social.facebook} target="_blank" rel="noreferrer"><FaFacebookF /> Facebook</a>
        <a className="btn btn-ig" href={AGENCY.social.instagram} target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a>
      </div>
      <button className="btn btn-ghost" onClick={() => window.print()}>Print / save as PDF</button>
    </section>
  );
}
