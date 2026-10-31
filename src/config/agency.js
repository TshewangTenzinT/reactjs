// ---------------------------------------------------------------------------
// Agency settings — edit this file to brand the website for your business.
// ---------------------------------------------------------------------------

const AGENCY = {
  name: "The Tool Travel Agents",
  shortName: "Tool Travel",
  tagline: "Handcrafted journeys through the Himalayas and beyond",
  phone: "+975 17 000 000",
  whatsapp: "97517000000", // digits only, used for wa.me links
  email: "bookings@tooltravel.example",
  address: "Norzin Lam, Thimphu, Bhutan",
  license: "Licensed Tour Operator",

  // Social media — replace with your real page URLs / handles.
  social: {
    facebook: "https://www.facebook.com/tooltravelagents",
    instagram: "https://www.instagram.com/tooltravelagents",
    instagramHandle: "@tooltravelagents",
  },

  // Booking engine settings
  currency: "USD",
  depositPercent: 30, // % payable to secure a booking
  childDiscountPercent: 50, // children (2–11) pay this % less
  groupDiscountPercent: 5, // discount when travellers >= groupDiscountMin
  groupDiscountMin: 4,
  minDaysBeforeTravel: 7, // earliest bookable date = today + N days

  addOns: [
    { id: "airport", label: "Airport pick-up & drop-off", price: 40, per: "booking" },
    { id: "insurance", label: "Travel insurance", price: 35, per: "person" },
    { id: "visa", label: "Visa / permit processing", price: 25, per: "person" },
    { id: "guide", label: "Private photography guide", price: 60, per: "booking" },
  ],

  // Staff dashboard password. This is a client-side gate only — for real
  // production use, put the dashboard behind a backend with proper auth.
  adminPassword: "admin123",

  // Optional: EmailJS (https://www.emailjs.com) to email new bookings to the
  // agency. Leave blank to disable. The template receives the booking fields.
  emailjs: {
    serviceId: "",
    templateId: "",
    publicKey: "",
  },
};

export default AGENCY;
