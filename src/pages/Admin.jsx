import { useMemo, useState } from "react";
import AGENCY from "../config/agency";
import TOURS from "../data/tours";
import {
  STATUSES, bookingsToCSV, deleteBooking, formatDate, loadBookings, money, updateBooking,
} from "../utils/bookings";

const SESSION_KEY = "tta_admin";

function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (pw === AGENCY.adminPassword) {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
      onLogin();
    } else setErr("Incorrect password");
  };
  return (
    <section className="container section narrow">
      <h1>Staff login</h1>
      <form className="card card-body" onSubmit={submit}>
        <label className="field">Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus /></label>
        {err && <p className="error">{err}</p>}
        <button className="btn">Sign in</button>
      </form>
    </section>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
  });
  const [bookings, setBookings] = useState(loadBookings);
  const [status, setStatus] = useState("");
  const [tour, setTour] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const refresh = () => setBookings(loadBookings());

  const filtered = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (!status || b.status === status) &&
          (!tour || b.tourId === tour) &&
          (!q || `${b.reference} ${b.fullName} ${b.email} ${b.phone}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [bookings, status, tour, q]
  );

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "cancelled");
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      upcoming: active.filter((b) => b.date >= today).length,
      travellers: active.reduce((s, b) => s + b.adults + b.children, 0),
      revenue: active.reduce((s, b) => s + b.total, 0),
    };
  }, [bookings]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const setStatusFor = (ref, s) => { updateBooking(ref, { status: s }); refresh(); };
  const saveNote = (ref, note) => { updateBooking(ref, { notesInternal: note }); refresh(); };
  const remove = (ref) => {
    if (window.confirm(`Delete booking ${ref} permanently?`)) { deleteBooking(ref); setOpen(null); refresh(); }
  };
  const exportCSV = () => {
    const blob = new Blob([bookingsToCSV(filtered)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const logout = () => { try { sessionStorage.removeItem(SESSION_KEY); } catch {} setAuthed(false); };

  return (
    <section className="container section">
      <div className="section-head">
        <h1>Booking dashboard</h1>
        <div className="actions">
          <button className="btn btn-ghost btn-sm" onClick={refresh}>Refresh</button>
          <button className="btn btn-sm" onClick={exportCSV}>Export CSV</button>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="stats">
        <div className="card card-body"><span className="muted small">Bookings</span><strong>{stats.total}</strong></div>
        <div className="card card-body"><span className="muted small">Awaiting confirmation</span><strong>{stats.pending}</strong></div>
        <div className="card card-body"><span className="muted small">Upcoming trips</span><strong>{stats.upcoming}</strong></div>
        <div className="card card-body"><span className="muted small">Travellers</span><strong>{stats.travellers}</strong></div>
        <div className="card card-body"><span className="muted small">Booked value</span><strong>{money(stats.revenue)}</strong></div>
      </div>

      <div className="filters">
        <input placeholder="Search name, email, ref…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={tour} onChange={(e) => setTour(e.target.value)}>
          <option value="">All tours</option>
          {TOURS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No bookings yet. New online bookings appear here.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Ref</th><th>Guest</th><th>Tour</th><th>Date</th><th>Pax</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <FragmentRow
                  key={b.reference}
                  b={b}
                  open={open === b.reference}
                  toggle={() => setOpen(open === b.reference ? null : b.reference)}
                  setStatus={setStatusFor}
                  saveNote={saveNote}
                  remove={remove}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="muted small">
        Bookings are stored in this browser. Connect a backend (see README) to share them across devices and staff.
      </p>
    </section>
  );
}

function FragmentRow({ b, open, toggle, setStatus, saveNote, remove }) {
  const [note, setNote] = useState(b.notesInternal || "");
  const wa = `https://wa.me/${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello ${b.fullName}, this is ${AGENCY.name} about your booking ${b.reference} (${b.tourTitle}).`
  )}`;
  return (
    <>
      <tr>
        <td><code>{b.reference}</code></td>
        <td>{b.fullName}<div className="muted small">{b.country}</div></td>
        <td>{b.tourTitle}</td>
        <td>{formatDate(b.date)}</td>
        <td>{b.adults + b.children}</td>
        <td>{money(b.total)}</td>
        <td>
          <select className={`status s-${b.status}`} value={b.status} onChange={(e) => setStatus(b.reference, e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </td>
        <td><button className="link" onClick={toggle}>{open ? "Hide" : "Details"}</button></td>
      </tr>
      {open && (
        <tr className="details-row">
          <td colSpan={8}>
            <div className="details-grid">
              <dl className="review">
                <dt>Email</dt><dd><a href={`mailto:${b.email}?subject=Booking ${b.reference}`}>{b.email}</a></dd>
                <dt>Phone</dt><dd><a href={wa} target="_blank" rel="noreferrer">{b.phone} (WhatsApp)</a></dd>
                <dt>Passport</dt><dd>{b.passport || "—"}</dd>
                <dt>Travellers</dt><dd>{b.adults} adult(s), {b.children} child(ren)</dd>
                <dt>Dates</dt><dd>{formatDate(b.date)} – {formatDate(b.endDate)}</dd>
                <dt>Extras</dt><dd>{b.addOns.length ? b.addOns.join(", ") : "—"}</dd>
                <dt>Payment</dt><dd>{b.paymentMethod} · deposit {money(b.deposit)}</dd>
                <dt>Requests</dt><dd>{b.requests || "—"}</dd>
                <dt>Booked</dt><dd>{new Date(b.createdAt).toLocaleString()}</dd>
              </dl>
              <div>
                <label className="field">Internal notes
                  <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
                </label>
                <div className="actions">
                  <button className="btn btn-sm" onClick={() => saveNote(b.reference, note)}>Save note</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(b.reference)}>Delete</button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
