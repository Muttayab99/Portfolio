import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  type: string;
}

const experiences: Job[] = [
  {
    title: "AI Engineer & Project Lead",
    company: "Neuralogic",
    location: "Remote",
    period: "Jan 2026 - Present",
    type: "Full-time",
    description: [
      "Led computer vision pipelines for automated construction cost estimation, fine-tuning SAM3 (848M parameters) on a custom dataset using an AWS EC2 instance with 80 GB VRAM, achieving precise element segmentation on architectural plans.",
      "Integrated PaddleOCR and Google Vertex AI to extract structured cost data from construction documents, reducing manual estimation effort significantly.",
      "Built and deployed production-grade FastAPI services to expose AI inference pipelines, including annotation management workflows and model prediction endpoints.",
      "Managed training data curation and model fine-tuning using Roboflow, overseeing annotation quality control to ensure high-fidelity ground truth for CV models.",
      "Leading a second workstream as Project Lead for MEP (Mechanical, Electrical & Plumbing) plan estimation, coordinating team deliverables across model development and integration and architecting a contract automation module leveraging GenAI to auto-generate and review construction contracts.",
    ],
  },
  {
    title: "AI Engineer",
    company: "SAynt AI",
    location: "Remote",
    period: "Oct 2025 - Dec 2025",
    type: "Contract",
    description: [
      "Architected a multi-agent competitor analysis system in Python (Asyncio, Pydantic), integrating 15+ SEMrush endpoints with AWS SQS and S3 for scalable message queuing and storage.",
      "Engineered an AI document processing API using FastAPI, orchestrating multi-modal workflows with Tesseract OCR, Google Vision, and OpenAI GPT-4o.",
      "Designed secure production architecture featuring JWT authentication, HMAC security, and asynchronous background task management.",
    ],
  },
  {
    title: "Gen-AI Intern",
    company: "Addo AI",
    location: "Remote",
    period: "July 2025 - Aug 2025",
    type: "Internship",
    description: [
      "Developed advanced RAG workflows using LangChain and LangGraph, mastering Prompt Engineering and Model Context Protocol (MCP).",
      "Integrated LLMs into business logic to automate complex decision-making processes, improving workflow efficiency.",
    ],
  },
  {
    title: "Data Engineering Intern",
    company: "Systems Limited",
    location: "Lahore, Pakistan",
    period: "June 2024 - Aug 2024",
    type: "Internship",
    description: [
      "Optimized enterprise ETL processes using Azure Data Factory and Azure Databricks, enhancing data throughput and reliability.",
      "Implemented distributed data transformation pipelines using PySpark to extract actionable insights from large-scale datasets.",
      "Developed interactive dashboards in Power BI to visualize KPIs and communicate data findings to executive stakeholders.",
    ],
  },
];

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
            <h2 className="section-heading">
              <span className="section-number">03.</span>
              Where I've Worked
            </h2>
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
                  className={`px-4 py-3 text-sm font-mono text-left whitespace-nowrap transition-all duration-300 relative ${
                    activeIndex === index
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {job.company}
                  {activeIndex === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 bottom-0 md:left-0 md:top-0 md:bottom-0 h-0.5 md:h-auto md:w-0.5 w-full md:rounded-none bg-primary"
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
                <span className="text-primary">
                  @ {experiences[activeIndex].company}
                </span>
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-primary" />
                  {experiences[activeIndex].period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-primary" />
                  {experiences[activeIndex].location}
                </span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-mono">
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
                    <span className="text-primary mt-1.5 flex-shrink-0">▹</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Timeline Visual for Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-16 md:hidden"
          >
            <div className="relative pl-8 border-l border-border">
              {experiences.map((job, index) => (
                <motion.div
                  key={job.company}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="relative pb-8 last:pb-0"
                >
                  <div className="absolute -left-[41px] timeline-dot" />
                  <div className="glass-card rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase size={16} className="text-primary" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {job.period}
                      </span>
                    </div>
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-primary text-sm">{job.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
