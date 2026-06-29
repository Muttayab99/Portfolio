import React, { Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { CursorEffect } from '@/components/CursorEffect';
import { SectionSkeleton } from '@/components/SectionSkeleton';

const About = React.lazy(() => import('@/components/About').then(module => ({ default: module.About })));
const Skills = React.lazy(() => import('@/components/Skills').then(module => ({ default: module.Skills })));
const Experience = React.lazy(() => import('@/components/Experience').then(module => ({ default: module.Experience })));
const Projects = React.lazy(() => import('@/components/Projects').then(module => ({ default: module.Projects })));
const Contact = React.lazy(() => import('@/components/Contact').then(module => ({ default: module.Contact })));
const Footer = React.lazy(() => import('@/components/Footer').then(module => ({ default: module.Footer })));
const FloatingChatButton = React.lazy(() => import('@/components/FloatingChatButton').then(module => ({ default: module.FloatingChatButton })));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CursorEffect />
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
        <FloatingChatButton />
      </Suspense>
    </div>
  );
};

export default Index;
