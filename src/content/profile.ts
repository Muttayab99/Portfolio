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
    'I am an AI Engineer and Data Scientist who builds AI systems that actually ship to production, not just notebooks. My work sits at the intersection of computer vision, LLM orchestration, and the data infrastructure that holds it all together.',
    "I'm currently AI Engineer & Project Lead at Neuralogic, where I fine-tuned an 848M-parameter SAM3 model for automated construction cost estimation and now lead a second workstream building GenAI-powered contract automation for MEP estimation. Before this, I architected a multi-agent competitor analysis system at SAynt AI (Asyncio, 15+ SEMrush endpoints, AWS SQS/S3), and built RAG pipelines with LangChain and LangGraph as a Gen-AI intern at Addo AI.",
  ],
  recentTech: [
    'FastAPI / Production APIs',
    'PyTorch',
    'Computer Vision (SAM3, OpenCV)',
    'LangChain / LangGraph',
    'AWS (EC2, SQS, S3)',
    'PaddleOCR / Document AI',
    'Multi-Agent Systems',
    'Azure / Databricks',
    'SQL & NoSQL',
  ],
} as const;
