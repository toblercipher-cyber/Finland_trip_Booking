import iglooImage from "@/assets/aurora-igloo.jpg";
import cabinImage from "@/assets/spruce-cabin.jpg";
import hideawayImage from "@/assets/timber-hideaway.jpg";
import type { PropertyId } from "./booking-context";

export const properties = [
  {
    id: "igloo" as PropertyId,
    type: "Glass igloo",
    name: "Aurora Glass Igloo",
    price: 640,
    detail: "2 guests · lake-facing",
    image: iglooImage,
    alt: "Glass igloo glowing beneath the northern lights in a snowy Finnish forest",
  },
  {
    id: "cabin" as PropertyId,
    type: "Log cabin",
    name: "Black Spruce Cabin",
    price: 420,
    detail: "4 guests · private sauna",
    image: cabinImage,
    alt: "Warm timber cabin surrounded by snow-covered spruce trees at dusk",
  },
  {
    id: "hideaway" as PropertyId,
    type: "Premium cabin",
    name: "Timber Hideaway",
    price: 510,
    detail: "3 guests · fireplace",
    image: hideawayImage,
    alt: "Modern timber hideaway with floor-to-ceiling windows in a Finnish forest",
  },
] as const;

export function getProperty(id: PropertyId) {
  return properties.find((property) => property.id === id) ?? properties[0];
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return Number.isFinite(days) ? Math.max(1, days) : 1;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(`${date}T12:00:00`))
    .toUpperCase();
}
