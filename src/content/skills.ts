export type SkillCategory = 'languages' | 'ai-ml' | 'data' | 'cloud' | 'web';

/** Icon keys are resolved to Lucide components in the UI (keeps this file React-free). */
export type SkillIcon =
  | 'code' | 'terminal' | 'brain' | 'cpu' | 'layers' | 'database'
  | 'server' | 'camera' | 'cloud' | 'zap' | 'network' | 'chart';

export interface Skill {
  name: string;
  category: SkillCategory[];
  icon: SkillIcon;
}

export const skills: Skill[] = [
  // Languages & Web
  { name: 'Python', category: ['languages'], icon: 'code' },
  { name: 'C++', category: ['languages'], icon: 'code' },
  { name: 'HTML/CSS', category: ['languages', 'web'], icon: 'code' },
  { name: 'FastAPI', category: ['web'], icon: 'terminal' },
  { name: 'Pydantic', category: ['languages'], icon: 'code' },
  { name: 'Asyncio', category: ['languages'], icon: 'zap' },
  { name: 'REST API security (JWT, HMAC)', category: ['web'], icon: 'server' },
  { name: 'Flask', category: ['web'], icon: 'terminal' },
  { name: 'Node.js', category: ['web'], icon: 'terminal' },

  // AI & ML
  { name: 'PyTorch', category: ['ai-ml'], icon: 'brain' },
  { name: 'TensorFlow', category: ['ai-ml'], icon: 'brain' },
  { name: 'Scikit-learn', category: ['ai-ml'], icon: 'cpu' },
  { name: 'LangChain', category: ['ai-ml'], icon: 'layers' },
  { name: 'LangGraph', category: ['ai-ml'], icon: 'layers' },
  { name: 'RAG', category: ['ai-ml'], icon: 'database' },
  { name: 'NLP (BERT/Llama)', category: ['ai-ml'], icon: 'brain' },
  { name: 'MCP', category: ['ai-ml'], icon: 'server' },
  { name: 'OpenCV', category: ['ai-ml'], icon: 'camera' },
  { name: 'SAM3', category: ['ai-ml'], icon: 'camera' },
  { name: 'PaddleOCR', category: ['ai-ml'], icon: 'camera' },
  { name: 'Tesseract OCR', category: ['ai-ml'], icon: 'camera' },
  { name: 'Google Cloud Vision', category: ['ai-ml'], icon: 'camera' },
  { name: 'PDF processing (PyMuPDF)', category: ['ai-ml'], icon: 'layers' },
  { name: 'OpenAI API (GPT-4o)', category: ['ai-ml'], icon: 'brain' },
  { name: 'Ollama', category: ['ai-ml'], icon: 'server' },
  { name: 'Roboflow', category: ['ai-ml'], icon: 'layers' },
  { name: 'Vision-Language Models (Qwen3-VL)', category: ['ai-ml'], icon: 'brain' },
  { name: 'Object Detection (D-FINE, YOLO)', category: ['ai-ml'], icon: 'camera' },
  { name: 'ONNX Runtime', category: ['ai-ml'], icon: 'cpu' },
  { name: 'Next.js / React', category: ['web'], icon: 'code' },
  { name: 'TypeScript', category: ['languages', 'web'], icon: 'code' },
  { name: 'PostgreSQL', category: ['data'], icon: 'database' },
  { name: 'Docker', category: ['cloud'], icon: 'layers' },
  { name: 'CI/CD (GitHub Actions)', category: ['cloud'], icon: 'zap' },
  { name: 'Microsoft Graph API', category: ['cloud'], icon: 'network' },
  { name: 'ERP integration (Sage 100)', category: ['data'], icon: 'database' },

  // Data & Cloud
  { name: 'AWS', category: ['cloud'], icon: 'cloud' },
  { name: 'Google Vertex AI (Gemini)', category: ['cloud', 'ai-ml'], icon: 'cloud' },
  { name: 'Azure Data Factory', category: ['cloud', 'data'], icon: 'cloud' },
  { name: 'Databricks', category: ['data'], icon: 'database' },
  { name: 'PySpark', category: ['data'], icon: 'zap' },
  { name: 'Kafka', category: ['data'], icon: 'network' },
  { name: 'ETL Pipelines', category: ['data'], icon: 'network' },
  { name: 'SQL/NoSQL', category: ['data'], icon: 'database' },
  { name: 'Power BI', category: ['data'], icon: 'chart' },
  { name: 'Tableau', category: ['data'], icon: 'chart' },
  { name: 'D3.js', category: ['web', 'data'], icon: 'chart' },
];

export const skillGroups: { title: string; match: SkillCategory[] }[] = [
  { title: 'Languages & Frameworks', match: ['languages', 'web'] },
  { title: 'ML & AI Frameworks', match: ['ai-ml'] },
  { title: 'Data & Cloud', match: ['data', 'cloud'] },
];
