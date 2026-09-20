import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { experiences } from '@/content/experience';
import { getProject } from '@/content/projects';

export const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="experience" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="section-heading">Where I've Worked</h2>
            <div className="flex-1 h-px bg-border max-w-xs" />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Tab List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-l border-border"
            >
              {experiences.map((job, index) => (
                <button
                  key={job.company}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={activeIndex === index}
                  className={`px-4 py-3 text-sm font-mono text-left whitespace-nowrap transition-all duration-300 relative ${
                    activeIndex === index
                      ? "text-brand bg-brand/5"
                      : "text-muted-foreground hover:text-brand hover:bg-brand/5"
                  }`}
                >
                  {job.company}
                  {activeIndex === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 bottom-0 md:left-0 md:top-0 md:bottom-0 h-0.5 md:h-auto md:w-0.5 w-full md:rounded-none bg-brand"
                    />
                  )}
                </button>
              ))}
            </motion.div>

            {/* Content */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 min-w-0 min-h-[500px] sm:min-h-[400px] md:min-h-[350px]"
            >
              <h3 className="text-xl font-semibold mb-1">
                {experiences[activeIndex].title}{" "}
                <span className="text-brand">
                  @ {experiences[activeIndex].company}
                </span>
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-brand" />
                  {experiences[activeIndex].period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-brand" />
                  {experiences[activeIndex].location}
                </span>
                <span className="px-2 py-0.5 bg-brand/10 text-brand rounded text-xs font-mono">
                  {experiences[activeIndex].type}
                </span>
              </div>

              <ul className="space-y-3">
                {experiences[activeIndex].description.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex gap-3 text-muted-foreground text-base md:text-lg leading-relaxed"
                  >
                    <span className="text-brand mt-1.5 flex-shrink-0">▹</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              {experiences[activeIndex].projects?.some((slug) => getProject(slug)?.caseStudy) && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {experiences[activeIndex].projects!
                    .map(getProject)
                    .filter((p) => p?.caseStudy)
                    .map((p) => (
                      <Link
                        key={p!.slug}
                        to={`/projects/${p!.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border border-border hover:border-brand/50 hover:text-brand transition-colors"
                      >
                        Case study: {p!.title} <ArrowUpRight size={12} />
                      </Link>
                    ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
