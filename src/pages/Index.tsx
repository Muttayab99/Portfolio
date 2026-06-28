import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { CursorEffect } from '@/components/CursorEffect';
import { FloatingChatButton } from '@/components/FloatingChatButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CursorEffect />
      <Navigation />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default Index;
