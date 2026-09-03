import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAyurCare } from "@/hooks/useAyurCare";
import type { ChatMessage } from "@/lib/api";

function toConversationTitles(messages: ChatMessage[]): { id: string; title: string }[] {
  return messages
    .filter((m) => m.role === "user")
    .slice(-25)
    .reverse()
    .map((m) => ({
      id: m.id,
      title: m.content.length > 42 ? `${m.content.slice(0, 42).trimEnd()}…` : m.content,
    }));
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { messages, historyLoading, historyError, reloadHistory, startNewConversation, signOut, user } = useAyurCare();
  const conversations = toConversationTitles(messages);

  const initial = (user?.name ?? user?.email ?? "A").trim().charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="px-5 py-5">
        <Logo />
      </div>

      <div className="px-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl border-sidebar-border bg-card font-normal hover:bg-sidebar-accent"
          onClick={() => {
            startNewConversation();
            onNavigate?.();
          }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New conversation
        </Button>
      </div>

      <div className="mt-7 flex-1 overflow-y-auto px-4 pb-4">
        <p className="px-2 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Your conversations
        </p>

        {historyLoading ? (
          <p className="px-2 text-sm text-muted-foreground">Loading your conversations...</p>
        ) : historyError ? (
          <div className="px-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We couldn't load your conversations right now. Please try again.
            </p>
            <button
              onClick={() => void reloadHistory()}
              className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <p className="px-2 text-sm leading-relaxed text-muted-foreground">
            No conversations yet. Start your first conversation with AyurCare.
          </p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <span className="block truncate rounded-lg px-2 py-2 text-sm text-sidebar-foreground/90 transition-colors hover:bg-sidebar-accent">
                  {c.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          {user?.picture ? (
            <img src={user.picture} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {initial}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user?.name ?? "Signed in"}</p>
            {user?.email ? <p className="truncate text-xs text-muted-foreground">{user.email}</p> : null}
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-3 w-full justify-start gap-2 rounded-lg text-sm font-normal text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          onClick={() => void signOut()}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Log out
        </Button>
      </div>
    </div>
  );
}
