import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { useAyurCare } from "@/hooks/useAyurCare";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="AyurCare is replying">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </span>
  );
}

export function ChatPanel() {
  const { messages, sending, sendError, send, historyLoading } = useAyurCare();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, sending]);

  const submit = () => {
    const text = draft;
    if (!text.trim() || sending) return;
    setDraft("");
    void send(text);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border px-5 py-5 sm:px-10 sm:py-7">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">AyurCare</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your personal Ayurvedic wellness companion.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          {historyLoading && messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading your conversations...</p>
          ) : messages.length === 0 ? (
            <div className="pt-10 text-center">
              <p className="text-base text-foreground">How can AyurCare support your wellness today?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask about daily routines, digestion, sleep, diet or seasonal care.
              </p>
            </div>
          ) : (
            messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground">
                    {m.content}
                  </p>
                </div>
              ) : (
                <Message key={m.id} from="assistant">
                  <MessageContent className="max-w-[92%] rounded-2xl rounded-bl-md bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground ring-1 ring-border">
                    <MessageResponse className="text-sm [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5 [&_strong]:font-semibold">
                      {m.content}
                    </MessageResponse>
                  </MessageContent>
                </Message>
              ),
            )
          )}

          {sending ? (
            <div className="flex justify-start">
              <span className="rounded-2xl rounded-bl-md bg-card px-4 py-3 ring-1 ring-border">
                <TypingDots />
              </span>
            </div>
          ) : null}

          {sendError ? (
            <p className="text-sm text-destructive">
              Something went wrong while processing your message. Please try again.
            </p>
          ) : null}

          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-border bg-background px-5 py-4 sm:px-10 sm:py-5">
        <form
          className="mx-auto flex max-w-2xl items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Ask AyurCare anything about your wellness..."
            aria-label="Message AyurCare"
            className="max-h-40 min-h-[48px] flex-1 resize-none rounded-2xl border border-input bg-card px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <Button type="submit" disabled={sending || !draft.trim()} className="h-12 rounded-2xl px-5">
            Send
          </Button>
        </form>
        <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-muted-foreground/80">
          General wellness information only — please consult a qualified practitioner for medical concerns.
        </p>
      </div>
    </div>
  );
}
