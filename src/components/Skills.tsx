import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Code2, Database, Cloud, Brain,
  Layers, BarChart3, Server, Cpu,
  Terminal, Zap, Network, Camera,
  type LucideIcon,
} from 'lucide-react';
import { skills, skillGroups, type SkillIcon } from '@/content/skills';

const ICONS: Record<SkillIcon, LucideIcon> = {
  code: Code2, terminal: Terminal, brain: Brain, cpu: Cpu, layers: Layers, database: Database,
  server: Server, camera: Camera, cloud: Cloud, zap: Zap, network: Network, chart: BarChart3,
};

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-24 md:py-32 relative" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="section-heading">Stack</h2>
            <div className="flex-1 h-px bg-border max-w-xs" />
          </div>

          {/* Skills Grouped Grid */}
          <div className="space-y-12 pt-4">
            {skillGroups.map((group, groupIdx) => (
              <div key={group.title} className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center p-4 rounded-xl hover:bg-foreground/5 transition-colors duration-300 border border-transparent hover:border-foreground/10">
                <h3 className="text-sm font-mono tracking-widest text-brand uppercase shrink-0 md:w-56 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand/50 animate-pulse" />
                  {group.title}:
                </h3>
                <div className="flex flex-wrap gap-2.5 flex-1">
                  {skills.filter((sk) => sk.category.some((c) => group.match.includes(c))).map((skill, index) => {
                    const Icon = ICONS[skill.icon];
                    return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.1 * groupIdx + 0.05 * index }}
                      className="glass-card rounded-md px-3 py-1.5 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:border-brand hover:shadow-[0_0_15px_hsl(var(--brand)/0.3)] cursor-default group bg-background/50 border-foreground/5"
                    >
                      <div className="text-brand/70 group-hover:text-brand transition-colors duration-200">
                        <Icon size={14} />
                      </div>
                      <span className="font-mono text-xs text-foreground/90 tracking-wide group-hover:text-brand transition-colors duration-200">
                        {skill.name}
                      </span>
                    </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
