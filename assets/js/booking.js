// Shared booking state (sessionStorage) and property data.
// Ported 1:1 from the original src/lib/booking-context.tsx + src/lib/properties.ts.

const STORAGE_KEY = "fnab-booking";

const DEFAULT_BOOKING = {
  checkIn: "2026-12-12",
  checkOut: "2026-12-17",
  adults: 1,
  children: 0,
  propertyId: "helsinki-kallio",
  packageTier: null,
};

// Trip packages (properties.html). A package is an add-on tier the user picks
// before choosing a destination — its price is added on top of the chosen
// destination's nightly total at checkout, not a bookable stay on its own.
const packages = [
  {
    id: "basic",
    name: "Basic",
    price: 150,
    tagline: "Cozy essentials for a simple northern escape.",
    image: "assets/img/spruce-cabin.jpg",
    alt: "Warm timber cabin surrounded by snow-covered spruce trees at dusk",
  },
  {
    id: "medium",
    name: "Medium",
    price: 300,
    tagline: "Elevated comfort with modern design touches.",
    image: "assets/img/timber-hideaway.jpg",
    alt: "Modern timber hideaway with floor-to-ceiling windows in a Finnish forest",
  },
  {
    id: "premium",
    name: "Premium",
    price: 500,
    tagline: "The full aurora-glass experience, top to bottom.",
    image: "assets/img/aurora-igloo.jpg",
    alt: "Glass igloo glowing beneath the northern lights in a snowy Finnish forest",
  },
];

function getPackage(id) {
  return packages.find((pkg) => pkg.id === id) ?? null;
}

// City destinations (destinations.html gallery). Selecting one books it the
// same way as a curated property — both are resolved through getProperty().
const destinations = [
  { id: "helsinki-kallio", category: "helsinki", city: "Helsinki", area: "Kallio", price: 185, image: "assets/img/destinations/helsinki-kallio.jpg" },
  { id: "helsinki-kamppi", category: "helsinki", city: "Helsinki", area: "Kamppi", price: 245, image: "assets/img/destinations/helsinki-kamppi.jpg" },
  { id: "helsinki-katajanokka", category: "helsinki", city: "Helsinki", area: "Katajanokka", price: 310, image: "assets/img/destinations/helsinki-katajanokka.jpg" },
  { id: "helsinki-punavuori", category: "helsinki", city: "Helsinki", area: "Punavuori", price: 225, image: "assets/img/destinations/helsinki-punavuori.jpg" },
  { id: "helsinki-suomenlinna", category: "helsinki", city: "Helsinki", area: "Suomenlinna", price: 275, image: "assets/img/destinations/helsinki-suomenlinna.jpg" },
  { id: "helsinki-toolo", category: "helsinki", city: "Helsinki", area: "Töölö", price: 195, image: "assets/img/destinations/helsinki-toolo.jpg" },

  { id: "jyvaskyla-kuokkala", category: "jyvaskyla", city: "Jyväskylä", area: "Kuokkala", price: 160, image: "assets/img/destinations/jyvaskyla-kuokkala.jpg" },
  { id: "jyvaskyla-lutakko", category: "jyvaskyla", city: "Jyväskylä", area: "Lutakko", price: 190, image: "assets/img/destinations/jyvaskyla-lutakko.jpg" },

  { id: "oulu-nallikari", category: "oulu", city: "Oulu", area: "Nallikari", price: 205, image: "assets/img/destinations/oulu-nallikari.jpg" },
  { id: "oulu-hietasaari", category: "oulu", city: "Oulu", area: "Hietasaari", price: 175, image: "assets/img/destinations/oulu-hietasaari.jpg" },
  { id: "oulu-tuira", category: "oulu", city: "Oulu", area: "Tuira", price: 165, image: "assets/img/destinations/oulu-tuira.jpg" },

  { id: "turku-port-of-turku", category: "turku", city: "Turku", area: "Port of Turku", price: 220, image: "assets/img/destinations/turku-port-of-turku.jpg" },
  { id: "turku-ruissalo", category: "turku", city: "Turku", area: "Ruissalo", price: 250, image: "assets/img/destinations/turku-ruissalo.jpg" },
  { id: "turku-kakola", category: "turku", city: "Turku", area: "Kakola", price: 230, image: "assets/img/destinations/turku-kakola.jpg" },

  { id: "northern-lights-inari", category: "northern-lights", city: "Inari", area: "Lake Inari wilderness", price: 480, image: "assets/img/destinations/northern-lights-inari.jpg" },
  { id: "northern-lights-ivalo", category: "northern-lights", city: "Ivalo", area: "Away from the lights", price: 395, image: "assets/img/destinations/northern-lights-ivalo.jpg" },
  { id: "northern-lights-kemi", category: "northern-lights", city: "Kemi", area: "Coastal Lapland", price: 420, image: "assets/img/destinations/northern-lights-kemi.jpg" },
  { id: "northern-lights-kilpisjarvi", category: "northern-lights", city: "Kilpisjärvi", area: "Fell landscapes, dark skies", price: 560, image: "assets/img/destinations/northern-lights-kilpisjarvi.jpg" },
  { id: "northern-lights-levi", category: "northern-lights", city: "Levi", area: "Kätkä fell outskirts", price: 510, image: "assets/img/destinations/northern-lights-levi.jpg" },
  { id: "northern-lights-muonio", category: "northern-lights", city: "Muonio", area: "Pallas–Yllästunturi", price: 445, image: "assets/img/destinations/northern-lights-muonio.jpg" },
  { id: "northern-lights-rovaniemi", category: "northern-lights", city: "Rovaniemi", area: "Ounasvaara", price: 465, image: "assets/img/destinations/northern-lights-rovaniemi.jpg" },
  { id: "northern-lights-saariselka", category: "northern-lights", city: "Saariselkä", area: "Urho Kekkonen National Park", price: 525, image: "assets/img/destinations/northern-lights-saariselka.jpg" },
  { id: "northern-lights-yllas", category: "northern-lights", city: "Ylläs", area: "Ylläs National Park", price: 495, image: "assets/img/destinations/northern-lights-yllas.jpg" },
].map((d) => ({ ...d, name: `${d.city} — ${d.area}`, alt: `${d.city} — ${d.area}` }));

