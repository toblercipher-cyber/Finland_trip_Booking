import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FnabHeader } from "@/components/fnab-header";
import { useBooking } from "@/lib/booking-context";
import heroImage from "@/assets/fnab-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Finnish Glass Igloos & Cabins — FNAB" },
    { name: "description", content: "Book private glass igloos and timber cabins beneath the northern lights in Finnish Lapland." },
    { property: "og:title", content: "Finnish Glass Igloos & Cabins — FNAB" },
    { property: "og:description", content: "Cinematic stays beneath the northern lights in Finnish Lapland." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { checkIn, checkOut, guests, setDates, setGuests } = useBooking();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 110]);

  function search(event: FormEvent) {
    event.preventDefault();
    void navigate({ to: "/properties" });
  }

  return (
    <main className="bg-background">
      <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden">
        <motion.img src={heroImage} alt="Glass igloo beneath the northern lights in Finnish Lapland" width={1920} height={1080} className="absolute inset-0 h-[112%] w-full object-cover" style={{ y: imageY }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--background)_0%,color-mix(in_oklab,var(--background)_38%,transparent)_54%,color-mix(in_oklab,var(--background)_72%,transparent)_100%)]" />
        <FnabHeader overlay />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-5 pb-8 pt-28 sm:px-10 sm:pb-12">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-[9px] font-medium tracking-[0.3em] text-foreground/60 sm:text-[10px]">68°09′ N · LAPLAND · BLUE HOUR</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08 }} className="mt-5 max-w-[15ch] font-display text-[clamp(2.7rem,7vw,6.5rem)] font-extrabold leading-[0.95] text-foreground">Glass over the black pine.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.16 }} className="mt-6 max-w-[47ch] text-xs leading-6 text-foreground/75 sm:text-sm">Aurora glass igloos and hand-hewn timber cabins, set into Finland&apos;s far north.</motion.p>
          <motion.form onSubmit={search} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.24 }} className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-px overflow-hidden rounded border border-foreground/15 bg-foreground/10 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1fr_1fr_.8fr_.8fr]">
            <DateField label="ARRIVE" value={checkIn} min="2026-01-01" onChange={(value) => setDates(value, checkOut)} />
            <DateField label="DEPART" value={checkOut} min={checkIn} onChange={(value) => setDates(checkIn, value)} />
            <label className="block bg-background/75 px-5 py-4">
              <span className="block text-[9px] font-medium tracking-[0.2em] text-muted-foreground">GUESTS</span>
              <select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="mt-1.5 w-full bg-transparent text-xs font-semibold text-foreground outline-none sm:text-sm">
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count} className="bg-background">{count} {count === 1 ? "GUEST" : "GUESTS"}</option>)}
              </select>
            </label>
            <Button type="submit" className="h-auto min-h-16 rounded-none bg-primary px-5 text-[10px] font-bold tracking-[0.18em] text-primary-foreground hover:bg-accent">SEARCH <ArrowRight /></Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}

function DateField({ label, value, min, onChange }: { label: string; value: string; min: string; onChange: (value: string) => void }) {
  return <label className="block bg-background/75 px-5 py-4"><span className="block text-[9px] font-medium tracking-[0.2em] text-muted-foreground">{label}</span><input aria-label={label} type="date" value={value} min={min} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full bg-transparent text-xs font-semibold text-foreground outline-none scheme-dark sm:text-sm" /></label>;
}