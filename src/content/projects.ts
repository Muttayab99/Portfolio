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
  /** Hard facts worth calling out. Keep these truthful; add numbers only when measured. Empty hides the row. */
  highlights: { value: string; label: string }[];
  outcomes: string[];
  learnings: string[];
}

export interface Project {
  slug: string;
  title: string;
  /** Short line under the title on cards. */
  tagline: string;
  /** Plain-language one-liner for featured cards: what it does, for whom. No jargon. */
  summary?: string;
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
    summary:
      'Reads a construction plan set and returns a priced concrete takeoff: what is on each sheet, how much of it, and what it costs.',
    org: 'Neuralogic',
    year: '2026',
    description:
      'Engineered an AI system for automated concrete takeoffs and cost estimation on architectural plans. A fine-tuned SAM3 model (848M parameters) segments materials on 300-DPI plan renders, a three-path scale calibrator converts pixels to square feet, PaddleOCR reads legends, and Gemini on Vertex AI matches legends and materials to a price database, returning priced Excel and Word reports plus an annotated PDF. Runs as four FastAPI microservices on a single GPU instance on AWS.',
    tech: ['SAM3', 'PyTorch', 'Roboflow', 'PaddleOCR', 'Gemini (Vertex AI)', 'FastAPI', 'PostgreSQL', 'AWS EC2 / S3'],
    type: ['ai'],
    featured: true,
    caseStudy: {
      context: 'Built at Neuralogic as an AI Engineer, 2026.',
      problem:
        'Construction estimators produce "takeoffs" by reading architectural plans and manually counting and measuring every concrete element (footings, columns, slabs, walls, paving). It is slow, error-prone, and the bottleneck for every bid. The goal was a system that ingests a plan set and returns structured, priced quantities with minimal human correction.',
      approach: [
        'Treated it as a segmentation problem rather than detection: estimators need areas, not bounding boxes. A Roboflow detector finds candidate regions, then a fine-tuned SAM3 (848M parameters) segments each page in 1008 px tiles that are merged back into one annotated sheet with per-material areas.',
        'Ran training on a single AWS EC2 instance with 80 GB of VRAM; managed the dataset, versioning and annotation QA through Roboflow so the ground truth stayed consistent as the labelling team grew.',
        'Pixels are not square feet. Built a three-path scale calibrator: a manual two-point reference when the estimator supplies one; otherwise vector-PDF parsing of scale labels (such as 1" = 20\'-0"), scale bars and title blocks; and for raster scans, PaddleOCR over the title strip with the same parsers.',
        'Segmentation alone is not a takeoff. PaddleOCR reads the plan legends, Gemini on Vertex AI extracts legend entries and maps them to segmented material classes, then matches each material area to the price database to produce quantity, unit price and total.',
        'Built a separate pricing service so contractors keep that database current: they upload their own Excel price sheets, and a multi-pass Gemini pipeline (identify relevant sheets, extract, verify against the source, de-duplicate, filter by confidence) turns them into structured material prices.',
        'Split the system into four FastAPI services on one GPU instance: the AI pipeline; an OCR service in its own environment, because PaddlePaddle and PyTorch need conflicting CUDA libraries; a user-facing API with JWT auth, jobs and S3 presigned downloads; and the pricing service. A scheduled job purges expired jobs and their S3 files, and GitHub Actions deploys over SSH.',
      ],
      pipeline: [
        { label: 'Plan PDF', detail: 'Rendered at 300 DPI' },
        { label: 'Scale calibration', detail: 'Manual · vector · OCR fallback' },
        { label: 'Detect + SAM3', detail: 'Tiled material segmentation' },
        { label: 'PaddleOCR', detail: 'Legends and plan text' },
        { label: 'Gemini matching', detail: 'Legends → materials → prices' },
        { label: 'Reports', detail: 'Excel, Word, annotated PDF' },
      ],
      highlights: [
        { value: '848M', label: 'SAM3 parameters fine-tuned' },
        { value: '4', label: 'microservices on one GPU instance' },
        { value: '3', label: 'scale-calibration paths: manual, vector, OCR' },
      ],
      outcomes: [
        'Precise element segmentation on real plan sheets, replacing manual counting for the concrete scope.',
        'Each job returns a priced takeoff as Excel and Word reports plus an annotated PDF, so estimators review and correct instead of measuring from scratch.',
        'Contractors maintain their own pricing by uploading the spreadsheets they already use, with no manual data entry.',
        'Corrections loop back into training data through the annotation endpoints, so accuracy improves with use.',
      ],
      learnings: [
        'Annotation quality dominated model quality. Time spent on labelling guidelines and QA paid back more than any architecture change.',
        'Scale is the silent failure mode: a perfect mask with the wrong pixels-per-foot is a wrong estimate. Reading vector geometry first and OCR only as a fallback made calibration trustworthy.',
        'OCR on drawings is a different problem from OCR on documents: rotated text, overlapping dimension lines and tiny fonts needed their own preprocessing, and its own service.',
      ],
    },
  },
  {
    slug: 'mep-takeoff',
    title: 'MEP Takeoff',
    tagline: 'Plumbing & mechanical takeoffs: VLM triage, symbol detection, assembly pricing',
    summary:
      'Counts every plumbing fixture, valve and pipe run in a drawing set and prices it, so estimators review a takeoff instead of building one.',
    org: 'Neuralogic',
    year: '2026',
    description:
      'Built an end-to-end takeoff and estimating platform for a US mechanical contractor. Drawing sets are triaged page by page with OCR rules and a local Qwen3-VL vision-language model, plumbing symbols are counted by a D-FINE detector served through ONNX, pipe runs are segmented and sized, and every fixture is priced through schedule-tag → assembly → price-book mapping. Estimators correct results on a Next.js review canvas before anything reaches the client. Runs in production on a GPU EC2 instance behind FastAPI.',
    tech: ['Qwen3-VL', 'Ollama', 'D-FINE', 'ONNX Runtime', 'PyTorch', 'FastAPI', 'Next.js', 'AWS EC2 / S3', 'PostgreSQL'],
    type: ['ai', 'web'],
    featured: true,
    caseStudy: {
      context: 'Built at Neuralogic for a US mechanical contractor, 2026. I was Project Lead of this workstream.',
      problem:
        'To bid a job, plumbing and mechanical estimators work through drawing sets that run to hundreds of pages: find the plumbing and mechanical sheets, count every drain, valve and clean-out, measure pipe runs by size, then price each fixture against the company\'s assembly price books. It is slow, repetitive and inconsistent between estimators, and it gates every bid.',
      approach: [
        'Triaged sheets before detecting anything. OCR plus keyword rules classify each page (plumbing vs mechanical, plan vs schedule); only pages the rules cannot decide are escalated to Qwen3-VL running locally through Ollama, so the expensive model is spent where it adds information.',
        'Counted symbols with a D-FINE object detector exported to ONNX, trained on 14 plumbing symbol classes (floor drains, roof drains, clean-outs, ball, check and balancing valves, reducers and more), and merged it with text-tag detection from the sheet legend so schedule codes such as FD-1 are counted too.',
        'Segmented pipe runs with a segmentation-models-pytorch network and used spatial intersection to attach pipe-size labels to the symbols they serve.',
        'Turned counts into money: fixture tags from the schedule map to assemblies, assemblies to items in the contractor\'s PVF price database, with a name matcher that learns from estimator corrections, and the result exports as an Excel estimate and an annotated PDF.',
        'Kept humans in the loop: a Next.js + Konva canvas lets estimators add, move and delete detections, and results stay hidden from the client until the in-house review is signed off.',
        'Shipped it as production infrastructure: FastAPI under systemd on a GPU EC2 instance behind Nginx, PostgreSQL, S3 for drawings and renders, a Dockerised frontend, separate staging and production, and CI on every push.',
      ],
      pipeline: [
        { label: 'Drawing set', detail: 'Multi-hundred-page PDF' },
        { label: 'Sheet triage', detail: 'OCR rules → Qwen3-VL fallback' },
        { label: 'Detection', detail: 'D-FINE symbols (14 classes) + pipe segmentation' },
        { label: 'Assembly pricing', detail: 'Tag → assembly → price book' },
        { label: 'Review canvas', detail: 'Estimator corrections, sign-off' },
        { label: 'Estimate', detail: 'Excel + annotated PDF' },
      ],
      highlights: [
        { value: '14', label: 'plumbing symbol classes detected' },
        { value: '38', label: 'production API endpoints' },
        { value: '30B', label: 'parameter vision-language model (Qwen3-VL), self-hosted' },
      ],
      outcomes: [
        'In production for the contractor, with separate staging and production environments.',
        'Estimators review and correct a priced takeoff instead of counting symbols by hand.',
        'Every count is traceable to a box on the drawing through the annotated PDF export.',
      ],
      learnings: [
        'Rules first, model second. Cheap deterministic triage decides most pages; the VLM is a fallback for the ambiguous ones, not the default path.',
        'A single physical fixture can surface through several schedule-tag groups. Counting per tag group inflated priced quantities (49 vs 9 for one drain type) until totals were reconciled at the assembly level.',
        'Price books change. Learning name mappings from estimator corrections beat hand-maintained lookup tables.',
      ],
    },
  },
  {
    slug: 'film-takeoff',
    title: 'Film Takeoff',
    tagline: 'Evidence-backed window-film, graphics & signage takeoffs from drawing sets',
    summary:
      'Finds every window that needs tint film in a set of drawings, measures it, and shows exactly where each number came from.',
    org: 'Neuralogic',
    year: '2026',
    description:
      'Built a document-intelligence pipeline that turns an architectural project archive into a window-film, graphics and signage takeoff (opening mark, width, height, panes, quantity, square feet), with every number tied to the page, region and rule that produced it. Combines searchable-PDF parsing, GPU PaddleOCR, schedule and dimension extraction and audited Gemini readers, and fails closed so uncertain rows go to review instead of the estimate. Validated against the client\'s own historical takeoffs.',
    tech: ['Python', 'PyMuPDF', 'PaddleOCR', 'Gemini (Vertex AI)', 'Starlette', 'React', 'TypeScript', 'Playwright'],
    type: ['ai', 'web'],
    featured: true,
    caseStudy: {
      context: 'Built at Neuralogic for a window-film contractor, 2026.',
      problem:
        'A film takeoff means searching specifications and drawings for film, graphics or signage scope, identifying the affected openings, reading dimensions from schedules, elevations and details, counting every physical location on the plans, computing panes and square footage, and preparing an import for the contractor\'s quoting software. Drawings follow no common structure: one firm marks windows W1, another AF48, another uses a keynote, a room name or a detail reference such as 3/A9.01, and similar-looking labels can be rooms, grid lines or drawing bubbles.',
      approach: [
        'Made evidence the core data model. Every record carries its source PDF, page, bounding box, page role and confidence, and measurement evidence (how big) is kept separate from location evidence (where and how many).',
        'Indexed each archive first: unpack, classify PDFs and pages by role, discover candidate mark families, read searchable text directly, and route flattened scans through tiled GPU PaddleOCR.',
        'Extracted scope from specifications and notes, then schedules, plan tags, rotated architectural dimensions, pane geometry and quantities, normalised into a line-item identity model that tells opening marks, detail callouts and named locations apart.',
        'Used Gemini on Vertex AI where judgement helps but never as the source of truth: offline, it drafts per-firm extraction configs; online, it runs as shadow readers whose proposals are scored against the deterministic result before any are adopted.',
        'Failed closed. Rows without sufficient geometry, scope or quantity evidence stay in review states and cannot be exported, and reviewers confirm or exclude whole mark families rather than individual rows.',
        'Wrapped it as a job service (per-job workspaces, process isolation for native-code hangs, versioned response schema, auth) with a React review app for family, pane, quantity and scope review and exports to spreadsheet, highlighted drawings and the quoting-software format.',
      ],
      pipeline: [
        { label: 'Project archive', detail: 'Specs, plans, elevations, schedules' },
        { label: 'Page index', detail: 'Roles, mark families, OCR where needed' },
        { label: 'Scope search', detail: 'Film / graphics / signage notes' },
        { label: 'Extraction', detail: 'Marks, schedules, dimensions, panes' },
        { label: 'Evidence gates', detail: 'Shadow readers, review, fail-closed' },
        { label: 'Exports', detail: 'Spreadsheet, highlights, quoting import' },
      ],
      highlights: [],
      outcomes: [
        'Takeoffs come back with every opening, dimension and quantity linked to the exact drawing and region it was read from, so an estimator can verify any number in one click.',
        'Far more of each takeoff is now adopted automatically, and the few rows the system cannot prove are flagged for review instead of guessed.',
        'Model hallucinations are caught by the verification gates before they reach the estimate.',
        'Graphic details, named elevation locations and frame marks are recovered and linked to where they occur on the plans, across drawing styles from different architecture firms.',
      ],
      learnings: [
        'A rule that fixes one project can quietly break another. Measuring every change against the client\'s real takeoffs, with a holdout that is never tuned on, is what kept accuracy honest.',
        '"Where is it" and "how big is it" are different questions with different evidence. Merging them is how double-counting creeps in.',
        'LLM output is most useful as a proposal with a verifier behind it; the verifier is what makes it safe to adopt.',
      ],
    },
  },
  {
    slug: 'purchasing-agent',
    title: 'Purchasing Agent',
    tagline: 'Email-to-purchase-order agent wired into Microsoft Graph and Sage 100',
    summary:
      "Turns purchase-request emails and vendor quotes into ready-to-file purchase orders in the company's accounting system.",
    org: 'Neuralogic',
    year: '2026',
    description:
      'Co-built a purchasing co-pilot for a mechanical contractor\'s purchasing inbox. Purchase-request emails and vendor quote attachments are turned into a structured, validated request; deterministic rules then handle cost coding, consumables, tax and an autonomy tier before anything is written to the Sage 100 ERP. AI reads, rules decide: the model never invents an ID or a price.',
    tech: ['Python', 'Pydantic', 'Microsoft Graph', 'Sage 100 API', 'OpenAI-compatible LLMs', 'pytest'],
    type: ['ai'],
    featured: true,
    caseStudy: {
      context: 'Built at Neuralogic for a mechanical contractor\'s purchasing team, 2026.',
      problem:
        'Construction and service purchase requests arrive as free-text emails with vendor quotes attached. Buyers re-key every one into the ERP, chase requesters for missing details, and check job numbers, cost codes and tax by hand.',
      approach: [
        'Drew a hard line between AI and rules. The extraction layer only turns an email and its quotes into fields; coding, vendor checks, budget, tax and autonomy are deterministic and auditable.',
        'Routed by subject tags (construction vs service, small vs large PO), parsed the body and the quote separately with heuristics plus optional LLM gap-fill, and reconciled the two with a deterministic merge that records every mismatch as evidence.',
        'Bounced incomplete requests straight back to the requester with exactly what is missing, instead of letting a buyer discover it later.',
        'Assigned an autonomy tier (green, yellow, red, worst flag wins); red never produces an ERP write packet and is escalated with its reasons.',
        'Integrated the real systems: Microsoft Graph for the shared mailbox, and Sage 100 Cloud for job, vendor and tax-district reads and purchase-order writes, verified with live tests.',
      ],
      pipeline: [
        { label: 'Purchasing inbox', detail: 'Microsoft Graph' },
        { label: 'Route', detail: 'Subject tags → PO type' },
        { label: 'Extract', detail: 'Email body + quote attachments' },
        { label: 'Merge', detail: 'Deterministic, mismatches kept' },
        { label: 'Rules', detail: 'Coding, consumables, tax, autonomy tier' },
        { label: 'Sage 100', detail: 'Purchase order write' },
      ],
      highlights: [],
      outcomes: [
        'Purchase requests go from inbox to a validated, ERP-ready purchase order without a buyer re-keying anything.',
        'Incomplete requests are bounced back to the requester automatically with exactly what is missing, instead of stalling in the inbox.',
        'Routine orders can proceed on their own, while anything unusual is escalated to a buyer with the reasons spelled out.',
        'Reads and purchase-order writes run against the live Sage 100 ERP, not a mock.',
      ],
      learnings: [
        'Let the model read and the rules decide. Keeping IDs, prices, tax and approvals out of the LLM made every outcome explainable to the purchasing team and easy to audit.',
        'Never trust one source. Requesters often type a different price, quantity or part number than the vendor actually quoted, so the agent reads the email and the quote separately and flags any difference for a buyer.',
        'Autonomy should be earned, not assumed. A worst-flag-wins tier system let the agent act on routine orders while staying conservative everywhere else.',
      ],
    },
  },
  {
    slug: 'legado',
    title: 'Legado',
    tagline: 'Auditing degraded 1970s property records with multi-modal OCR',
    summary:
      'Checks decades-old, partly handwritten property records against legal checklists and writes the audit report.',
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
    summary:
      'Builds a competitor report (traffic, keywords, ads and a SWOT) from live SEO data for an advertising team.',
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
    slug: 'mep-symbol-detection',
    title: 'MEP Symbol Detection',
    tagline: 'YOLO symbol detection with a synthetic training-data pipeline',
    org: 'Neuralogic',
    year: '2026',
    description:
      'Built the computer-vision data pipeline for an MEP estimating platform: pulled mechanical and electrical sheets out of drawing sets, trained a YOLO model to crop the drawing area, and generated synthetic training data to detect 11 symbol classes.',
    tech: ['YOLO (Ultralytics)', 'OpenCV', 'PyMuPDF', 'Shapely', 'Next.js', 'Supabase'],
    type: ['ai'],
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
