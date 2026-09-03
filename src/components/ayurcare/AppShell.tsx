import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border md:block">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs border-sidebar-border p-0">
              <SheetTitle className="sr-only">AyurCare menu</SheetTitle>
              <Sidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Logo />
        </header>

        <main className="min-h-0 flex-1">
          <ChatPanel />
        </main>
      </div>
    </div>
  );
}
