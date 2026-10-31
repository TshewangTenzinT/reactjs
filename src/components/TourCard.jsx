import { Link } from "react-router-dom";
import { FaStar, FaClock, FaUsers } from "react-icons/fa";
import { money } from "../utils/bookings";

export function TourCover({ tour, className = "" }) {
  const style = tour.image
    ? { backgroundImage: `url(${tour.image})` }
    : { backgroundImage: `linear-gradient(135deg, ${tour.color[0]}, ${tour.color[1]})` };
  return (
    <div className={`cover ${className}`} style={style}>
      {!tour.image && <span className="cover-label">{tour.destination}</span>}
    </div>
  );
}

export default function TourCard({ tour }) {
  return (
    <article className="card tour-card">
      <Link to={`/tours/${tour.id}`}>
        <TourCover tour={tour} />
      </Link>
      <div className="card-body">
        <div className="tags">
          <span className="tag">{tour.destination}</span>
          <span className="tag tag-alt">{tour.category}</span>
        </div>
        <h3><Link to={`/tours/${tour.id}`}>{tour.title}</Link></h3>
        <p className="muted">{tour.summary}</p>
        <div className="meta">
          <span><FaClock /> {tour.days} days</span>
          <span><FaUsers /> max {tour.maxGroup}</span>
          <span><FaStar className="star" /> {tour.rating}</span>
        </div>
        <div className="card-foot">
          <div>
            <span className="muted small">from</span>
            <div className="price">{money(tour.price)}<span className="muted small"> /person</span></div>
          </div>
          <Link to={`/book?tour=${tour.id}`} className="btn btn-sm">Book</Link>
        </div>
      </div>
    </article>
  );
}
