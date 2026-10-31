# The Tool Travel Agents — Website & Booking Engine

A React website for running a travel agency: tour catalogue, an online booking engine,
a customer "manage my booking" page, a staff dashboard for handling bookings, and
Facebook / Instagram / WhatsApp integration throughout.

## Features

- **Home page** — hero search (destination, date, travellers), popular tours, testimonials,
  Instagram-style gallery and Facebook / Instagram follow buttons.
- **Tours** — filter by destination, style, budget and group size; sort by rating, price or length.
- **Tour detail** — highlights, day-by-day itinerary, inclusions, "share on Facebook / WhatsApp".
- **Booking engine** (`/book`) — 4 steps: trip → travellers → payment → review.
  - Live seat availability per tour and date (respects each tour's `maxGroup`)
  - Child discount, group discount, optional add-ons, deposit calculation
  - Booking reference (e.g. `TTA-7KQ2MX`), printable confirmation, WhatsApp follow-up
  - Optional email notification to the agency via EmailJS
- **My Booking** (`/my-booking`) — customers look up a booking with reference + email and can cancel.
- **Staff dashboard** (`/admin`) — stats, search/filter, change status
  (pending → confirmed → paid → completed / cancelled), internal notes, one-click email
  and WhatsApp to the guest, CSV export.

## Customising

| What | Where |
| --- | --- |
| Agency name, phone, email, address | `src/config/agency.js` |
| **Facebook & Instagram links** | `src/config/agency.js` → `social` |
| Currency, deposit %, discounts, add-ons | `src/config/agency.js` |
| Staff password | `src/config/agency.js` → `adminPassword` |
| Tours, prices, itineraries, photos | `src/data/tours.js` (put photos in `public/images/`) |
| Colours & styling | `src/App.css` (`:root` variables) |
| How shared links look on Facebook | `public/index.html` (Open Graph tags) |

### Email notifications for new bookings
Create a free [EmailJS](https://www.emailjs.com) account, add a service + template, and fill in
`emailjs.serviceId`, `templateId` and `publicKey` in `src/config/agency.js`.

## Important: where bookings are stored
Bookings are saved in the **browser's localStorage**, so the site works on free static hosting
with no server. That means the staff dashboard only shows bookings made in the same browser —
fine for demos and testing. For live operation, replace the functions in `src/utils/bookings.js`
(`loadBookings`, `createBooking`, `updateBooking`, …) with calls to a backend
(e.g. Firebase/Firestore, Supabase, or your own API), and protect `/admin` with real login —
the current password check is client-side only.

## Running

```bash
npm install
npm start        # development server on http://localhost:3000
npm run build    # production build in /build
npm run deploy   # publish to GitHub Pages
```

## Facebook & Instagram tips
- Add the website URL to your Facebook Page "Book Now" button and Instagram bio.
- Link directly to a tour: `https://YOUR-SITE/#/tours/bhutan-cultural-7d`
- Link straight into booking a tour: `https://YOUR-SITE/#/book?tour=bhutan-cultural-7d`
