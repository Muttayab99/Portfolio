import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { PipelineStage } from '@/content/projects';

interface Props {
  stages: PipelineStage[];
}

/**
 * Flow of stages with connectors that draw in as the diagram scrolls into
 * view. Horizontal on lg+ screens, vertical below that.
 */
export const PipelineDiagram = ({ stages }: Props) => {
  const reduce = useReducedMotion();
  const enter = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.4, delay: i * 0.07 },
  });

  return (
    <ol className="flex flex-col lg:flex-row lg:items-stretch" aria-label="Pipeline">
      {stages.map((stage, i) => (
        <Fragment key={stage.label}>
          <motion.li
            {...enter(i)}
            className="glass-card rounded-xl px-4 py-3 lg:flex-1 min-w-0"
          >
            <div className="font-mono text-[11px] text-brand/70 mb-1">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="font-heading font-semibold text-sm leading-snug">{stage.label}</div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{stage.detail}</div>
          </motion.li>

          {i < stages.length - 1 && (
            <li aria-hidden className="shrink-0 flex items-center justify-center lg:w-8 h-7 lg:h-auto">
              {/* horizontal arrow (md+) */}
              <svg className="hidden lg:block w-full h-4" viewBox="0 0 32 16" fill="none">
                <motion.path
                  d="M2 8 H26 M21 3 L26 8 L21 13"
                  stroke="hsl(var(--primary) / 0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 + 0.25 }}
                />
              </svg>
              {/* vertical arrow (mobile) */}
              <svg className="lg:hidden h-full w-4" viewBox="0 0 16 28" fill="none">
                <path
                  d="M8 2 V22 M3 17 L8 22 L13 17"
                  stroke="hsl(var(--primary) / 0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
};
