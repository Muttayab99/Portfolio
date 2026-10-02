import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github, Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { projects, type Project, type ProjectType } from "@/content/projects";

type Filter = "all" | ProjectType;

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All Projects" },
  { key: "ai", label: "AI/ML" },
  { key: "data", label: "Data Engineering" },
  { key: "web", label: "Web Development" },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((p) => p.type.includes(activeFilter));

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured);

  // Pagination (sliding window of 1 item per click)
  const itemsPerPage = 3;
  const totalSlides = Math.max(1, otherProjects.length - itemsPerPage + 1);
  const paginatedProjects = otherProjects.slice(currentPage, currentPage + itemsPerPage);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter]);

  return (
    <section id="projects" className="py-24 md:py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-8 max-w-4xl mx-auto">
            <h2 className="section-heading">Things I've Built</h2>
            <div className="flex-1 h-px bg-border max-w-xs" />
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center mb-12"
            role="tablist"
            aria-label="Filter projects"
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.key}
                role="tab"
                aria-selected={activeFilter === filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 relative overflow-hidden ${
                  activeFilter === filter.key
                    ? "text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-brand/20 hover:text-brand"
                }`}
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeFilter === filter.key && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-brand"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Featured work: every featured project visible at once */}
          {featuredProjects.length > 0 && (
            <div className="mb-20 max-w-6xl mx-auto">
              <div className="flex items-baseline justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold">Featured work</h3>
                <span className="hidden sm:block text-sm text-muted-foreground">Production systems, with case studies</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featuredProjects.map((p, idx) => (
                  <motion.div
                    key={p.slug}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: reduce ? 0 : 0.3 + idx * 0.05, duration: 0.35 }}
                  >
                    <FeaturedCard project={p} onOpen={() => setSelectedProject(p)} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {otherProjects.length > 0 && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-center text-xl font-semibold mb-12 mt-8"
            >
              Other Noteworthy Projects
            </motion.h3>
          )}

          {/* Grid */}
          <div className="projects-grid mb-8 min-h-[450px]">
            {paginatedProjects.map((project) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="project-card cursor-pointer h-full w-full"
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedProject(project)}
              >
                <div className="flex flex-col flex-1 mt-6">
                  <div className="font-mono text-[11px] text-muted-foreground mb-2">{project.year}</div>
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <p className="text-sm text-brand/80 mb-3">{project.tagline}</p>
                  <p className="text-base text-muted-foreground mb-4 flex-1 line-clamp-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span key={tech} className="bg-brand/10 text-brand px-3 py-1 rounded-lg text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-auto border-t border-border/50 pt-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand transition-colors flex items-center gap-2 text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={16} /> Code
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand transition-colors flex items-center gap-2 text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center items-center gap-4 mb-12">
              <motion.button
                whileHover={reduce ? undefined : { scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand/10 transition-colors"
                aria-label="Previous projects"
              >
                <ChevronLeft size={24} />
              </motion.button>

              <div className="flex gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentPage ? "bg-brand w-6" : "bg-muted-foreground/30 w-2 hover:bg-brand/50"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === currentPage}
                  />
                ))}
              </div>

              <motion.button
                whileHover={reduce ? undefined : { scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage((prev) => Math.min(totalSlides - 1, prev + 1))}
                disabled={currentPage === totalSlides - 1}
                className="p-2 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand/10 transition-colors"
                aria-label="Next projects"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          )}

          {/* Modal (projects without a case study) */}
          <Modal open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <ModalContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              {selectedProject && (
                <>
                  <ModalHeader>
                    <ModalTitle className="text-2xl font-bold flex items-center gap-2">
                      {selectedProject.featured && <Star size={20} className="fill-brand text-brand" />}
                      {selectedProject.title}
                    </ModalTitle>
                    <ModalDescription>{selectedProject.tagline}</ModalDescription>
                  </ModalHeader>

                  <div className="space-y-4 pt-4">
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-2">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((tech) => (
                          <span key={tech} className="bg-brand/10 text-brand px-3 py-1 rounded-lg text-sm font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      {selectedProject.caseStudy && (
                        <Link
                          to={`/projects/${selectedProject.slug}`}
                          className="btn-primary inline-flex items-center gap-2"
                          onClick={() => setSelectedProject(null)}
                        >
                          Read case study <ArrowRight size={18} />
                        </Link>
                      )}
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${selectedProject.caseStudy ? "btn-outline" : "btn-primary"} inline-flex items-center gap-2`}
                        >
                          <Github size={18} />
                          View Code
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline inline-flex items-center gap-2"
                        >
                          <ExternalLink size={18} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </ModalContent>
          </Modal>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Featured card: what the project is, in one plain sentence, and where it was
 * built. Details live on the case study page, so the card stays quiet.
 */
const FeaturedCard = ({ project, onOpen }: { project: Project; onOpen: () => void }) => {
  const body = (
    <>
      <p className="text-xs text-muted-foreground mb-2">
        {project.org ? `${project.org} · ` : ""}{project.year}
      </p>
      <h4 className="text-lg font-semibold leading-snug">{project.title}</h4>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary ?? project.tagline}</p>

      <p className="mt-auto pt-6 text-xs text-muted-foreground/80 truncate">
        {project.tech.slice(0, 4).join("  ·  ")}
      </p>

      {/* The whole card is the link; this is its visible call to action. */}
      <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 group-hover:border-brand/60 group-hover:bg-brand/10 group-hover:text-brand">
        {project.caseStudy ? "Read case study" : "View details"}
        <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </>
  );

  const className =
    "group h-full flex flex-col rounded-xl border border-border/70 bg-card/40 p-6 transition-colors duration-200 hover:border-brand/50 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60";

  return project.caseStudy ? (
    <Link to={`/projects/${project.slug}`} className={className} aria-label={`${project.title} case study`}>
      {body}
    </Link>
  ) : (
    <div className={className} onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpen()}>
      {body}
    </div>
  );
};
