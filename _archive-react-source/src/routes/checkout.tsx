import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, Check, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FnabHeader } from "@/components/fnab-header";
import { useBooking } from "@/lib/booking-context";
import { formatDate, getProperty, nightsBetween } from "@/lib/properties";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Complete Your Booking — FNAB" },
    { name: "description", content: "Review your selected Finnish stay and complete your FNAB booking details." },
    { property: "og:title", content: "Complete Your Booking — FNAB" },
    { property: "og:description", content: "Review and confirm your northern Finland stay." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CheckoutPage,
});

const conflictMessage = "Booking Unavailable: You cannot enter any further because there are no reasonable slots available in our system for these dates.";

function CheckoutPage() {
  const navigate = useNavigate();
  const booking = useBooking();
  const property = getProperty(booking.propertyId);
  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const [conflict, setConflict] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const unavailable = booking.checkIn === "2026-12-12" && booking.checkOut === "2026-12-17";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (unavailable) setConflict(true);
    else setConfirmed(true);
  }

  return (
    <main className="min-h-screen bg-secondary text-foreground">
      <FnabHeader />
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 sm:py-20">
        <p className="text-[9px] font-medium tracking-[0.3em] text-muted-foreground">( 02 ) CONFIRM</p>
        <h1 className="mt-3 max-w-[16ch] text-3xl font-bold leading-tight sm:text-5xl">Reserve the stay.</h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.form onSubmit={submit} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2"><Input label="FIRST NAME" name="firstName" placeholder="Aino" /><Input label="LAST NAME" name="lastName" placeholder="Laine" /></div>
            <Input label="EMAIL" name="email" type="email" placeholder="aino.laine@example.fi" />
            <Input label="PHONE" name="phone" type="tel" placeholder="+358 40 123 4567" />
            <div className="grid gap-5 sm:grid-cols-2"><DateInput label="CHECK IN" value={booking.checkIn} onChange={(value) => { booking.setDates(value, booking.checkOut); setConflict(false); setConfirmed(false); }} /><DateInput label="CHECK OUT" value={booking.checkOut} min={booking.checkIn} onChange={(value) => { booking.setDates(booking.checkIn, value); setConflict(false); setConfirmed(false); }} /></div>
            {confirmed ? <div role="status" className="flex items-center gap-3 rounded border border-foreground/20 bg-background/40 p-4 text-xs"><Check className="size-5" />Your mock booking is confirmed. No payment or email was sent.</div> : null}
            <Button type="submit" disabled={conflict || confirmed} className="h-13 w-full rounded-sm text-[10px] font-bold tracking-[0.2em]">{confirmed ? "BOOKING CONFIRMED" : conflict ? "CONFIRMATION DISABLED" : "CONFIRM BOOKING"}</Button>
          </motion.form>
          <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="overflow-hidden rounded border border-border bg-background/55 lg:col-span-5">
            <img src={property.image} alt={property.alt} width={1024} height={768} loading="lazy" className="aspect-[16/8] w-full object-cover" />
            <div className="p-5 sm:p-7"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">STAY SUMMARY</p><p className="text-[8px] tracking-[0.16em] text-muted-foreground">FN-0129</p></div><h2 className="mt-4 text-xl font-bold">{property.name}</h2><SummaryRow left={`${formatDate(booking.checkIn)} → ${formatDate(booking.checkOut)}`} right={`${nights} NIGHTS`} /><SummaryRow left="GUESTS" right={`${booking.guests} ADULT${booking.guests === 1 ? "" : "S"}`} /><div className="mt-4 flex items-center justify-between"><span className="text-[10px] tracking-[0.16em] text-muted-foreground">TOTAL</span><span className="text-lg font-bold">€{(nights * property.price).toLocaleString("en-US")}</span></div></div>
          </motion.aside>
        </div>
      </section>

      <AnimatePresence>
        {conflict && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="conflict-title">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="relative w-full max-w-lg rounded border border-destructive/55 bg-popover p-6 shadow-2xl sm:p-8">
            <Button type="button" variant="ghost" size="icon" onClick={() => setConflict(false)} aria-label="Close unavailable dates message" className="absolute right-3 top-3 text-muted-foreground"><X /></Button>
            <div className="flex size-11 items-center justify-center rounded-full border border-destructive/50 bg-destructive/10 text-destructive"><AlertCircle /></div>
            <p className="mt-6 text-[9px] font-semibold tracking-[0.22em] text-destructive">DATE CONFLICT</p>
            <h2 id="conflict-title" className="mt-2 text-xl font-bold">Booking unavailable</h2>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">{conflictMessage}</p>
            <Button type="button" onClick={() => { setConflict(false); void navigate({ to: "/" }); }} className="mt-7 h-12 w-full rounded-sm text-[9px] font-bold tracking-[0.18em]"><ArrowLeft /> CHOOSE DIFFERENT DATES</Button>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}

function Input({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder: string }) {
  return <label className="block"><span className="mb-2 block text-[9px] font-medium tracking-[0.2em] text-muted-foreground">{label}</span><input required name={name} type={type} placeholder={placeholder} className="h-13 w-full rounded-sm border border-input bg-background/40 px-4 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/45 focus:border-foreground/45 focus:ring-1 focus:ring-ring/30" /></label>;
}

function DateInput({ label, value, min, onChange }: { label: string; value: string; min?: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-[9px] font-medium tracking-[0.2em] text-muted-foreground">{label}</span><input required type="date" value={value} min={min} onChange={(event) => onChange(event.target.value)} className="h-13 w-full scheme-dark rounded-sm border border-input bg-background/40 px-4 text-xs text-foreground outline-none focus:border-foreground/45" /></label>;
}

function SummaryRow({ left, right }: { left: string; right: string }) {
  return <div className="mt-4 flex items-center justify-between gap-5 border-b border-border pb-4 text-[9px] text-muted-foreground sm:text-[10px]"><span>{left}</span><span className="shrink-0 text-foreground">{right}</span></div>;
}