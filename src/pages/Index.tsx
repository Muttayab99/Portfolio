import React, { Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { SectionSkeleton } from '@/components/SectionSkeleton';
import { useDocumentMeta } from '@/hooks/use-document-meta';

const About = React.lazy(() => import('@/components/About').then((m) => ({ default: m.About })));
const Skills = React.lazy(() => import('@/components/Skills').then((m) => ({ default: m.Skills })));
const Experience = React.lazy(() => import('@/components/Experience').then((m) => ({ default: m.Experience })));
const Projects = React.lazy(() => import('@/components/Projects').then((m) => ({ default: m.Projects })));
const Contact = React.lazy(() => import('@/components/Contact').then((m) => ({ default: m.Contact })));
const Footer = React.lazy(() => import('@/components/Footer').then((m) => ({ default: m.Footer })));
const AskMe = React.lazy(() => import('@/components/AskMe').then((m) => ({ default: m.AskMe })));

const Index = () => {
  useDocumentMeta(undefined);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative">
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <AskMe />
      </Suspense>
    </div>
  );
};

export default Index;
