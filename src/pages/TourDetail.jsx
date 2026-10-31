import { Link, useParams } from "react-router-dom";
import { FaCheck, FaClock, FaUsers, FaStar, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { getTour } from "../data/tours";
import { TourCover } from "../components/TourCard";
import AGENCY from "../config/agency";
import { money } from "../utils/bookings";

export default function TourDetail() {
  const { id } = useParams();
  const tour = getTour(id);

  if (!tour) {
    return (
      <section className="container section empty">
        Tour not found. <Link to="/tours">Browse all tours</Link>
      </section>
    );
  }

  const url = window.location.href;
  const shareFb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const shareWa = `https://wa.me/?text=${encodeURIComponent(`${tour.title} — ${url}`)}`;

  return (
    <section className="container section">
      <TourCover tour={tour} className="cover-lg" />
      <div className="detail">
        <div>
          <div className="tags">
            <span className="tag">{tour.destination}</span>
            <span className="tag tag-alt">{tour.category}</span>
          </div>
          <h1>{tour.title}</h1>
          <div className="meta">
            <span><FaClock /> {tour.days} days</span>
            <span><FaUsers /> max {tour.maxGroup} travellers</span>
            <span><FaStar className="star" /> {tour.rating}</span>
          </div>
          <p className="lead">{tour.summary}</p>

          <h3>Highlights</h3>
          <ul className="checks">
            {tour.highlights.map((h) => <li key={h}><FaCheck /> {h}</li>)}
          </ul>

          <h3>Itinerary</h3>
          <ol className="itinerary">
            {tour.itinerary.map((d, i) => (
              <li key={i}><strong>Day {i + 1}</strong> {d}</li>
            ))}
          </ol>

          <h3>What's included</h3>
          <ul className="checks">
            {tour.includes.map((h) => <li key={h}><FaCheck /> {h}</li>)}
          </ul>
        </div>

        <aside className="card sticky">
          <div className="card-body">
            <span className="muted small">from</span>
            <div className="price big">{money(tour.price)}<span className="muted small"> /person</span></div>
            <p className="muted small">
              Children 2–11 save {AGENCY.childDiscountPercent}%. Groups of {AGENCY.groupDiscountMin}+ save{" "}
              {AGENCY.groupDiscountPercent}%. Secure with a {AGENCY.depositPercent}% deposit.
            </p>
            <Link to={`/book?tour=${tour.id}`} className="btn btn-block">Check availability & book</Link>
            <div className="share">
              <span className="muted small">Share:</span>
              <a href={shareFb} target="_blank" rel="noreferrer" className="fb" aria-label="Share on Facebook"><FaFacebookF /></a>
              <a href={shareWa} target="_blank" rel="noreferrer" className="wa" aria-label="Share on WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
