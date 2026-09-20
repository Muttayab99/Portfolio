import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Github, ExternalLink, Mail } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PipelineDiagram } from '@/components/case-study/PipelineDiagram';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { caseStudies, getProject } from '@/content/projects';
import { profile } from '@/content/profile';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const Section = ({
  eyebrow,
  title,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  /** Render the body full-width under the heading (for diagrams). */
  wide?: boolean;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className={`py-10 md:py-14 border-t border-border ${wide ? 'space-y-8' : 'grid md:grid-cols-[180px_1fr] gap-4 md:gap-12'}`}
  >
    <div>
      <div className="font-mono text-xs tracking-widest uppercase text-brand/70">{eyebrow}</div>
      <h2 className="font-heading font-bold text-xl mt-1">{title}</h2>
    </div>
    <div className="min-w-0">{children}</div>
  </motion.section>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
        <span className="text-brand mt-1 shrink-0">▹</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const ProjectPage = () => {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  const cs = project?.caseStudy;

  useDocumentMeta(project ? `${project.title} case study` : undefined, project?.tagline);

  if (!project || !cs) return <Navigate to="/#projects" replace />;

  const idx = caseStudies.findIndex((p) => p.slug === slug);
  const prev = caseStudies[(idx - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 max-w-5xl pt-32 md:pt-40 pb-24">
        {/* Header */}
        <motion.div {...fade(0)}>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-brand transition-colors"
          >
            <ArrowLeft size={14} /> All projects
          </Link>
        </motion.div>

        <motion.div {...fade(0.05)} className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs tracking-widest uppercase text-muted-foreground">
          <span>Case study</span>
          <span aria-hidden>•</span>
          <span>{project.year}</span>
          {project.org && (
            <>
              <span aria-hidden>•</span>
              <span className="text-brand">{project.org}</span>
            </>
          )}
        </motion.div>

        <motion.h1
          {...fade(0.1)}
          className="mt-4 font-heading font-bold tracking-tight text-4xl md:text-6xl"
        >
          {project.title}
        </motion.h1>
        <motion.p {...fade(0.15)} className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl leading-snug">
          {project.tagline}
        </motion.p>
        <motion.p {...fade(0.2)} className="mt-3 text-sm text-muted-foreground/80">
          {cs.context}
        </motion.p>

        {/* Highlights */}
        <motion.dl
          {...fade(0.25)}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {cs.highlights.map((h) => (
            <div key={h.label} className="glass-card rounded-xl px-5 py-4">
              <dd className="font-heading font-bold text-2xl md:text-3xl tracking-tight">{h.value}</dd>
              <dt className="text-xs text-muted-foreground mt-1">{h.label}</dt>
            </div>
          ))}
        </motion.dl>

        {/* Stack + links */}
        <motion.div {...fade(0.3)} className="mt-6 flex flex-wrap items-center gap-2">
          {project.tech.map((t) => (
            <span key={t} className="text-xs font-mono bg-brand/10 text-brand px-2.5 py-1 rounded-md">
              {t}
            </span>
          ))}
          <span className="flex-1" />
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors"
            >
              <Github size={16} /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors"
            >
              <ExternalLink size={16} /> Live
            </a>
          )}
        </motion.div>

        <div className="mt-12">
          <Section eyebrow="01" title="The problem">
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{cs.problem}</p>
          </Section>

          <Section eyebrow="02" title="Approach">
            <Bullets items={cs.approach} />
          </Section>

          <Section eyebrow="03" title="How it fits together" wide>
            <PipelineDiagram stages={cs.pipeline} />
          </Section>

          <Section eyebrow="04" title="Outcomes">
            <Bullets items={cs.outcomes} />
          </Section>

          <Section eyebrow="05" title="What I learned">
            <Bullets items={cs.learnings} />
          </Section>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 glass-card rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6"
        >
          <div className="flex-1">
            <h3 className="font-heading font-bold text-2xl">Working on something similar?</h3>
            <p className="text-muted-foreground mt-2">
              I'm {profile.availability.toLowerCase()} and usually reply within a day.
            </p>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
          >
            <Mail size={16} /> Get in touch
          </a>
        </motion.div>

        {/* Prev / next */}
        {caseStudies.length > 1 && (
          <nav className="mt-12 grid sm:grid-cols-2 gap-3" aria-label="Other case studies">
            <Link
              to={`/projects/${prev.slug}`}
              className="group glass-card rounded-xl p-5 hover:border-brand/50 transition-colors"
            >
              <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                <ArrowLeft size={12} /> Previous
              </div>
              <div className="font-heading font-semibold mt-1 group-hover:text-brand transition-colors">
                {prev.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{prev.tagline}</div>
            </Link>
            <Link
              to={`/projects/${next.slug}`}
              className="group glass-card rounded-xl p-5 hover:border-brand/50 transition-colors sm:text-right"
            >
              <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 sm:justify-end">
                Next <ArrowRight size={12} />
              </div>
              <div className="font-heading font-semibold mt-1 group-hover:text-brand transition-colors">
                {next.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{next.tagline}</div>
            </Link>
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProjectPage;
