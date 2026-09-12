import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type PropertyId = "igloo" | "cabin" | "hideaway";

type BookingState = {
  checkIn: string;
  checkOut: string;
  guests: number;
  propertyId: PropertyId;
};

type BookingContextValue = BookingState & {
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (guests: number) => void;
  setPropertyId: (propertyId: PropertyId) => void;
};

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>({
    checkIn: "2026-12-12",
    checkOut: "2026-12-17",
    guests: 2,
    propertyId: "igloo",
  });

  const value = useMemo<BookingContextValue>(
    () => ({
      ...booking,
      setDates: (checkIn, checkOut) => setBooking((current) => ({ ...current, checkIn, checkOut })),
      setGuests: (guests) => setBooking((current) => ({ ...current, guests })),
      setPropertyId: (propertyId) => setBooking((current) => ({ ...current, propertyId })),
    }),
    [booking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}
