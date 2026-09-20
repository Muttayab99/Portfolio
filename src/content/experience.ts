export interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Internship';
  /** Slugs of projects (see projects.ts) done in this role. */
  projects?: string[];
  description: string[];
}

export const experiences: Job[] = [
  {
    title: 'AI Engineer & Project Lead',
    company: 'Neuralogic',
    location: 'Remote',
    period: 'Jan 2026 - Present',
    type: 'Full-time',
    projects: ['vesta'],
    description: [
      'Led computer vision pipelines for automated construction cost estimation, fine-tuning SAM3 (848M parameters) on a custom dataset using an AWS EC2 instance with 80 GB VRAM, achieving precise element segmentation on architectural plans.',
      'Integrated PaddleOCR and Google Vertex AI to extract structured cost data from construction documents, reducing manual estimation effort significantly.',
      'Built and deployed production-grade FastAPI services to expose AI inference pipelines, including annotation management workflows and model prediction endpoints.',
      'Managed training data curation and model fine-tuning using Roboflow, overseeing annotation quality control to ensure high-fidelity ground truth for CV models.',
      'Leading a second workstream as Project Lead for MEP (Mechanical, Electrical & Plumbing) plan estimation, coordinating team deliverables across model development and integration and architecting a contract automation module leveraging GenAI to auto-generate and review construction contracts.',
    ],
  },
  {
    title: 'AI Engineer',
    company: 'SAynt AI',
    location: 'Remote',
    period: 'Oct 2025 - Dec 2025',
    type: 'Contract',
    projects: ['justassemble', 'legado'],
    description: [
      'Architected a multi-agent competitor analysis system in Python (Asyncio, Pydantic), integrating 15+ SEMrush endpoints with AWS SQS and S3 for scalable message queuing and storage.',
      'Engineered an AI document processing API using FastAPI, orchestrating multi-modal workflows with Tesseract OCR, Google Vision, and OpenAI GPT-4o.',
      'Designed secure production architecture featuring JWT authentication, HMAC security, and asynchronous background task management.',
    ],
  },
  {
    title: 'Gen-AI Intern',
    company: 'Addo AI',
    location: 'Remote',
    period: 'July 2025 - Aug 2025',
    type: 'Internship',
    description: [
      'Developed advanced RAG workflows using LangChain and LangGraph, mastering Prompt Engineering and Model Context Protocol (MCP).',
      'Integrated LLMs into business logic to automate complex decision-making processes, improving workflow efficiency.',
    ],
  },
  {
    title: 'Data Engineering Intern',
    company: 'Systems Limited',
    location: 'Lahore, Pakistan',
    period: 'June 2024 - Aug 2024',
    type: 'Internship',
    projects: ['oil'],
    description: [
      'Optimized enterprise ETL processes using Azure Data Factory and Azure Databricks, enhancing data throughput and reliability.',
      'Implemented distributed data transformation pipelines using PySpark to extract actionable insights from large-scale datasets.',
      'Developed interactive dashboards in Power BI to visualize KPIs and communicate data findings to executive stakeholders.',
    ],
  },
];
