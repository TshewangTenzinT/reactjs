import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaShieldAlt, FaUserTie, FaHeadset, FaTags } from "react-icons/fa";
import AGENCY from "../config/agency";
import TOURS, { DESTINATIONS } from "../data/tours";
import TourCard, { TourCover } from "../components/TourCard";
import { earliestDate } from "../utils/bookings";

const TESTIMONIALS = [
  { name: "Sarah, UK", text: "Every detail was handled perfectly — the Tiger's Nest hike was the highlight of our lives." },
  { name: "Kenji, Japan", text: "Booking online took five minutes and our guide was wonderful. Highly recommended!" },
  { name: "Priya, India", text: "Great value family trip. The team answered every WhatsApp message within minutes." },
];

export default function Home() {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);

  const search = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (dest) q.set("destination", dest);
    if (date) q.set("date", date);
    if (guests) q.set("guests", guests);
    navigate(`/tours?${q.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>{AGENCY.tagline}</h1>
          <p className="lead">
            Tours, treks and festivals planned by local experts. Book online in minutes with
            instant confirmation reference and flexible deposits.
          </p>
          <form className="search-bar" onSubmit={search}>
            <label>
              Destination
              <select value={dest} onChange={(e) => setDest(e.target.value)}>
                <option value="">Anywhere</option>
                {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label>
              Travel date
              <input type="date" min={earliestDate()} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Travellers
              <input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(+e.target.value)} />
            </label>
            <button className="btn" type="submit">Search tours</button>
          </form>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Popular tours</h2>
          <Link to="/tours">View all →</Link>
        </div>
        <div className="grid">
          {TOURS.slice(0, 3).map((t) => <TourCard key={t.id} tour={t} />)}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="center">Why travel with us</h2>
          <div className="features">
            <div><FaUserTie /><h4>Local experts</h4><p className="muted">Licensed guides who were born here.</p></div>
            <div><FaTags /><h4>Best value</h4><p className="muted">{AGENCY.groupDiscountPercent}% off for groups of {AGENCY.groupDiscountMin}+ and child discounts.</p></div>
            <div><FaShieldAlt /><h4>Secure booking</h4><p className="muted">Only {AGENCY.depositPercent}% deposit to hold your seats.</p></div>
            <div><FaHeadset /><h4>24/7 support</h4><p className="muted">Reach us on WhatsApp, Facebook or Instagram.</p></div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="center">What travellers say</h2>
        <div className="grid">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="card quote">
              <p>“{t.text}”</p>
              <cite>— {t.name}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section social-section">
        <div className="container">
          <h2 className="center">Follow our journeys</h2>
          <p className="center muted">
            Daily photos, special offers and traveller stories on {AGENCY.social.instagramHandle}
          </p>
          <div className="ig-grid">
            {TOURS.map((t) => (
              <a key={t.id} href={AGENCY.social.instagram} target="_blank" rel="noreferrer" className="ig-tile">
                <TourCover tour={t} />
                <span className="ig-overlay"><FaInstagram /></span>
              </a>
            ))}
          </div>
          <div className="center social-cta">
            <a className="btn btn-fb" href={AGENCY.social.facebook} target="_blank" rel="noreferrer">
              <FaFacebookF /> Like us on Facebook
            </a>
            <a className="btn btn-ig" href={AGENCY.social.instagram} target="_blank" rel="noreferrer">
              <FaInstagram /> Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="container section cta">
        <h2>Ready for your next adventure?</h2>
        <p className="muted">Pick a tour, choose your dates and secure it with a small deposit.</p>
        <Link to="/book" className="btn">Start booking</Link>
      </section>
    </>
  );
}
