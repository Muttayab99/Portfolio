import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/content/profile';

const socialLinks = [
  { icon: Github, href: profile.links.github, label: 'GitHub', external: true },
  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn', external: true },
  { icon: Mail, href: `mailto:${profile.email}`, label: 'Email', external: false },
];

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Social Icons (Mobile) */}
          <div className="flex gap-6 lg:hidden">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.external ? '_blank' : undefined}
                rel={social.external ? 'noopener noreferrer' : undefined}
                className="text-muted-foreground hover:text-brand transition-colors"
                aria-label={social.label}
                whileHover={{ y: -2 }}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>

          {/* Credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full flex flex-col xl:flex-row justify-between items-center gap-4 xl:gap-0 text-[10px] sm:text-xs md:text-sm text-muted-foreground font-mono"
          >
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-1 sm:gap-2 hover:text-brand transition-colors text-center">
              <span>© {new Date().getFullYear()} {profile.name}</span>
              <span className="hidden sm:inline">·</span>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                {profile.links.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center xl:justify-end items-center gap-1.5 sm:gap-2 text-center mt-2 xl:mt-0 max-w-xs sm:max-w-none leading-relaxed">
              <span>Built with intention</span>
              <span className="hidden sm:inline">·</span>
              <span>React</span>
              <span>·</span>
              <span>Tailwind</span>
              <span>·</span>
              <span>Framer Motion</span>
              <span>·</span>
              <span>Vite</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
