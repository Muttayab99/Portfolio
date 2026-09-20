import { profile } from './profile';
import { experiences } from './experience';
import { projects } from './projects';
import { skills, skillGroups } from './skills';

/**
 * Flattens the site content into retrievable chunks for the "Ask my portfolio"
 * assistant (see api/chat.ts). Each chunk is small and self-contained so the
 * retriever can hand the model only what a question needs.
 */
export interface Chunk {
  id: string;
  /** Where this fact lives on the site, e.g. "Projects → Vesta". */
  source: string;
  /** Route to link to when the chunk is cited. */
  href: string;
  text: string;
}

export function buildKnowledgeBase(): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: 'profile',
    source: 'About',
    href: '/#about',
    text: [
      `${profile.name} is an ${profile.role} based in ${profile.location} (${profile.workMode}). Status: ${profile.availability}.`,
      `Education: ${profile.education}. Achievements: ${profile.achievements.join(', ')}.`,
      `Email: ${profile.email}. GitHub: ${profile.links.github}. LinkedIn: ${profile.links.linkedin}. CV: ${profile.siteUrl}${profile.cvPath}.`,
      ...profile.about,
      `Technologies used recently: ${profile.recentTech.join(', ')}.`,
    ].join('\n'),
  });

  for (const job of experiences) {
    chunks.push({
      id: `job-${job.company.toLowerCase().replace(/\s+/g, '-')}`,
      source: `Experience → ${job.company}`,
      href: '/#experience',
      text: [
        `${job.title} at ${job.company} (${job.type}, ${job.period}, ${job.location}).`,
        ...job.description.map((d) => `- ${d}`),
      ].join('\n'),
    });
  }

  for (const p of projects) {
    const base = [
      `Project: ${p.title} (${p.year}${p.org ? `, at ${p.org}` : ''}). ${p.tagline}.`,
      p.description,
      `Tech: ${p.tech.join(', ')}.`,
      p.github ? `Code: ${p.github}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    chunks.push({
      id: `project-${p.slug}`,
      source: `Projects → ${p.title}`,
      href: p.caseStudy ? `/projects/${p.slug}` : '/#projects',
      text: base,
    });

    if (p.caseStudy) {
      const cs = p.caseStudy;
      chunks.push({
        id: `case-${p.slug}-problem`,
        source: `Case study → ${p.title} → Problem & approach`,
        href: `/projects/${p.slug}`,
        text: [
          `${p.title} — ${cs.context}`,
          `Problem: ${cs.problem}`,
          'Approach:',
          ...cs.approach.map((a) => `- ${a}`),
          `Pipeline: ${cs.pipeline.map((s) => `${s.label} (${s.detail})`).join(' → ')}`,
        ].join('\n'),
      });
      chunks.push({
        id: `case-${p.slug}-outcomes`,
        source: `Case study → ${p.title} → Outcomes & learnings`,
        href: `/projects/${p.slug}`,
        text: [
          `${p.title} outcomes:`,
          ...cs.outcomes.map((o) => `- ${o}`),
          `Key facts: ${cs.highlights.map((h) => `${h.value} ${h.label}`).join('; ')}.`,
          'What I learned:',
          ...cs.learnings.map((l) => `- ${l}`),
        ].join('\n'),
      });
    }
  }

  for (const group of skillGroups) {
    const names = skills
      .filter((s) => s.category.some((c) => group.match.includes(c)))
      .map((s) => s.name);
    chunks.push({
      id: `skills-${group.match.join('-')}`,
      source: `Stack → ${group.title}`,
      href: '/#skills',
      text: `${group.title}: ${names.join(', ')}.`,
    });
  }

  return chunks;
}

/* ---------- Retrieval ---------- */

const STOP = new Set(
  'a an the and or of to in on for with at by from is are was were be been do does did what which who whom how when where why his her he she it its they them their you your i me my we our this that these those about into over under as if than then so not no yes can could would should will has have had tell know does use used using'.split(' '),
);

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^[-./]+|[-./]+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t));

/** Light stemming so "pipelines" matches "pipeline", "fine-tuned" matches "fine-tuning". */
const stem = (t: string) => t.replace(/(ing|ed|es|s)$/, '');

interface Indexed {
  chunk: Chunk;
  terms: Map<string, number>;
  length: number;
}

export function buildIndex(chunks: Chunk[]) {
  const docs: Indexed[] = chunks.map((chunk) => {
    const terms = new Map<string, number>();
    const toks = tokenize(`${chunk.source} ${chunk.text}`).map(stem);
    for (const t of toks) terms.set(t, (terms.get(t) ?? 0) + 1);
    return { chunk, terms, length: toks.length };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.terms.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLen = docs.reduce((a, d) => a + d.length, 0) / Math.max(1, docs.length);
  return { docs, df, avgLen, N: docs.length };
}

export type Index = ReturnType<typeof buildIndex>;

/** BM25 over the chunk index. Returns the top-k chunks with a positive score. */
export function retrieve(index: Index, query: string, k = 5): Chunk[] {
  const q = Array.from(new Set(tokenize(query).map(stem)));
  if (q.length === 0) return [];
  const k1 = 1.4;
  const b = 0.75;
  const scored = index.docs.map((d) => {
    let score = 0;
    for (const t of q) {
      const tf = d.terms.get(t);
      if (!tf) continue;
      const n = index.df.get(t) ?? 0;
      const idf = Math.log(1 + (index.N - n + 0.5) / (n + 0.5));
      score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * d.length) / index.avgLen)));
    }
    return { chunk: d.chunk, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.chunk);
}
