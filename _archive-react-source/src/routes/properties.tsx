import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FnabHeader } from "@/components/fnab-header";
import { useBooking } from "@/lib/booking-context";
import { formatDate, nightsBetween, properties } from "@/lib/properties";

export const Route = createFileRoute("/properties")({
  head: () => ({ meta: [
    { title: "Northern Stays — FNAB" },
    { name: "description", content: "Choose a glass igloo, private log cabin, or modern timber hideaway in Finnish Lapland." },
    { property: "og:title", content: "Northern Stays — FNAB" },
    { property: "og:description", content: "Choose your private shelter in Finland's far north." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const navigate = useNavigate();
  const { checkIn, checkOut, guests, propertyId, setPropertyId } = useBooking();
  const nights = nightsBetween(checkIn, checkOut);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FnabHeader />
      <section className="mx-auto max-w-[1600px] px-5 py-14 sm:px-10 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col gap-5 border-b border-border pb-7 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[9px] font-medium tracking-[0.3em] text-muted-foreground">( 01 ) RETRIEVE</p><h1 className="mt-3 text-3xl font-bold sm:text-5xl">Choose your shelter.</h1></div>
          <p className="text-[9px] font-medium tracking-[0.18em] text-muted-foreground sm:text-[10px]">{formatDate(checkIn)} → {formatDate(checkOut)} · {nights} NIGHTS · {guests} GUESTS</p>
        </motion.div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {properties.map((property, index) => {
            const selected = property.id === propertyId;
            return (
              <motion.article key={property.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded">
                  <img src={property.image} alt={property.alt} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                  <span className="absolute left-4 top-4 rounded-sm border border-foreground/15 bg-background/75 px-3 py-1.5 text-[8px] font-semibold tracking-[0.16em] text-foreground backdrop-blur-md">{property.type.toUpperCase()}</span>
                  {selected && <span className="absolute bottom-4 right-4 rounded-sm bg-primary px-3 py-1.5 text-[8px] font-bold tracking-[0.16em] text-primary-foreground">SELECTED</span>}
                </div>
                <div className="mt-5 flex items-start justify-between gap-4"><h2 className="text-base font-bold sm:text-lg">{property.name}</h2><p className="shrink-0 text-sm font-semibold">€{property.price}<span className="text-[10px] font-normal text-muted-foreground"> /night</span></p></div>
                <p className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground"><Users className="size-3" />{property.detail}</p>
                <Button onClick={() => { setPropertyId(property.id); void navigate({ to: "/checkout" }); }} variant="outline" className="mt-5 h-11 w-full rounded-sm border-foreground/25 bg-transparent text-[9px] font-semibold tracking-[0.2em] text-foreground hover:bg-primary hover:text-primary-foreground">SELECT <ArrowRight /></Button>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}