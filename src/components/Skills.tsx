import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Code2, Database, Cloud, Brain,
  Layers, BarChart3, Server, Cpu,
  Terminal, Zap, Network, Camera
} from 'lucide-react';

type Category = 'all' | 'languages' | 'ai-ml' | 'data' | 'cloud' | 'web';

interface Skill {
  name: string;
  category: Category[];
  icon: any; // Using any for ease with Lucide icons
  level: number;
}

const skills: Skill[] = [
  // Languages & Web
  { name: 'Python', category: ['languages'], icon: Code2, level: 95 },
  { name: 'C++', category: ['languages'], icon: Code2, level: 80 },
  { name: 'JavaScript', category: ['languages', 'web'], icon: Code2, level: 78 },
  { name: 'HTML/CSS', category: ['languages', 'web'], icon: Code2, level: 80 },
  { name: 'FastAPI', category: ['web'], icon: Terminal, level: 90 },
  { name: 'Flask', category: ['web'], icon: Terminal, level: 85 },
  { name: 'Node.js', category: ['web'], icon: Terminal, level: 75 },

  // AI & ML
  { name: 'PyTorch', category: ['ai-ml'], icon: Brain, level: 90 },
  { name: 'TensorFlow', category: ['ai-ml'], icon: Brain, level: 85 },
  { name: 'Scikit-learn', category: ['ai-ml'], icon: Cpu, level: 85 },
  { name: 'LangChain', category: ['ai-ml'], icon: Layers, level: 90 },
  { name: 'LangGraph', category: ['ai-ml'], icon: Layers, level: 85 },
  { name: 'RAG', category: ['ai-ml'], icon: Database, level: 90 },
  { name: 'NLP (BERT/Llama)', category: ['ai-ml'], icon: Brain, level: 88 },
  { name: 'MCP', category: ['ai-ml'], icon: Server, level: 85 },
  { name: 'OpenCV', category: ['ai-ml'], icon: Camera, level: 85 },
  { name: 'SAM3', category: ['ai-ml'], icon: Camera, level: 85 },
  { name: 'PaddleOCR', category: ['ai-ml'], icon: Camera, level: 80 },
  { name: 'Roboflow', category: ['ai-ml'], icon: Layers, level: 85 },

  // Data & Cloud
  { name: 'AWS', category: ['cloud'], icon: Cloud, level: 85 },
  { name: 'Google Vertex AI', category: ['cloud', 'ai-ml'], icon: Cloud, level: 80 },
  { name: 'Azure Data Factory', category: ['cloud', 'data'], icon: Cloud, level: 80 },
  { name: 'Databricks', category: ['data'], icon: Database, level: 80 },
  { name: 'PySpark', category: ['data'], icon: Zap, level: 85 },
  { name: 'Kafka', category: ['data'], icon: Network, level: 80 },
  { name: 'ETL Pipelines', category: ['data'], icon: Network, level: 85 },
  { name: 'SQL/NoSQL', category: ['data'], icon: Database, level: 88 },
  { name: 'Power BI', category: ['data'], icon: BarChart3, level: 85 },
  { name: 'Tableau', category: ['data'], icon: BarChart3, level: 80 },
  { name: 'D3.js', category: ['web', 'data'], icon: BarChart3, level: 75 },
];

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai-ml', label: 'AI/ML' },
  { key: 'data', label: 'Data Engineering' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'web', label: 'Web' },
  { key: 'languages', label: 'Languages' },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-24 md:py-32 relative" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="section-heading">
              <span className="section-number">02.</span>
              Skills & Technologies
            </h2>
            <div className="flex-1 h-px bg-border max-w-xs" />
          </div>

          {/* Skills Grouped Grid */}
          <div className="space-y-12 pt-4">
            {[
              {
                title: 'LANGUAGES & FRAMEWORKS',
                skills: skills.filter(s => s.category.includes('languages') || s.category.includes('web'))
              },
              {
                title: 'ML & AI FRAMEWORKS',
                skills: skills.filter(s => s.category.includes('ai-ml'))
              },
              {
                title: 'DATA & CLOUD',
                skills: skills.filter(s => s.category.includes('data') || s.category.includes('cloud'))
              }
            ].map((group, groupIdx) => (
              <div key={group.title} className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center p-4 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/10">
                <h3 className="text-sm font-mono tracking-widest text-primary uppercase shrink-0 md:w-56 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
                  {group.title}:
                </h3>
                <div className="flex flex-wrap gap-2.5 flex-1">
                  {group.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.1 * groupIdx + 0.05 * index }}
                      className="glass-card rounded-md px-3 py-1.5 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] cursor-default group bg-background/50 border-white/5"
                    >
                      <div className="text-primary/70 group-hover:text-primary transition-colors duration-200">
                        <skill.icon size={14} />
                      </div>
                      <span className="font-mono text-xs text-foreground/90 tracking-wide group-hover:text-primary transition-colors duration-200">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
