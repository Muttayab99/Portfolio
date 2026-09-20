import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { profile } from '@/content/profile';

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="section-heading">About Me</h2>
            <div className="flex-1 h-px bg-border max-w-xs" />
          </div>

          <div className="grid md:grid-cols-[minmax(0,240px)_1fr] lg:grid-cols-[minmax(0,300px)_1fr] gap-10 lg:gap-16 items-start">
            {/* Photo (moved here from the hero) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, type: 'spring', stiffness: 110 }}
              className="relative w-full max-w-[240px] md:max-w-none mx-auto md:mx-0 md:sticky md:top-32"
            >
              <div className="aspect-square rounded-2xl overflow-hidden glass-card relative z-10 hover:border-brand/50 transition-colors duration-500">
                <img
                  src="/profile.jpg"
                  alt={profile.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand/10 mix-blend-overlay hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
              </div>
              <div className="absolute -z-10 top-5 -right-5 w-full h-full rounded-2xl border-2 border-zinc-500/30" />
            </motion.div>

            <div className="space-y-4">
            {/* Main Content */}
            {profile.about.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              Here are a few technologies I've been working with recently:
            </motion.p>

            {/* Technology Grid */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4"
            >
              {profile.recentTech.map((tech) => (
                <li
                  key={tech}
                  className="text-base text-muted-foreground flex items-center gap-2"
                >
                  <span className="text-brand">▹</span>
                  {tech}
                </li>
              ))}
            </motion.ul>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
