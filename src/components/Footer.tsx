import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/Muttayab99', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/m-muttayab', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:muhammadmuttayab09@gmail.com', label: 'Email' },
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
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
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
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-1 sm:gap-2 hover:text-primary transition-colors text-center">
              <span>© {new Date().getFullYear()} Muhammad Muttayab</span>
              <span className="hidden sm:inline">·</span>
              <a href="https://linkedin.com/in/m-muttayab" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/m-muttayab
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
