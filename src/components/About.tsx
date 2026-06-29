import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, GraduationCap, Award } from 'lucide-react';

const highlights = [
  { icon: MapPin, label: 'Location', value: 'Lahore, Pakistan' },
  { icon: GraduationCap, label: 'Education', value: 'BS Data Science @ FAST NUCES' },
  { icon: Award, label: 'Achievement', value: 'Hackathon Winner' },
];

const technologies = [
  'FastAPI / Production APIs', 'PyTorch', 'Computer Vision (SAM3, OpenCV)',
  'LangChain / LangGraph', 'AWS (EC2, SQS, S3)', 'PaddleOCR / Document AI',
  'Multi-Agent Systems', 'Azure / Databricks', 'SQL & NoSQL'
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 md:py-32 relative" ref={ref}>
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
              <span className="section-number">01.</span>
              About Me
            </h2>
            <div className="flex-1 h-px bg-border max-w-xs" />
          </div>

          <div className="max-w-3xl space-y-4">
            {/* Main Content */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              I am an <span className="text-primary">AI Engineer</span> and{' '}
              <span className="text-primary">Data Scientist</span> who builds AI systems that
              actually ship to production, not just notebooks. My work sits at the
              intersection of computer vision, LLM orchestration, and the data
              infrastructure that holds it all together.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              I'm currently <span className="text-primary">AI Engineer & Project Lead at
              Neuralogic</span>, where I fine-tuned an 848M-parameter SAM3 model for
              automated construction cost estimation and now lead a second workstream
              building GenAI-powered contract automation for MEP estimation. Before
              this, I architected a multi-agent competitor analysis system at SAynt AI
              (Asyncio, 15+ SEMrush endpoints, AWS SQS/S3), and built RAG pipelines
              with LangChain and LangGraph as a Gen-AI intern at Addo AI.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              Here are a few technologies I've been working with recently:
            </motion.p>

            {/* Technology Grid */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4"
            >
              {technologies.map((tech, index) => (
                <li
                  key={tech}
                  className="text-base text-muted-foreground flex items-center gap-2"
                >
                  <span className="text-primary">▹</span>
                  {tech}
                </li>
              ))}
            </motion.ul>
          </div>




        </motion.div>
      </div>
    </section>
  );
};
