import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAyurCare } from "@/hooks/useAyurCare";

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.94v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.94a9 9 0 0 0 0 8.1l3.03-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.95l3.03 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

export function SignedOutScreen() {
  const { signIn } = useAyurCare();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo className="scale-110" />
        </div>

        <h1 className="mt-10 font-display text-4xl font-semibold text-foreground sm:text-5xl">AyurCare</h1>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
          Explore Ayurvedic wellness guidance through a simple conversation.
        </p>

        <Button size="lg" onClick={signIn} className="mt-10 h-12 w-full gap-3 rounded-full bg-card text-foreground shadow-sm ring-1 ring-border hover:bg-secondary">
          <GoogleMark />
          Sign in with Google
        </Button>

        <p className="mt-5 text-sm text-muted-foreground">
          Sign in to start a conversation and access your previous chats.
        </p>
      </div>

      <p className="mt-16 max-w-sm text-center text-xs leading-relaxed text-muted-foreground/80">
        AyurCare shares general Ayurvedic wellness information and is not a substitute for professional medical advice.
      </p>
    </main>
  );
}
