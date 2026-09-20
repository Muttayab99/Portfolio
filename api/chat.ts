/**
 * "Ask my portfolio" — Vercel Edge Function.
 *
 * POST /api/chat  { messages: [{ role: 'user' | 'assistant', content: string }] }
 *
 * Response is a text stream:
 *   line 1: JSON  { sources: [{ source, href }] }
 *   rest:   the assistant's answer, streamed as plain text
 *
 * Retrieval is BM25 over the site's own content (src/content), so the model
 * only ever answers from what the portfolio actually says. The Groq key stays
 * server-side; in local dev the same handler is mounted by vite.config.ts.
 */
import { buildKnowledgeBase, buildIndex, retrieve } from '../src/content/knowledge';
import { profile } from '../src/content/profile';

export const config = { runtime: 'edge' };

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
/** Strongest general model available on the account; falls back if rate-limited. */
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

const MAX_MESSAGES = 12;
const MAX_CHARS = 1500;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const index = buildIndex(buildKnowledgeBase());

const SYSTEM = `You are the assistant on ${profile.name}'s portfolio site (${profile.siteUrl}). Visitors are usually recruiters, hiring managers or engineers deciding whether to reach out.

Rules:
- Answer ONLY from the CONTEXT below. If the context does not cover the question, say so plainly and suggest emailing ${profile.email}. Never invent employers, dates, metrics or technologies.
- Speak about ${profile.firstName} in the third person, warmly but factually. No hype words.
- Be concise: 2–5 sentences, or a short bullet list when comparing several things. Use Markdown sparingly (bold for names, "-" for lists). No headings.
- When a case study exists, mention it and its path (e.g. /projects/vesta) so the visitor can read more.
- If asked for contact details, give the email and LinkedIn from the context.
- If asked something unrelated to ${profile.firstName} or his work, politely steer back.`;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function sanitize(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const out: ChatMessage[] = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) out.push({ role: m.role, content });
  }
  return out.length && out[out.length - 1].role === 'user' ? out : null;
}

async function callGroq(apiKey: string, messages: { role: string; content: string }[]) {
  let lastError: Response | null = null;
  for (const model of MODELS) {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.3,
        max_tokens: 600,
        reasoning_effort: 'low',
      }),
    });
    if (res.ok && res.body) return res;
    lastError = res;
    // Only fall through to the next model on rate-limit / capacity errors.
    if (res.status !== 429 && res.status < 500) break;
  }
  throw lastError ?? new Error('Groq request failed');
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return json(503, { error: 'Assistant is not configured (missing GROQ_API_KEY).' });

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  const messages = sanitize(body.messages);
  if (!messages) return json(400, { error: 'Invalid messages' });

  // Retrieve on the latest question, with the previous user turn as light context
  // so follow-ups like "what did he use for that?" still land on the right chunks.
  const userTurns = messages.filter((m) => m.role === 'user');
  const query = userTurns.slice(-2).map((m) => m.content).join(' ');
  const chunks = retrieve(index, query, 5);

  const context = chunks.length
    ? chunks.map((c, i) => `[${i + 1}] ${c.source}\n${c.text}`).join('\n\n')
    : '(no matching content)';

  let upstream: Response;
  try {
    upstream = await callGroq(apiKey, [
      { role: 'system', content: `${SYSTEM}\n\nCONTEXT:\n${context}` },
      ...messages,
    ]);
  } catch (err) {
    const status = err instanceof Response ? err.status : 502;
    return json(status === 429 ? 429 : 502, {
      error: status === 429 ? 'The assistant is busy right now. Please try again in a moment.' : 'Upstream error',
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const sources = chunks.map((c) => ({ source: c.source, href: c.href }));

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify({ sources }) + '\n'));
      const reader = upstream.body!.getReader();
      let buffer = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              /* ignore malformed keep-alive lines */
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
