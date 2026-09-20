import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown, ArrowRight } from 'lucide-react';
import { HeroBackground } from './HeroBackground';
import { Magnetic } from './Magnetic';
import { profile } from '@/content/profile';

const socialLinks = [
  { icon: Github, href: profile.links.github, label: 'GitHub', external: true },
  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn', external: true },
  { icon: Mail, href: `mailto:${profile.email}`, label: 'Email', external: false },
];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

/** Name with a one-time per-character reveal. Screen readers get the plain string. */
const StaggeredName = ({ text, className, delay }: { text: string; className?: string; delay: number }) => {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: '0.35em', filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, delay: delay + i * 0.035, ease: [0.2, 0.65, 0.3, 1] }}
        >
          {ch === ' ' ? String.fromCharCode(160) : ch}
        </motion.span>
      ))}
    </span>
  );
};

export const Hero = () => {
  const reduce = useReducedMotion();

  return (
    <section className="hero min-h-screen flex flex-col justify-center relative overflow-hidden bg-background">
      {/* ---- Backdrop: globe canvas + grid + readability gradients ---- */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <HeroBackground className="absolute inset-0 opacity-85" />

        {/* Fine grid, only visible near the text block */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground) / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.12) 1px, transparent 1px), linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)',
            backgroundSize: '96px 96px, 96px 96px, 24px 24px, 24px 24px',
            maskImage: 'radial-gradient(ellipse 70% 75% at 24% 58%, black 0%, rgba(0,0,0,0.8) 45%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 75% at 24% 58%, black 0%, rgba(0,0,0,0.8) 45%, transparent 100%)',
          }}
        />

        {/* Darken the left edge (text) and fade the bottom into the page */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 via-40% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 via-30% to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/70 to-transparent" />
      </div>

      {/* ---- Content ---- */}
      <div className="container mx-auto px-6 lg:pl-24 lg:pr-12 xl:pl-28 relative z-10 mt-24 lg:mt-0">
        <div className="max-w-2xl xl:max-w-3xl">
          {/* Status Line */}
          <motion.div
            {...rise(0.4)}
            className="flex items-center gap-2 font-mono text-xs tracking-wider text-brand mb-6 uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {profile.availability}
            <span className="mx-2 text-muted-foreground">•</span>
            {profile.location.split(',')[0]} <span className="mx-1">↔</span> Remote
          </motion.div>

          {/* Role Tag */}
          <motion.p
            {...rise(0.5)}
            className="text-muted-foreground font-mono text-sm md:text-base mb-4 tracking-widest uppercase"
          >
            {profile.role.replace('&', '·')}
          </motion.p>

          {/* Greeting */}
          <motion.p {...rise(0.55)} className="font-mono text-base md:text-lg text-brand mb-3">
            Hi, it's me
          </motion.p>

          {/* Name — stacked, big, like a masthead */}
          <h1 className="font-heading font-bold tracking-tight leading-[0.95] mb-6 text-5xl sm:text-6xl lg:text-[5.2rem] xl:text-[6rem]">
            <span className="block">
              <StaggeredName text={profile.firstName} className="text-foreground" delay={0.55} />
            </span>
            <span className="block">
              <StaggeredName
                text={`${profile.lastName}.`}
                className="text-muted-foreground font-serif italic font-normal"
                delay={0.55 + profile.firstName.length * 0.035}
              />
            </span>
          </h1>

          {/* Headline */}
          <motion.h2
            {...rise(0.9)}
            className="text-2xl md:text-3xl font-bold font-heading text-muted-foreground mb-8 leading-tight max-w-xl"
          >
            {profile.headline}
          </motion.h2>

          {/* Company Social Proof */}
          <motion.div
            {...rise(1.05)}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-mono text-muted-foreground mb-10 tracking-widest uppercase"
          >
            {profile.workedWith.map((name, i) => (
              <span key={name} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden>•</span>}
                {name}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div {...rise(1.15)} className="flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full py-3 px-7 font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)] dark:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                See the work
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center px-6 md:px-8 py-3 rounded-full text-sm font-semibold border-2 border-foreground/20 hover:border-foreground/50 text-foreground bg-background/40 backdrop-blur-sm transition-all hover:bg-muted"
              >
                Get in touch
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-brand transition-colors z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: reduce ? 0 : [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5 },
          y: { repeat: Infinity, duration: 2 },
        }}
      >
        <ChevronDown size={32} />
      </motion.a>

      {/* Email Bar (Desktop - Right) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed right-6 xl:right-10 bottom-0 hidden lg:flex flex-col items-center gap-4 after:content-[''] after:w-px after:h-16 lg:after:h-24 after:bg-brand/30 z-10"
      >
        <a
          href={`mailto:${profile.email}`}
          className="font-mono text-xs tracking-[0.2em] text-muted-foreground hover:text-brand hover:-translate-y-2 transition-all duration-300 py-4"
          style={{ writingMode: 'vertical-rl' }}
        >
          {profile.email}
        </a>
      </motion.div>

      {/* Social Bar (Desktop - Left) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed left-6 xl:left-10 bottom-0 hidden lg:flex flex-col items-center gap-4 after:content-[''] after:w-px after:h-16 lg:after:h-24 after:bg-brand/30 z-10"
      >
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target={social.external ? '_blank' : undefined}
            rel={social.external ? 'noopener noreferrer' : undefined}
            className="text-muted-foreground hover:text-brand hover:-translate-y-2 transition-all duration-300 p-2"
            aria-label={social.label}
          >
            <social.icon size={22} />
          </a>
        ))}
      </motion.div>
    </section>
  );
};
