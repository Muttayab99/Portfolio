import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/Muttayab99', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/m-muttayab', label: 'LinkedIn' },
  { icon: Mail, href: '#contact', label: 'Email' },
];

const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayText}</span>;
};

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
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-full blur-3xl"
        style={{ x: x1, y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-cyan-500/10 to-primary/10 rounded-full blur-3xl"
        style={{ x: x2, y: y2 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="container mx-auto px-6 lg:px-24 relative z-10 mt-20 lg:mt-0">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-[clamp(3rem,8vw,8rem)]">
          <div className="max-w-2xl flex-1">
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-primary font-mono text-sm md:text-base mb-4"
            >
              Hi, my name is
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-[clamp(2.5rem,5vw,5.5rem)] leading-tight font-bold font-heading mb-2"
            >
              Muhammad Muttayab.
            </motion.h1>

            {/* Tagline with animated text reveal */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-[clamp(1.875rem,4vw,4.5rem)] leading-tight font-bold font-heading text-muted-foreground mb-6"
            >
              <AnimatedText text="I build intelligent systems that ship ROI." delay={0.9} />
            </motion.h2>


            {/* Trust Signal / Stat Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-mono text-muted-foreground/80 mb-8 mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-primary">▹</span>
                2+ Year Experience
              </div>
              <span className="hidden sm:inline text-border/50">•</span>
              <div className="flex items-center gap-2">
                <span className="text-primary">▹</span>
                5 Production AI Systems Shipped
              </div>
              <span className="hidden lg:inline text-border/50">•</span>
              <div className="flex items-center gap-2">
                <span className="text-primary">▹</span>
                Leading team at current company
              </div>
            </motion.div>

            {/* CTA Buttons with enhanced animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-wrap gap-4 mb-12 lg:mb-0"
            >
              <motion.a
                href="#projects"
                className="btn-primary relative overflow-hidden group"
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(20, 184, 166, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">View My Work</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/m-muttayab"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline relative overflow-hidden group flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Linkedin size={18} className="relative z-10" />
                <span className="relative z-10">Connect on LinkedIn</span>
                <motion.div
                  className="absolute inset-0 border-2 border-primary"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>
          </div>

          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 1.2, type: 'spring', stiffness: 100 }}
            className="w-full max-w-[280px] sm:max-w-sm lg:w-[clamp(300px,35vw,450px)] lg:max-w-none relative mt-10 lg:mt-0"
          >
            <div className="aspect-square rounded-2xl overflow-hidden glass-card relative z-10 hover:border-primary/50 transition-colors duration-500">
              <img 
                src="/profile.jpg" 
                alt="Muhammad Muttayab" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay hover:opacity-0 transition-opacity duration-500" />
            </div>
            {/* Decorative back-border */}
            <div className="absolute -z-10 top-6 -right-6 w-full h-full rounded-2xl border-2 border-primary/30" />
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
        className="fixed right-6 xl:right-10 bottom-0 hidden lg:flex flex-col items-center gap-8 after:content-[''] after:w-px after:h-32 after:bg-primary/30"
      >
        <a
          href="mailto:muhammadmuttayab09@gmail.com"
          className="font-mono text-sm tracking-[0.2em] text-muted-foreground hover:text-primary hover:-translate-y-2 transition-all duration-300 py-4"
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
        className="fixed left-6 xl:left-10 bottom-0 hidden lg:flex flex-col items-center gap-6 after:content-[''] after:w-px after:h-32 after:bg-primary/30"
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
