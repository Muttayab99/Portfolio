/**
 * Single source of truth for personal details. Imported by the UI and by the
 * /api/chat knowledge base, so keep this file free of React/browser imports.
 */
export const profile = {
  name: 'Muhammad Muttayab',
  firstName: 'Muhammad',
  lastName: 'Muttayab',
  initials: 'MM',
  role: 'AI Engineer & Data Scientist',
  headline: 'I build intelligent systems that ship ROI.',
  location: 'Lahore, Pakistan',
  workMode: 'Remote-friendly',
  availability: 'Open to work',
  email: 'muhammadmuttayab09@gmail.com',
  siteUrl: 'https://muttayab.dev',
  cvPath: '/Muhammad_Muttayab_CV.pdf',
  education: 'BS Data Science, FAST NUCES',
  achievements: ['Hackathon winner'],
  links: {
    github: 'https://github.com/Muttayab99',
    linkedin: 'https://linkedin.com/in/m-muttayab',
  },
  /** Company names shown as social proof in the hero. */
  workedWith: ['Neuralogic', 'Systems Ltd', 'Addo AI'],
  about: [
    "I'm an AI engineer from Lahore with a degree in data science from FAST NUCES. Most of my work these days is in computer vision, document processing, LLM orchestration and agentic automation.",
    "At Neuralogic I work as an AI engineer. We build estimating tools for construction companies: software that reads architectural drawings and works out quantities and costs, the part estimators usually do by hand. I've worked on the concrete version, where I fine-tuned SAM3, and was project lead on the plumbing and mechanical one. I also built one for window film, and helped build an assistant that turns purchase-order emails into orders in the client's accounting system.",
    'Before that I was at SAynt AI, working on a competitor analysis tool and a system for auditing old property records. I also interned at Addo AI, building RAG pipelines with LangChain and LangGraph, and spent a summer at Systems Limited working on Azure data pipelines.',
  ],
  recentTech: [
    'Computer Vision (SAM3, D-FINE, YOLO)',
    'Vision-Language Models (Qwen3-VL, Gemini)',
    'Document AI / OCR (PaddleOCR)',
    'LLM Agents (LangGraph, MCP)',
    'PyTorch / ONNX Runtime',
    'FastAPI / Production APIs',
    'AWS (EC2, S3, SQS)',
    'Next.js / TypeScript',
    'PostgreSQL',
  ],
} as const;