function getProperty(id) {
  return destinations.find((destination) => destination.id === id) ?? destinations[0];
}

function nightsBetween(checkIn, checkOut) {
  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return Number.isFinite(days) ? Math.max(1, days) : 1;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(`${date}T12:00:00`))
    .toUpperCase();
}

function isValidDateString(value) {
  return typeof value === "string" && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

// Every page reads booking state through here, so this is the one place that
// has to guarantee sane values — a bad or empty field saved by any page (e.g.
// a date input cleared mid-edit) must never reach formatDate/nightsBetween,
// which throw on invalid dates and would otherwise take down the whole script.
function getBooking() {
  let stored = {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch {
    stored = {};
  }

  const booking = { ...DEFAULT_BOOKING, ...stored };
  if (!isValidDateString(booking.checkIn)) booking.checkIn = DEFAULT_BOOKING.checkIn;
  if (!isValidDateString(booking.checkOut)) booking.checkOut = DEFAULT_BOOKING.checkOut;
  if (!Number.isInteger(booking.adults) || booking.adults < 1) booking.adults = DEFAULT_BOOKING.adults;
  if (!Number.isInteger(booking.children) || booking.children < 0) booking.children = DEFAULT_BOOKING.children;
  // guests is always derived from adults + children, never stored independently,
  // so the two can never drift out of sync regardless of which page wrote last.
  booking.guests = booking.adults + booking.children;
  if (booking.packageTier && !getPackage(booking.packageTier)) booking.packageTier = DEFAULT_BOOKING.packageTier;
  return booking;
}

function setBooking(patch) {
  const next = { ...getBooking(), ...patch };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function travelersLabel(adults, children) {
  const parts = [`${adults} Adult${adults === 1 ? "" : "s"}`];
  if (children > 0) parts.push(`${children} Child${children === 1 ? "" : "ren"}`);
  return parts.join(", ");
}

window.FNAB = { packages, destinations, getProperty, getPackage, nightsBetween, formatDate, travelersLabel, getBooking, setBooking };
