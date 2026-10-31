import { useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AGENCY from "../config/agency";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${AGENCY.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="container section">
      <h1>Contact us</h1>
      <div className="contact">
        <div>
          <p className="lead">Planning something special? Talk to our travel team.</p>
          <ul className="contact-list">
            <li><FaPhoneAlt /> <a href={`tel:${AGENCY.phone.replace(/\s/g, "")}`}>{AGENCY.phone}</a></li>
            <li><FaEnvelope /> <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a></li>
            <li><FaMapMarkerAlt /> {AGENCY.address}</li>
          </ul>
          <div className="social-cta">
            <a className="btn btn-wa" href={`https://wa.me/${AGENCY.whatsapp}`} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a>
            <a className="btn btn-fb" href={AGENCY.social.facebook} target="_blank" rel="noreferrer"><FaFacebookF /> Messenger / Facebook</a>
            <a className="btn btn-ig" href={AGENCY.social.instagram} target="_blank" rel="noreferrer"><FaInstagram /> Instagram DM</a>
          </div>
        </div>
        <form className="card card-body" onSubmit={submit}>
          <label className="field">Name<input value={form.name} onChange={set("name")} required /></label>
          <label className="field">Email<input type="email" value={form.email} onChange={set("email")} required /></label>
          <label className="field">Message<textarea rows={5} value={form.message} onChange={set("message")} required /></label>
          <button className="btn">Send enquiry</button>
        </form>
      </div>
    </section>
  );
}
