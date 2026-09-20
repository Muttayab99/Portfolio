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
  { name: 'JavaScript', category: ['languages', 'web'], icon: 'code' },
  { name: 'HTML/CSS', category: ['languages', 'web'], icon: 'code' },
  { name: 'FastAPI', category: ['web'], icon: 'terminal' },
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
  { name: 'Roboflow', category: ['ai-ml'], icon: 'layers' },

  // Data & Cloud
  { name: 'AWS', category: ['cloud'], icon: 'cloud' },
  { name: 'Google Vertex AI', category: ['cloud', 'ai-ml'], icon: 'cloud' },
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
