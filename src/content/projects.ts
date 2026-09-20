export type ProjectType = 'ai' | 'data' | 'web';

export interface PipelineStage {
  label: string;
  detail: string;
}

export interface CaseStudy {
  /** One-line context: who it was for and in what role. */
  context: string;
  problem: string;
  approach: string[];
  /** Ordered stages rendered as a flow diagram. */
  pipeline: PipelineStage[];
  /** Hard facts worth calling out. Keep these truthful; add numbers only when measured. */
  highlights: { value: string; label: string }[];
  outcomes: string[];
  learnings: string[];
}

export interface Project {
  slug: string;
  title: string;
  /** Short line under the title on cards. */
  tagline: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  type: ProjectType[];
  featured: boolean;
  year: string;
  /** Company / setting; shown as a small label. */
  org?: string;
  caseStudy?: CaseStudy;
}

export const projects: Project[] = [
  {
    slug: 'vesta',
    title: 'Vesta',
    tagline: 'Automated concrete takeoffs from architectural plans',
    org: 'Neuralogic',
    year: '2026',
    description:
      'Engineered an AI system for automated concrete takeoffs and cost estimation on architectural plans. Developed a computer vision pipeline by fine-tuning SAM3 (848M parameters) on AWS EC2 for precise element segmentation, managed via Roboflow. Integrated PaddleOCR and Google Vertex AI to extract structured data, exposing the inference pipeline through a robust production-grade FastAPI service.',
    tech: ['SAM3', 'PyTorch', 'PaddleOCR', 'Vertex AI', 'FastAPI', 'Roboflow', 'AWS EC2'],
    type: ['ai'],
    featured: true,
    caseStudy: {
      context: 'Built at Neuralogic as AI Engineer & Project Lead, 2026.',
      problem:
        'Construction estimators produce "takeoffs" by reading architectural plans and manually counting and measuring every concrete element (footings, columns, slabs, walls). It is slow, error-prone, and the bottleneck for every bid. The goal was a system that ingests a plan set and returns structured, priced quantities with minimal human correction.',
      approach: [
        'Treated it as a segmentation problem rather than detection: estimators need areas and lengths, not bounding boxes. Fine-tuned SAM3 (848M parameters) on a custom, in-domain dataset of annotated plan sheets.',
        'Ran training on a single AWS EC2 instance with 80 GB of VRAM; managed the dataset, versioning and annotation QA through Roboflow so the ground truth stayed consistent as the labelling team grew.',
        'Segmentation alone is not a takeoff. Layered PaddleOCR over the plan text to read dimensions, labels and schedules, and used Google Vertex AI to turn the raw OCR output into structured cost line items.',
        'Wrapped everything in a FastAPI service with two surfaces: prediction endpoints for the estimation app, and annotation-management endpoints so corrections from estimators flow back into the training set.',
      ],
      pipeline: [
        { label: 'Plan sheets', detail: 'PDF / raster architectural drawings' },
        { label: 'SAM3 (fine-tuned)', detail: 'Element masks: footings, columns, slabs, walls' },
        { label: 'PaddleOCR', detail: 'Dimensions, labels, schedules' },
        { label: 'Vertex AI', detail: 'Normalise OCR into structured quantities' },
        { label: 'FastAPI', detail: 'Prediction + annotation endpoints' },
        { label: 'Estimate', detail: 'Priced, reviewable takeoff' },
      ],
      highlights: [
        { value: '848M', label: 'SAM3 parameters fine-tuned' },
        { value: '80 GB', label: 'VRAM on the training instance' },
        { value: '2', label: 'workstreams led (concrete, MEP)' },
      ],
      outcomes: [
        'Precise element segmentation on real plan sheets, replacing manual counting for the concrete scope.',
        'Manual estimation effort reduced significantly; estimators now review and correct instead of measuring from scratch.',
        'Corrections loop back into training data through the annotation endpoints, so accuracy improves with use.',
        'Now leading a second workstream extending the approach to MEP (mechanical, electrical, plumbing) plans, plus a GenAI module that drafts and reviews construction contracts.',
      ],
      learnings: [
        'Annotation quality dominated model quality. Time spent on labelling guidelines and QA paid back more than any architecture change.',
        'OCR on drawings is a different problem from OCR on documents: rotated text, overlapping dimension lines and tiny fonts needed their own preprocessing.',
        'Shipping the annotation-management API early turned estimators into a data flywheel instead of a QA burden.',
      ],
    },
  },
  {
    slug: 'legado',
    title: 'Legado',
    tagline: 'Auditing degraded 1970s property records with multi-modal OCR',
    org: 'SAynt AI',
    year: '2025',
    description:
      'Engineered an AI document processing API to audit property records against complex rule checklists. Orchestrated a robust multi-modal OCR pipeline (Tesseract, Google Vision, GPT-4o) specifically tuned to extract accurate data from highly degraded, handwritten 1970s/80s documents. Backed by a secure FastAPI architecture featuring JWT, HMAC, and async background tasks for high-throughput analytics.',
    tech: ['FastAPI', 'Tesseract OCR', 'Google Vision', 'GPT-4o', 'Python', 'JWT / HMAC'],
    type: ['ai'],
    featured: true,
    caseStudy: {
      context: 'Built at SAynt AI on contract, late 2025.',
      problem:
        'Property records from the 1970s and 80s (scanned, faded, often handwritten) had to be checked against long compliance checklists. Single-engine OCR failed on the handwriting and the degradation, and humans were re-reading every page.',
      approach: [
        'Used three readers instead of one: Tesseract for clean typed regions, Google Vision for handwriting and low-contrast scans, and GPT-4o as a vision model for pages where both classical engines disagreed or returned garbage.',
        'Built a routing layer that scores each engine\'s confidence per region and picks or merges outputs, so cost stays low on easy pages and quality stays high on hard ones.',
        'Encoded the compliance checklists as rules evaluated over the extracted fields, producing an audit report with citations back to the page and region.',
        'Designed the API for production from day one: JWT for user auth, HMAC-signed requests for service-to-service calls, and background tasks so long documents never block the request thread.',
      ],
      pipeline: [
        { label: 'Scanned record', detail: 'Degraded, partly handwritten' },
        { label: 'Preprocess', detail: 'Deskew, denoise, region split' },
        { label: 'Tesseract + Vision + GPT-4o', detail: 'Per-region OCR with confidence routing' },
        { label: 'Field extraction', detail: 'Structured record' },
        { label: 'Rule engine', detail: 'Checklist evaluation with citations' },
        { label: 'Audit report', detail: 'Via secured FastAPI' },
      ],
      highlights: [
        { value: '3', label: 'OCR engines, confidence-routed' },
        { value: '1970s–80s', label: 'age of the source documents' },
        { value: 'JWT + HMAC', label: 'auth on every surface' },
      ],
      outcomes: [
        'Accurate extraction from documents that a single OCR engine could not read.',
        'Checklist audits became a review task instead of a reading task.',
        'Throughput scaled with async background processing rather than with more reviewers.',
      ],
      learnings: [
        'Disagreement between engines is a better signal than any single confidence score.',
        'Citations (page + region) mattered as much as accuracy: reviewers trust a result they can verify in one click.',
      ],
    },
  },
  {
    slug: 'justassemble',
    title: 'JustAssemble',
    tagline: 'Multi-agent competitor analysis over 15+ SEMrush endpoints',
    org: 'SAynt AI',
    year: '2025',
    description:
      'Architected a LangChain multi-agent system for an advertising firm, where specialized AI agents collaborate to perform competitor SWOT analysis and analyze traffic via 15+ SEMrush endpoints. Integrated with AWS SQS/S3, it outputs a detailed analytics dashboard providing actionable summaries for advertising strategy.',
    tech: ['Python', 'LangChain', 'Asyncio', 'Pydantic', 'AWS SQS / S3', 'SEMrush API'],
    type: ['ai', 'data'],
    featured: true,
    caseStudy: {
      context: 'Built at SAynt AI for an advertising firm, late 2025.',
      problem:
        'Strategists were compiling competitor reports by hand from SEMrush: traffic, keywords, backlinks, ads, across dozens of competitors. Each report took hours and went stale immediately.',
      approach: [
        'Split the work across specialised LangChain agents (traffic, keywords, ads, SWOT synthesis) rather than one monolithic prompt, so each agent has a small tool surface and a clear output schema.',
        'Fetched from 15+ SEMrush endpoints concurrently with Asyncio; every response is validated into Pydantic models before an LLM ever sees it, which kept hallucinated numbers out of the reports.',
        'Decoupled ingestion from analysis with AWS SQS: a request enqueues competitor jobs, workers pull SEMrush data and store raw payloads in S3, and the agent layer reads from S3, so re-runs are cheap and reproducible.',
        'Rendered the result as an analytics dashboard with actionable summaries per competitor rather than a wall of text.',
      ],
      pipeline: [
        { label: 'Competitor list', detail: 'Request enqueued' },
        { label: 'AWS SQS', detail: 'Job fan-out' },
        { label: 'SEMrush ×15', detail: 'Async fetch, Pydantic validation' },
        { label: 'S3', detail: 'Raw payload store' },
        { label: 'LangChain agents', detail: 'Traffic · keywords · ads · SWOT' },
        { label: 'Dashboard', detail: 'Actionable summaries' },
      ],
      highlights: [
        { value: '15+', label: 'SEMrush endpoints integrated' },
        { value: 'Asyncio', label: 'concurrent, Pydantic-validated ingestion' },
        { value: 'SQS + S3', label: 'queue-backed, replayable' },
      ],
      outcomes: [
        'Competitor reports produced on demand instead of over several hours of manual research.',
        'Every figure in a report traces back to a stored SEMrush payload.',
        'Strategy team works from the dashboard summaries, not raw exports.',
      ],
      learnings: [
        'Validating tool output with Pydantic before it reaches the model removed an entire class of "confidently wrong" summaries.',
        'A queue between fetch and analysis made the system debuggable: failed jobs are replayed, not re-researched.',
      ],
    },
  },
  {
    slug: 'aerux',
    title: 'Aerux',
    tagline: 'Intracranial aneurysm detection on 2.5D DICOM slices',
    year: '2025',
    description:
      'Built a medical imaging system using a multi-task ResNet50 pipeline in PyTorch. Implemented robust preprocessing with OpenCV and SimpleITK (N4 bias correction, Sato vesselness). Developed an attention-based fusion model for 2.5D DICOM slices, leveraging mixed-precision training to optimize localization on the RSNA dataset.',
    tech: ['PyTorch', 'OpenCV', 'SimpleITK', 'ResNet50', 'Medical Imaging'],
    github:
      'https://github.com/Muttayab99/MULTI-MODAL-2.5D-ATTENTION-FUSION-FOR-INTRACRANIAL-ANEURYSM-DETECTION/tree/main',
    type: ['ai'],
    featured: false,
  },
  {
    slug: 'race',
    title: 'Race',
    tagline: 'MCP orchestrator for video analysis and web scraping agents',
    year: '2025',
    description:
      'Engineered an intelligent multi-agent system with FastAPI and Streamlit, orchestrating workflows for video analysis and web scraping. Implemented NLP pipelines using LangChain and Llama-4, optimizing inference via Groq API.',
    tech: ['FastAPI', 'LangChain', 'Llama-4', 'Streamlit', 'Groq'],
    github: 'https://github.com/Muttayab99/AI-Powered-Multi-Agent-Chatbot-System',
    type: ['ai', 'web'],
    featured: false,
  },
  {
    slug: 'la-musica',
    title: 'La Musica',
    tagline: 'Real-time music recommendations with Kafka and ScaNN',
    year: '2025',
    description:
      'Developed a real-time recommendation platform using Apache Kafka, MongoDB, and Flask. Built audio feature extraction pipelines with Librosa (MFCCs) and utilized tree-based ScaNN for efficient vector retrieval.',
    tech: ['Kafka', 'MongoDB', 'Flask', 'Librosa', 'ScaNN'],
    github: 'https://github.com/Muttayab99/Music-Recommendation-System-using-Scann-Near-Neighbor',
    type: ['ai', 'data'],
    featured: false,
  },
  {
    slug: 'disaster-relief-ai',
    title: 'DisasterReliefAI',
    tagline: 'BERT + geospatial optimisation for emergency aid allocation',
    year: '2024',
    description:
      'Built an emergency resource allocation platform using BERT transformers for semantic context interpretation. Applied geospatial algorithms and LSAP optimization to prioritize aid based on urgency and proximity.',
    tech: ['BERT', 'NLP', 'Geospatial', 'Optimization'],
    github: 'https://github.com/Muttayab99/Disaster-Relief-AI-Recommendation-System',
    type: ['ai'],
    featured: false,
  },
  {
    slug: 'vendorsys',
    title: 'VendorSys',
    tagline: 'Full-stack vendor management with RBAC',
    year: '2024',
    description:
      'Designed a full-stack vendor management platform with Node.js and robust SQL backend. Implemented RBAC, cascading constraints, and automated trigger notifications for financial data security.',
    tech: ['Node.js', 'SQL', 'RBAC', 'REST API'],
    github: 'https://github.com/Muttayab99/Website-based-Vendor-Management-System',
    type: ['web'],
    featured: false,
  },
  {
    slug: 'streaming-analytics',
    title: 'Real-time Streaming Analytics',
    tagline: 'Apriori, PCY and PageRank over Kafka streams',
    year: '2024',
    description:
      'Implemented Apriori, PCY, and PageRank algorithms for high-velocity data analysis. Utilized Apache Kafka for stream processing, enabling scalable frequent-itemset mining.',
    tech: ['Kafka', 'Apriori', 'PageRank', 'PySpark'],
    github: 'https://github.com/Muttayab99/Frequent-Item-sets-Mining',
    type: ['data'],
    featured: false,
  },
  {
    slug: 'oil',
    title: 'OIL',
    tagline: 'Azure financial data pipeline into Power BI',
    org: 'Systems Limited',
    year: '2024',
    description:
      'Architected an end-to-end financial data pipeline using Azure Data Factory to orchestrate data movement between blob storage. Implemented complex transformations using Python in Azure Databricks, processing data into Delta tables to generate final insights. Culminated in a comprehensive Power BI dashboard for business reporting.',
    tech: ['Azure Data Factory', 'Azure Databricks', 'Python', 'Delta Tables', 'Power BI'],
    type: ['data'],
    featured: false,
  },
  {
    slug: 'merc',
    title: 'Merc',
    tagline: 'Personal finance wallet and budget tracker',
    year: '2023',
    description:
      'Developed a personal financial wallet for tracking expenses and managing budgets. Built with Python to provide clear insights into financial habits.',
    tech: ['Python', 'Financial Data', 'Analytics'],
    github: 'https://github.com/Muttayab99/MERC',
    type: ['data'],
    featured: false,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const caseStudies = projects.filter((p) => p.caseStudy);
