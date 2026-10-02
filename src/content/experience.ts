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
    title: 'AI Engineer',
    company: 'Neuralogic',
    location: 'Remote',
    period: 'Jan 2026 - Present',
    type: 'Full-time',
    projects: ['vesta', 'mep-takeoff', 'film-takeoff', 'purchasing-agent', 'mep-symbol-detection'],
    description: [
      'Fine-tuned an 848M-parameter SAM3 model on our own labelled plans to segment concrete elements for automated cost estimates, training on an AWS GPU instance with 80 GB of VRAM.',
      'Managed the training data in Roboflow and kept annotation quality high, which did more for the model than any architecture change.',
      'Used PaddleOCR and Gemini on Vertex AI to read plan legends and match materials to prices, and served the whole pipeline through FastAPI so estimators review a takeoff instead of measuring from scratch.',
      'Built a takeoff and pricing tool for a US mechanical contractor. Qwen3-VL sorts the plumbing and mechanical sheets, a D-FINE model served through ONNX Runtime counts fixtures and valves, a segmentation model measures pipe runs, and everything is priced against their price book. It runs in production on FastAPI and AWS with a Next.js review screen for estimators.',
      "Built a window film takeoff pipeline using PyMuPDF, GPU PaddleOCR and Gemini on Vertex AI. It ties every number back to the spot on the drawing it came from and holds back anything it can't verify.",
      "Helped build an assistant in Python and Pydantic that reads purchase request emails through Microsoft Graph, along with the vendor quotes, and turns them into purchase orders in the client's Sage 100 system.",
      'Was project lead for the plumbing and mechanical workstream, coordinating model development and integration across the team, and designed a GenAI module for drafting and reviewing construction contracts.',
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
