export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21c0-6 3.5-10 8-11 0 5.5-3.5 10-8 11Z" />
          <path d="M12 21c0-4.5-2.8-8-6.5-8.8C5.5 16.6 8.2 20.3 12 21Z" />
          <path d="M12 21v-6" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold text-foreground">AyurCare</span>
    </span>
  );
}
