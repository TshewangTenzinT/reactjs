import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaBars, FaTimes, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AGENCY from "../config/agency";

export function SocialLinks({ size = "md" }) {
  return (
    <div className={`social social-${size}`}>
      <a href={AGENCY.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="fb">
        <FaFacebookF />
      </a>
      <a href={AGENCY.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="ig">
        <FaInstagram />
      </a>
      <a href={`https://wa.me/${AGENCY.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="wa">
        <FaWhatsapp />
      </a>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">✈</span> {AGENCY.name}
        </Link>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/tours" onClick={close}>Tours</NavLink>
          <NavLink to="/my-booking" onClick={close}>My Booking</NavLink>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
          <Link to="/book" className="btn btn-sm" onClick={close}>Book Now</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>{AGENCY.name}</h3>
          <p className="muted">{AGENCY.tagline}</p>
          <p className="muted small">{AGENCY.license}</p>
          <SocialLinks />
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/tours">All tours</Link>
          <Link to="/book">Book a trip</Link>
          <Link to="/my-booking">Manage booking</Link>
          <Link to="/admin">Staff login</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`tel:${AGENCY.phone.replace(/\s/g, "")}`}><FaPhoneAlt /> {AGENCY.phone}</a>
          <a href={`mailto:${AGENCY.email}`}><FaEnvelope /> {AGENCY.email}</a>
          <span><FaMapMarkerAlt /> {AGENCY.address}</span>
        </div>
        <div>
          <h4>Follow us</h4>
          <a href={AGENCY.social.facebook} target="_blank" rel="noreferrer"><FaFacebookF /> Facebook</a>
          <a href={AGENCY.social.instagram} target="_blank" rel="noreferrer"><FaInstagram /> Instagram {AGENCY.social.instagramHandle}</a>
        </div>
      </div>
      <div className="container footer-bottom muted small">
        © {new Date().getFullYear()} {AGENCY.name}. All rights reserved.
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <a className="wa-float" href={`https://wa.me/${AGENCY.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <FaWhatsapp />
      </a>
    </>
  );
}
