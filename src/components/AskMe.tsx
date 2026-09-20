import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, X, Send, RotateCcw, ArrowUpRight } from 'lucide-react';
import { profile } from '@/content/profile';

interface Source {
  source: string;
  href: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  error?: boolean;
}

const SUGGESTIONS = [
  'What has he shipped to production?',
  'Tell me about the SAM3 fine-tuning work',
  'Which cloud platforms has he used?',
  'Is he open to remote roles?',
];

const STORAGE_KEY = 'askme:v1';

/* ---------- Minimal markdown: paragraphs, "-" lists, **bold**, links/paths ---------- */

const INLINE = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|\/projects\/[a-z0-9-]+|\/#[a-z]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

const renderInline = (text: string, keyPrefix: string): ReactNode[] =>
  text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {renderInline(part.slice(2, -2), `${key}-b`)}
        </strong>
      );
    }
    if (part.startsWith('/projects/') || part.startsWith('/#')) {
      return (
        <Link key={key} to={part} className="text-brand underline underline-offset-2 hover:opacity-80">
          {part}
        </Link>
      );
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={key} href={part} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2 hover:opacity-80">
          {part.replace(/^https?:\/\//, '')}
        </a>
      );
    }
    if (/@/.test(part)) {
      return (
        <a key={key} href={`mailto:${part}`} className="text-brand underline underline-offset-2 hover:opacity-80">
          {part}
        </a>
      );
    }
    return <span key={key}>{part}</span>;
  });

const Markdown = ({ text }: { text: string }) => {
  const blocks: ReactNode[] = [];
  const lines = text.split('\n');
  let list: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-1 my-1.5 pl-4 list-disc marker:text-brand/60">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    const m = line.match(/^\s*[-*•]\s+(.*)$/);
    if (m) {
      list.push(m[1]);
      return;
    }
    flushList();
    if (line.trim()) blocks.push(<p key={`p-${i}`}>{renderInline(line, `p-${i}`)}</p>);
  });
  flushList();
  return <div className="space-y-2">{blocks}</div>;
};

/* ---------- Component ---------- */

export const AskMe = () => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Message[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      /* private mode etc. */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput('');
    setBusy(true);

    const history = [...messages.filter((m) => !m.error), { role: 'user' as const, content: q }];
    setMessages([...history, { role: 'assistant', content: '' }]);

    const controller = new AbortController();
    abortRef.current = controller;

    const patchLast = (patch: Partial<Message>) =>
      setMessages((prev) => {
        const next = prev.slice();
        next[next.length - 1] = { ...next[next.length - 1], ...patch };
        return next;
      });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let headerParsed = false;
      let answer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        if (!headerParsed) {
          const nl = buffer.indexOf('\n');
          if (nl === -1) continue;
          try {
            const { sources } = JSON.parse(buffer.slice(0, nl)) as { sources: Source[] };
            patchLast({ sources });
          } catch {
            /* header missing; keep going */
          }
          buffer = buffer.slice(nl + 1);
          headerParsed = true;
        }
        answer += buffer;
        buffer = '';
        patchLast({ content: answer });
      }
      if (!answer.trim()) patchLast({ content: "I couldn't find that in the portfolio. Try asking about a project, role or skill.", sources: [] });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      patchLast({
        content: (err as Error).message || 'Something went wrong. Please try again.',
        error: true,
        sources: [],
      });
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    inputRef.current?.focus();
  };

  const empty = messages.length === 0;

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: open ? 0 : 1, y: open ? 20 : 0, pointerEvents: open ? 'none' : 'auto' }}
        transition={{ delay: open ? 0 : 1.2, duration: 0.4 }}
        whileHover={reduce ? undefined : { scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 lg:right-20 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pl-4 pr-5 py-3 shadow-lg shadow-primary/20 font-medium text-sm"
        aria-label="Ask about my work"
        aria-expanded={open}
        aria-controls="askme-panel"
      >
        <Sparkles size={16} />
        Ask about my work
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="askme-panel"
            role="dialog"
            aria-label={`Ask about ${profile.firstName}'s work`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 lg:right-20 sm:bottom-6 sm:w-[400px] max-h-[min(640px,calc(100dvh-24px))] flex flex-col rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-semibold text-sm leading-tight">Ask about my work</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  Answers only from this site's content · powered by gpt-oss-120b on Groq
                </div>
              </div>
              {!empty && (
                <button
                  type="button"
                  onClick={reset}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Start over"
                  title="Start over"
                >
                  <RotateCcw size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm min-h-[220px]">
              {empty ? (
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    Hi — I can answer questions about {profile.firstName}'s projects, experience and stack,
                    citing where on the site each answer comes from.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="text-left px-3 py-2 rounded-lg border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors text-foreground/90"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                    <div
                      className={
                        m.role === 'user'
                          ? 'max-w-[85%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-3.5 py-2 leading-relaxed'
                          : `max-w-[95%] leading-relaxed ${m.error ? 'text-destructive' : 'text-foreground/90'}`
                      }
                    >
                      {m.role === 'assistant' && !m.content && busy ? (
                        <span className="inline-flex gap-1 items-center h-5" aria-label="Thinking">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                              animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }}
                            />
                          ))}
                        </span>
                      ) : m.role === 'assistant' ? (
                        <Markdown text={m.content} />
                      ) : (
                        m.content
                      )}

                      {m.role === 'assistant' && m.sources && m.sources.length > 0 && !busy && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {dedupe(m.sources).map((s) => (
                            <Link
                              key={s.href + s.source}
                              to={s.href}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors"
                            >
                              {s.source} <ArrowUpRight size={10} />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 p-3 border-t border-border">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${profile.firstName}'s work…`}
                maxLength={500}
                disabled={busy}
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-60"
                aria-label="Your question"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="p-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/** Several chunks can point at the same page; show each destination once. */
function dedupe(sources: Source[]): Source[] {
  const seen = new Set<string>();
  return sources.filter((s) => {
    const key = s.href;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
