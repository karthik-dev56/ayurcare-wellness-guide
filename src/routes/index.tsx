import { createFileRoute } from "@tanstack/react-router";
import { AyurCareProvider, useAyurCare } from "@/hooks/useAyurCare";
import { SignedOutScreen } from "@/components/ayurcare/SignedOutScreen";
import { AppShell } from "@/components/ayurcare/AppShell";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AyurCare — Your personal Ayurvedic wellness companion" },
      {
        name: "description",
        content:
          "AyurCare is a calm Ayurvedic wellness companion. Sign in to ask about daily routines, digestion, sleep and diet, and revisit your past conversations.",
      },
      { property: "og:title", content: "AyurCare — Your personal Ayurvedic wellness companion" },
      {
        property: "og:description",
        content: "Explore Ayurvedic wellness guidance through a simple conversation.",
      },
    ],
  }),
  component: () => (
    <AyurCareProvider>
      <AyurCareRoot />
    </AyurCareProvider>
  ),
});

function AyurCareRoot() {
  const { status } = useAyurCare();

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading AyurCare...</p>
      </div>
    );
  }

  return status === "signed-in" ? <AppShell /> : <SignedOutScreen />;
}
