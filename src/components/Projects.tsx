import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ExternalLink,
  Github,
  Folder,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import * as React from "react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  type: ProjectType[];
  featured: boolean;
}

const projects: Project[] = [
  {
    title: "Vesta",
    description:
      "Engineered an AI system for automated concrete takeoffs and cost estimation on architectural plans. Developed a computer vision pipeline by fine-tuning SAM3 (848M parameters) on AWS EC2 for precise element segmentation, managed via Roboflow. Integrated PaddleOCR and Google Vertex AI to extract structured data, exposing the inference pipeline through a robust production-grade FastAPI service.",
    tech: ["SAM3", "PaddleOCR", "Vertex AI", "FastAPI", "Roboflow"],
    github: "https://github.com/Muttayab99",
    type: ["ai"],
    featured: true,
  },
  {
    title: "Legado",
    description:
      "Engineered an AI document processing API to audit property records against complex rule checklists. Orchestrated a robust multi-modal OCR pipeline (Tesseract, Google Vision, GPT-4o) specifically tuned to extract accurate data from highly degraded, handwritten 1970s/80s documents. Backed by a secure FastAPI architecture featuring JWT, HMAC, and async background tasks for high-throughput analytics.",
    tech: ["FastAPI", "Tesseract OCR", "Google Vision", "GPT-4o", "Python"],
    github: "https://github.com/Muttayab99",
    type: ["ai"],
    featured: true,
  },
  {
    title: "JustAssemble",
    description:
      "Architected a LangChain multi-agent system for an advertising firm, where specialized AI agents collaborate to perform competitor SWOT analysis and analyze traffic via 15+ SEMrush endpoints. Integrated with AWS SQS/S3, it outputs a detailed analytics dashboard providing actionable summaries for advertising strategy.",
    tech: ["Python", "LangChain", "AWS SQS/S3", "SEMrush API", "Asyncio"],
    github: "https://github.com/Muttayab99",
    type: ["ai", "data"],
    featured: true,
  },
  {
    title: "Aerux - Intracranial Aneurysm Detection",
    description:
      "Built a medical imaging system using a multi-task ResNet50 pipeline in PyTorch. Implemented robust preprocessing with OpenCV and SimpleITK (N4 bias correction, Sato vesselness). Developed an attention-based fusion model for 2.5D DICOM slices, leveraging mixed-precision training to optimize localization on the RSNA dataset.",
    tech: ["PyTorch", "OpenCV", "SimpleITK", "ResNet50", "Medical Imaging"],
    github:
      "https://github.com/Muttayab99/MULTI-MODAL-2.5D-ATTENTION-FUSION-FOR-INTRACRANIAL-ANEURYSM-DETECTION/tree/main",
    type: ["ai"],
    featured: false,
  },
  {
    title: "Race- MCP Orchestrator",
    description:
      "Engineered an intelligent multi-agent system with FastAPI and Streamlit, orchestrating workflows for video analysis and web scraping. Implemented NLP pipelines using LangChain and Llama-4, optimizing inference via Groq API.",
    tech: ["FastAPI", "LangChain", "Llama-4", "Streamlit", "Groq"],
    github:
      "https://github.com/Muttayab99/AI-Powered-Multi-Agent-Chatbot-System",
    type: ["ai", "web"],
    featured: false,
  },
  {
    title: "La Musica - Music Recommendation System",
    description:
      "Developed a real-time recommendation platform using Apache Kafka, MongoDB, and Flask. Built audio feature extraction pipelines with Librosa (MFCCs) and utilized tree-based ScaNN for efficient vector retrieval.",
    tech: ["Kafka", "MongoDB", "Flask", "Librosa", "ScaNN"],
    github:
      "https://github.com/Muttayab99/Music-Recommendation-System-using-Scann-Near-Neighbor",
    type: ["ai", "data"],
    featured: false,
  },
  {
    title: "DisasterReliefAI",
    description:
      "Built an emergency resource allocation platform using BERT transformers for semantic context interpretation. Applied geospatial algorithms and LSAP optimization to prioritize aid based on urgency and proximity.",
    tech: ["BERT", "NLP", "Geospatial", "Optimization"],
    github:
      "https://github.com/Muttayab99/Disaster-Relief-AI-Recommendation-System",
    type: ["ai"],
    featured: false,
  },
  {
    title: "VendorSys",
    description:
      "Designed a full-stack vendor management platform with Node.js and robust SQL backend. Implemented RBAC, cascading constraints, and automated trigger notifications for financial data security.",
    tech: ["Node.js", "SQL", "RBAC", "REST API"],
    github:
      "https://github.com/Muttayab99/Website-based-Vendor-Management-System",
    type: ["web"],
    featured: false,
  },
  {
    title: "Real-time Streaming Analytics",
    description:
      "Implemented Apriori, PCY, and PageRank algorithms for high-velocity data analysis. Utilized Apache Kafka for stream processing, enabling scalable frequent-itemset mining.",
    tech: ["Kafka", "Apriori", "PageRank", "PySpark"],
    github: "https://github.com/Muttayab99/Frequent-Item-sets-Mining",
    type: ["data"],
    featured: false,
  },
  {
    title: "OIL",
    description:
      "Architected an end-to-end financial data pipeline using Azure Data Factory to orchestrate data movement between blob storage. Implemented complex transformations using Python in Azure Databricks, processing data into Delta tables to generate final insights. Culminated in a comprehensive Power BI dashboard for business reporting.",
    tech: [
      "Azure Data Factory",
      "Azure Databricks",
      "Python",
      "Delta Tables",
      "Power BI",
    ],
    github: "https://github.com/Muttayab99",
    type: ["data"],
    featured: false,
  },
  {
    title: "Merc - Personal Financial Vallet",
    description:
      "Developed a personal financial wallet for tracking expenses and managing budgets. Built with Python to provide clear insights into financial habits.",
    tech: ["Python", "Financial Data", "Analytics"],
    github: "https://github.com/Muttayab99/MERC",
    type: ["data"],
    featured: false,
  },
];

