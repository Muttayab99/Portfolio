import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { useEffect } from 'react';
import { AmbientGlow } from './AmbientGlow';

const socialLinks = [
  { icon: Github, href: 'https://github.com/Muttayab99', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/m-muttayab', label: 'LinkedIn' },
  { icon: Mail, href: '#contact', label: 'Email' },
];

export const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const x1 = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const y1 = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);
  const x2 = useTransform(mouseX, [0, window.innerWidth], [20, -20]);
  const y2 = useTransform(mouseY, [0, window.innerHeight], [20, -20]);

  return (
    <section className="hero min-h-screen flex flex-col justify-center relative overflow-hidden bg-background">
      <AmbientGlow />
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 mt-20 lg:mt-0">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-16 lg:gap-[12vw] xl:gap-[15vw]">
          <div className="max-w-xl lg:max-w-[45vw]">
            {/* Status Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 font-mono text-xs tracking-wider text-primary mb-6 uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              OPEN TO WORK
              <span className="mx-2 text-muted-foreground">•</span>
              LAHORE <span className="mx-1">↔</span> REMOTE
            </motion.div>

            {/* Role Tag */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-muted-foreground font-mono text-sm md:text-base mb-4 tracking-widest uppercase"
            >
              AI Engineer · Data Scientist
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-4xl lg:text-[3.5vw] leading-tight font-bold font-heading mb-4 tracking-tight whitespace-nowrap"
            >
              <span className="text-foreground">Muhammad</span> <span className="text-muted-foreground font-serif italic font-normal">Muttayab.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-2xl md:text-3xl lg:text-[2.2vw] font-bold font-heading text-muted-foreground mb-10 leading-tight"
            >
              I build intelligent systems that ship ROI.
            </motion.h2>

            {/* Company Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-4 text-sm font-mono text-muted-foreground mb-10 tracking-widest uppercase"
            >
              <span>NEURALOGIC</span>
              <span>•</span>
              <span>SYSTEMS LTD</span>
              <span>•</span>
              <span>ADDO AI</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-wrap gap-4 mb-12 lg:mb-0"
            >
              <motion.a
                href="#projects"
                className="bg-primary text-primary-foreground rounded-full py-3 px-7 font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)] dark:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See the work →
              </motion.a>
              <motion.a
                href="#contact"
                className="px-6 md:px-8 py-3 md:py-4 rounded-full text-sm font-semibold border-2 border-foreground/20 hover:border-foreground/50 text-foreground bg-transparent transition-all hover:bg-muted"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in touch
              </motion.a>
            </motion.div>
          </div>

          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 1.2, type: 'spring', stiffness: 100 }}
            className="w-full max-w-[240px] sm:max-w-[260px] lg:max-w-none lg:w-[20vw] xl:w-[18vw] relative mt-10 lg:mt-0 shrink-0"
          >
            <div className="aspect-square rounded-2xl overflow-hidden glass-card relative z-10 hover:border-primary/50 transition-colors duration-500">
              <img 
                src="/profile.jpg" 
                alt="Muhammad Muttayab" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
            </div>
            {/* Decorative back-border */}
            <div className="absolute -z-10 top-6 -right-6 w-full h-full rounded-2xl border-2 border-zinc-500/30" />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
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
        className="fixed right-6 xl:right-10 bottom-0 hidden lg:flex flex-col items-center gap-4 after:content-[''] after:w-px after:h-16 lg:after:h-24 after:bg-primary/30"
      >
        <a
          href="mailto:muhammadmuttayab09@gmail.com"
          className="font-mono text-xs tracking-[0.2em] text-muted-foreground hover:text-primary hover:-translate-y-2 transition-all duration-300 py-4"
          style={{ writingMode: 'vertical-rl' }}
        >
          muhammadmuttayab09@gmail.com
        </a>
      </motion.div>

      {/* Social Bar (Desktop - Left) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed left-6 xl:left-10 bottom-0 hidden lg:flex flex-col items-center gap-4 after:content-[''] after:w-px after:h-16 lg:after:h-24 after:bg-primary/30"
      >
        {socialLinks.map((social) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary hover:-translate-y-2 transition-all duration-300 p-2"
            aria-label={social.label}
          >
            <social.icon size={22} />
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};
