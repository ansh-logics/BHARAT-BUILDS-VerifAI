# VerifAI
> Automated Ground-Truth Placement Intelligence and Multi-Dimensional Candidate Verification Platform

[![Production Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=flat&logo=vercel)](https://web-six-pi-61.vercel.app/)
[![AWS Cloud](https://img.shields.io/badge/Cloud-AWS%20EC2%20%7C%20S3%20%7C%20API%20Gateway-FF9900?style=flat&logo=amazon-aws)](https://upur1tv9bg.execute-api.us-east-1.amazonaws.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Groq AI](https://img.shields.io/badge/LLM-Groq%20High--Speed%20Inference-F55036?style=flat)](https://groq.com/)
[![Docker](https://img.shields.io/badge/Docker-Microservices-2496ED?style=flat&logo=docker)](https://www.docker.com/)

---

## 1. Problem Statement

University campus recruitment suffers from a critical ground-truth failure across academic credentials, technical skills, and candidate shortlisting:

1. **Resume Inflation and Fraud**: Self-reported resumes contain unverified CGPAs, fabricated skill lists, and exaggerated project contributions that Applicant Tracking Systems (ATS) cannot detect.
2. **Administrative Audit Overhead**: Training and Placement Officers (TPOs) spend hundreds of manual hours cross-verifying semester marksheets, grade cards, active backlogs, and eligibility thresholds across thousands of applicants.
3. **Keyword-Only Shortlisting Inefficiencies**: Standard recruitment software relies on literal keyword queries. When recruiters search for domain capabilities (e.g., "webdev" or "AIML") or specify strict multi-bound constraints (e.g., "5 to 7 CGPA only"), conventional systems fail, returning ineligible or completely unqualified candidates.

---

## 2. The VerifAI Solution

VerifAI is an enterprise placement intelligence platform that establishes an automated, single source of truth for candidate evaluation and shortlisting:

1. **Ground-Truth Academic Verification**: Official university marksheets are parsed directly to compute cumulative CGPA, semester SGPA history, and active arrears by course code. Marksheet data permanently overrides self-reported resume values.
2. **Multi-Source Developer Auditing**: Real-time integration with GitHub and LeetCode APIs validates actual coding velocity, language breadth, repository authenticity, and problem-solving metrics.
3. **Conversational AI Candidate Matching**: Powered by Groq-accelerated LLM inference and a deterministic safety-net engine, the system interprets conversational TPO criteria, enforces strict bounded CGPA ranges, performs domain skill taxonomy expansion, and presents proactive clarification suggestions for underspecified requirements.
4. **Enterprise Document Security**: Resumes and marksheets are stored with AES-256 Server-Side Encryption in private AWS S3 vaults, accessible exclusively via time-bound, cryptographically signed HMAC tokens.

---

## 3. The End-to-End Process

VerifAI operates through a five-stage verification and matching pipeline:

```
[Student Onboarding]
       │
       ▼
[Stage 1: Document Ingestion & Private S3 Storage]
       │ Upload PDF resume + marksheet to private S3 with AES-256 encryption
       ▼
[Stage 2: Multi-Source Parallel Audit]
       ├─► resume-analyzer: spaCy NLP entity extraction + ATS scoring
       ├─► coding-analyzer: Live GitHub commit velocity + LeetCode problem audit
       └─► marksheet-analyzer: Tabular transcript parsing + backlog detection
       ▼
[Stage 3: Ground-Truth Reconciliation & Scoring]
       │ Marksheet computed CGPA overrides self-reported numbers
       │ Placement Readiness Index (PRI) computed across all sources
       │ Merged profile persisted to PostgreSQL 16
       ▼
[Stage 4: Conversational TPO Search & AI Matching]
       │ Recruiter prompt parsed by Groq LLM with structured few-shot schemas
       │ Bounded CGPA range resolved ([min_cgpa, max_cgpa])
       │ Domain terms expanded ("webdev" -> React, JavaScript, HTML, CSS)
       │ Zero-match skill gate disqualifies non-matching candidates
       │ AI clarification suggestions surfaced for ambiguous criteria
       ▼
[Stage 5: Placement Operations & Round Tracking]
       │ Interactive shortlist review with score breakdown
       │ Placement group batching and multi-round interview progression
       │ Async email notification pipeline and CSV export
```

### Stage 1: Document Ingestion and Private Storage
The student uploads their resume and official university marksheet alongside their GitHub and LeetCode usernames. The orchestrator streams the files directly to a private AWS S3 bucket under segregated prefixes (`resumes/`, `marksheets/`) using AES-256 Server-Side Encryption.

### Stage 2: Parallel Multi-Source Audit
The master orchestrator dispatches parallel asynchronous HTTP requests to specialized microservices:
- **`resume-analyzer`**: Extracts structured technical skills, project titles, work experience, and calculates ATS formatting compatibility.
- **`coding-analyzer`**: Queries GitHub REST/GraphQL APIs for 30-day commit streaks, repository ownership, and language distribution, and queries LeetCode GraphQL APIs for problem difficulty breakdowns (Easy, Medium, Hard) and contest ratings.
- **`marksheet-analyzer`**: Extracts tabular semester tables from university marksheets, computes the true cumulative CGPA, and identifies active backlogs by subject code.

### Stage 3: Ground-Truth Reconciliation and Scoring
If a marksheet is provided, its computed CGPA and backlog statuses are established as the supreme authority, overriding any conflicting figures found in the resume. The scoring engine calculates the candidate's Placement Readiness Index (PRI, 0 to 100) using weighted multi-source scoring (Resume 40%, GitHub 20%, LeetCode 20%, Academics 20%). The consolidated profile is persisted to PostgreSQL, and time-bound HMAC tokens are issued for document previews.

### Stage 4: Conversational Search and Candidate Matching
When a placement officer submits a natural language query (e.g., *"Find 5 students with 5-7 cgpa not more then or less then this also they should have the speciality in webdev"*):
1. **Constraint Extraction**: The `jd-analyzer` service queries Groq LLM using few-shot structured JSON schemas to extract parameters.
2. **Bounded Range Enforcement**: Strict lower and upper CGPA bounds (`min_cgpa=5.0`, `max_cgpa=7.0`) are parsed and enforced by the database query filter.
3. **Domain Taxonomy Expansion**: Generic domain terms are expanded into canonical skill sets (e.g., `webdev` expands to `["html", "css", "javascript", "react"]`).
4. **Zero-Match Disqualification**: Candidates who match zero required skills are disqualified before rank scoring.
5. **AI Clarification Suggestions**: If criteria such as branch or backlog policy are unstated, the AI formulates 1 to 3 targeted clarification questions rendered directly in the dashboard UI.

### Stage 5: Placement Operations and Round Progression
TPOs can inspect score breakdowns, review candidate resumes through a same-origin PDF proxy, export shortlists to CSV, group candidates into Placement Groups, track multi-round interview stages, and trigger automated email notification jobs.

---

## 4. Live Deployments

- **Production Web Application**: [https://web-six-pi-61.vercel.app/](https://web-six-pi-61.vercel.app/)
- **AWS API Gateway Endpoint**: `https://upur1tv9bg.execute-api.us-east-1.amazonaws.com`
- **AWS EC2 Compute**: `t3.large` instance running containerized microservices in `us-east-1`
- **Private Document Vault**: Private AWS S3 bucket with AES-256 Server-Side Encryption

---

## 5. Technical Documentation Index

Detailed architectural specifications, schemas, and service-level documentation are maintained in their respective dedicated files:

| Documentation | File Location | Description |
| :--- | :--- | :--- |
| **System Architecture & Service Map** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Microservice network topology, host ports, and cloud ingress architecture |
| **Database Schema (DBML)** | [verifai-schema.dbml](verifai-schema.dbml) | Complete database definition, table structures, indices, and foreign key relations in DBML |
| **Database ER Diagram** | [docs/ARCHITECTURE.md#2-database-schema-and-entity-relationships](docs/ARCHITECTURE.md#2-database-schema-and-entity-relationships) | Visual Entity-Relationship diagram across all 10 tables |
| **Sequence Diagrams** | [docs/ARCHITECTURE.md#3-detailed-sequence-diagrams](docs/ARCHITECTURE.md#3-detailed-sequence-diagrams) | Step-by-step sequence diagrams for student ingestion and TPO search |
| **Scoring Algorithm Formulation** | [docs/ARCHITECTURE.md#4-scoring-algorithm-formulation](docs/ARCHITECTURE.md#4-scoring-algorithm-formulation) | Mathematical formulas and weighting breakdowns for candidate ranking |
| **Document Security & HMAC Tokens** | [docs/ARCHITECTURE.md#5-security-and-document-access-architecture](docs/ARCHITECTURE.md#5-security-and-document-access-architecture) | Private S3 document storage, cryptographic HMAC signing, and PDF proxy specs |
| **Master Orchestrator Service** | [master-service/README.md](master-service/README.md) | FastAPI endpoints, schema mirrors, and orchestration logic |
| **JD Analyzer Service** | [jd-analyzer/README.md](jd-analyzer/README.md) | Groq LLM prompt design, few-shot examples, and regex fallback engine |
| **Resume Analyzer Service** | [resume-analyzer/README.md](resume-analyzer/README.md) | spaCy NLP extraction, PyMuPDF text parsing, and ATS scoring engine |
| **Coding Analyzer Service** | [coding-analyzer/README.md](coding-analyzer/README.md) | GitHub REST/GraphQL and LeetCode GraphQL auditor |
| **Marksheet Analyzer Service** | [marksheet-analyzer/README.md](marksheet-analyzer/README.md) | Tabula and pdfplumber semester marksheet table extraction |
| **Web Frontend Service** | [web/README.md](web/README.md) | Next.js 14 App Router, component architecture, and client API bindings |
| **TPO Matching Plan** | [docs/TPO_MATCHING_AND_JD_PLAN.md](docs/TPO_MATCHING_AND_JD_PLAN.md) | Recruiter matching criteria and ingestion specifications |

---

## 6. Local Quickstart

### Prerequisites
- Docker and Docker Compose
- Node.js 20 LTS and npm
- Python 3.11+

### Running the Microservices
```bash
# 1. Clone the repository
git clone https://github.com/ansh-logics/BHARAT-BUILDS-VerifAI.git
cd BHARAT-BUILDS-VerifAI

# 2. Configure environment variables
cp .env.example .env

# 3. Start all services in development mode
docker compose -f docker-compose.dev.yml up --build -d
```

- Web Portal: `http://localhost:3000`
- Master API & Swagger Docs: `http://localhost:28082/docs`
- PostgreSQL: `localhost:15432`

---

## 7. Automated Verification & Testing

```bash
# Master service integration tests (50 tests)
PYTHONPATH=master-service master-service/.venv/bin/python -m unittest discover master-service/tests/ -v

# JD analyzer constraint extraction tests (4 tests)
PYTHONPATH=jd-analyzer master-service/.venv/bin/python -m unittest discover jd-analyzer/tests/ -v

# Frontend production build verification
cd web && npm run build
```

---

## 8. License

Developed for the **Bharat Builds Hackathon**. Hosted on Vercel and Amazon Web Services.
