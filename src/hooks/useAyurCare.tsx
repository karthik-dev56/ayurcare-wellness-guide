import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCurrentUser,
  fetchHistory,
  logout as apiLogout,
  sendMessage as apiSendMessage,
  startGoogleSignIn,
  type AyurUser,
  type ChatMessage,
} from "@/lib/api";

type AuthStatus = "checking" | "signed-in" | "signed-out";

interface AyurCareState {
  status: AuthStatus;
  user: AyurUser | null;
  messages: ChatMessage[];
  historyLoading: boolean;
  historyError: boolean;
  sending: boolean;
  sendError: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
  send: (text: string) => Promise<void>;
  reloadHistory: () => Promise<void>;
  startNewConversation: () => void;
}

const Ctx = createContext<AyurCareState | null>(null);

export function AyurCareProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<AyurUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const reloadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(false);
    try {
      setMessages(await fetchHistory());
    } catch {
      setHistoryError(true);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      const me = await fetchCurrentUser();
      if (!active) return;
      if (me) {
        setUser(me);
        setStatus("signed-in");
        void reloadHistory();
      } else {
        setUser(null);
        setMessages([]);
        setStatus("signed-out");
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadHistory]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      setSendError(false);
      setSending(true);
      const localId = `local-${Date.now()}`;
      setMessages((prev) => [...prev, { id: localId, role: "user", content: trimmed }]);
      try {
        const reply = await apiSendMessage(trimmed);
        setMessages((prev) => [...prev, { id: `${localId}-reply`, role: "assistant", content: reply }]);
        void reloadHistory();
      } catch {
        setSendError(true);
      } finally {
        setSending(false);
      }
    },
    [reloadHistory, sending],
  );

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* returning the user to the signed-out screen either way */
    }
    setUser(null);
    setMessages([]);
    setHistoryError(false);
    setSendError(false);
    setStatus("signed-out");
  }, []);

  const value = useMemo<AyurCareState>(
    () => ({
      status,
      user,
      messages,
      historyLoading,
      historyError,
      sending,
      sendError,
      signIn: startGoogleSignIn,
      signOut,
      send,
      reloadHistory,
      startNewConversation: () => setMessages([]),
    }),
    [status, user, messages, historyLoading, historyError, sending, sendError, signOut, send, reloadHistory],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAyurCare(): AyurCareState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAyurCare must be used inside AyurCareProvider");
  return ctx;
}