const filters: { key: ProjectType; label: string }[] = [
  { key: "all", label: "All Projects" },
  { key: "ai", label: "AI/ML" },
  { key: "data", label: "Data Engineering" },
  { key: "web", label: "Web Development" },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState<ProjectType>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.type.includes(activeFilter));

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured);

  // Safe index to prevent out-of-bounds crash during filter transitions
  const safeSpotlightIndex =
    spotlightIndex >= featuredProjects.length ? 0 : spotlightIndex;

  // Pagination logic (Sliding window of 1 item per click)
  const itemsPerPage = 3;
  const totalSlides = Math.max(1, otherProjects.length - itemsPerPage + 1);
  const paginatedProjects = otherProjects.slice(
    currentPage,
    currentPage + itemsPerPage,
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(0);
    setSpotlightIndex(0);
  }, [activeFilter]);

  // Auto-rotate spotlight projects
  React.useEffect(() => {
    if (featuredProjects.length <= 1) return;
    const interval = setInterval(() => {
      setSpotlightIndex(
        (prev) => (prev + 1) % Math.min(3, featuredProjects.length),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProjects.length]);

  return (
    <section id="projects" className="py-24 md:py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-8 max-w-4xl mx-auto">
            <h2 className="section-heading">
              <span className="section-number">04.</span>
              Things I've Built
            </h2>
            <div className="flex-1 h-px bg-border max-w-xs" />
          </div>

          {/* Filters with smooth animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center mb-12"
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 relative overflow-hidden ${
                  activeFilter === filter.key
                    ? "text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeFilter === filter.key && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Project Spotlight Slider */}
          {featuredProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="mb-16 max-w-4xl mx-auto"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                <span className="text-gradient">Featured Spotlight</span>
              </h3>
              <div className="relative h-[400px] md:h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={spotlightIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div
                      className="glass-card rounded-lg p-6 md:p-8 h-full cursor-pointer hover:border-primary/50 transition-all"
                      onClick={() =>
                        setSelectedProject(featuredProjects[safeSpotlightIndex])
                      }
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Star size={16} className="fill-primary text-primary" />
                        <span className="text-primary font-mono text-xs">
                          Spotlight Project
                        </span>
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold mb-3">
                        {featuredProjects[safeSpotlightIndex].title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {featuredProjects[safeSpotlightIndex].description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredProjects[safeSpotlightIndex].tech
                          .slice(0, 5)
                          .map((tech) => (
                            <span
                              key={tech}
                              className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Spotlight indicators */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {featuredProjects.slice(0, 3).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSpotlightIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === spotlightIndex
                          ? "bg-primary w-8"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.h3
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center text-xl font-semibold mb-12 mt-8"
          >
            Other Noteworthy Projects
          </motion.h3>

          {/* Premium Projects Grid for Other Projects */}
          <div className="projects-grid mb-8 min-h-[450px]">
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="project-card cursor-pointer h-full w-full"
                onClick={() => setSelectedProject(project)}
              >
                {/* Text Zone - Solid background, structured spacing */}
                <div className="flex flex-col flex-1 mt-6">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-mono"
                      >
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
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
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
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                aria-label="Previous projects"
              >
                <ChevronLeft size={24} />
              </motion.button>

              <div className="flex gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentPage
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalSlides - 1, prev + 1))
                }
                disabled={currentPage === totalSlides - 1}
                className="p-2 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                aria-label="Next projects"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          )}

          {/* Project Modal */}
          <Modal
            open={!!selectedProject}
            onOpenChange={() => setSelectedProject(null)}
          >
            <ModalContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              {selectedProject && (
                <>
                  <ModalHeader>
                    <ModalTitle className="text-2xl font-bold flex items-center gap-2">
                      {selectedProject.featured && (
                        <Star size={20} className="fill-primary text-primary" />
                      )}
                      {selectedProject.title}
                    </ModalTitle>
                  </ModalHeader>

                  <div className="space-y-4 pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-2">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((tech) => (
                          <span
                            key={tech}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      {selectedProject.github && !selectedProject.featured && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          <Github size={18} />
                          View Code
                        </a>
                      )}
                      {selectedProject.demo && !selectedProject.featured && (
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
