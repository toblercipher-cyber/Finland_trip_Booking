import { Link } from "@tanstack/react-router";

export function FnabHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={overlay ? "absolute inset-x-0 top-0 z-30" : "border-b border-border bg-background"}>
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-10">
        <Link to="/" className="group flex min-w-0 items-baseline gap-3" aria-label="FNAB home">
          <span className="font-display text-lg font-bold tracking-[0.28em] text-foreground sm:text-xl">FNAB</span>
          <span className="hidden text-[9px] font-medium tracking-[0.24em] text-muted-foreground sm:inline">NORTHERN AREAS BOOKING</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 text-[9px] font-medium tracking-[0.18em] text-muted-foreground sm:gap-8 sm:text-[10px]">
          <Link to="/properties" activeProps={{ className: "text-foreground" }} className="transition-colors hover:text-foreground">STAYS</Link>
          <Link to="/" className="hidden transition-colors hover:text-foreground sm:inline">WILDERNESS</Link>
          <Link to="/checkout" activeProps={{ className: "text-foreground" }} className="transition-colors hover:text-foreground">BOOKING</Link>
        </nav>
      </div>
    </header>
  );
}
