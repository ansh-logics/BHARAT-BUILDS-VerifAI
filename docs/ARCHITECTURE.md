# VerifAI Architecture and Technical Specifications

This document outlines the detailed system architecture, service communication topology, entity-relationship database structure, sequence workflows, and scoring algorithms for VerifAI.

For the database definition in DBML format, see [verifai-schema.dbml](../verifai-schema.dbml).

---

## 1. System Topology and Service Map

VerifAI is designed as an event-driven and REST-oriented microservices platform running across AWS Cloud (EC2, S3, API Gateway) and Vercel.

```mermaid
graph TD
    Client["Client / Recruiter / Student"] --> Vercel["Next.js 14 Frontend\n(Vercel)"]
    Vercel --> Proxy["/api/resume-preview\n(Same-Origin PDF Proxy)"]
    Vercel --> APIGW["AWS API Gateway\n(TLS / Ingress)"]
    APIGW --> Master["master-service:8080\n(FastAPI Orchestrator)"]

    Master <--> Postgres[("PostgreSQL 16\nDatabase")]
    Master <--> S3[("AWS S3\nEncrypted Document Vault")]

    Master --> Resume["resume-analyzer:8080\n(spaCy NLP / ATS)"]
    Master --> Coding["coding-analyzer:8080\n(GitHub / LeetCode Scrapers)"]
    Master --> Marksheet["marksheet-analyzer:8080\n(Tabular Transcript Parser)"]
    Master --> JD["jd-analyzer:8080\n(Groq LLM Parser)"]

    Coding --> GitHubAPI["GitHub REST & GraphQL APIs"]
    Coding --> LeetCodeAPI["LeetCode GraphQL API"]
    JD --> GroqAPI["Groq Cloud API\n(Llama-3 / GPT-OSS)"]
```

### Microservice Matrix

| Service | Internal Port | Host Port | Technology Stack | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `web` | `3000` | `28084` | Next.js 14, React 18, Tailwind CSS, Framer Motion | Student portfolio, TPO candidate shortlist explorer, AI insight chips, PDF proxy |
| `master-service` | `8080` | `28082` | FastAPI, SQLAlchemy 2.0, Pydantic v2, Boto3, HTTPX | Central orchestrator, parallel dispatch, scoring math, HMAC token security |
| `jd-analyzer` | `8080` | `28085` | FastAPI, Groq Python SDK, Pydantic v2 | Conversational query parsing, CGPA bound extraction, skill domain expansion |
| `resume-analyzer` | `8080` | `28081` | FastAPI, spaCy `en_core_web_sm`, PyMuPDF, pdfplumber | Resume text extraction, skill entity recognition, ATS compatibility scoring |
| `coding-analyzer` | `8080` | `28080` | FastAPI, HTTPX, BeautifulSoup4, GraphQL | Live GitHub commit velocity and LeetCode problem breakdown auditing |
| `marksheet-analyzer` | `8080` | `28083` | FastAPI, Tabula-py, pdfplumber | University transcript extraction, SGPA calculation, active backlog detection |
| `postgres` | `5432` | `15432` | PostgreSQL 16 Alpine, Alembic | Relational database for profiles, placement groups, uploads, and round states |

---

## 2. Database Schema and Entity Relationships

The relational model is managed via PostgreSQL 16 and Alembic migrations. Full DBML specification is available in [verifai-schema.dbml](../verifai-schema.dbml).

```mermaid
erDiagram
    STUDENTS ||--o| STUDENT_PROFILES : "has one profile"
    STUDENTS ||--o{ RAW_UPLOADS : "has many uploads"
    STUDENTS ||--o{ PLACEMENT_RECORDS : "has many placements"
    STUDENTS ||--o{ TPO_ANALYSIS_GROUP_MEMBERS : "enrolled in groups"
    STUDENTS ||--o{ TPO_GROUP_ROUND_MEMBERS : "participates in rounds"

    TPO_ANALYSIS_GROUPS ||--o{ TPO_ANALYSIS_GROUP_MEMBERS : "contains"
    TPO_ANALYSIS_GROUPS ||--o{ TPO_GROUP_ROUNDS : "tracks rounds"
    TPO_ANALYSIS_GROUPS ||--o{ TPO_MAIL_JOBS : "dispatches emails"

    TPO_GROUP_ROUNDS ||--o{ TPO_GROUP_ROUND_MEMBERS : "round candidates"

    STUDENTS {
        int id PK
        string name
        string email UK
        string roll_no UK
        string password_hash
        string phone
        string branch
        float cgpa
        string gender
        boolean cgpa_verified
        boolean has_active_backlog
        datetime created_at
    }

    STUDENT_PROFILES {
        int id PK
        int student_id FK,UK
        string github_username UK
        string leetcode_username UK
        text_array skills
        string coding_persona
        float coding_score
        float academic_score
        float overall_score
        jsonb github_data
        jsonb leetcode_data
        jsonb resume_data
        jsonb academic_data
        json skills_json
        datetime last_analyzed_at
    }

    RAW_UPLOADS {
        int id PK
        int student_id FK
        string resume_url
        string marksheet_url
        datetime uploaded_at
    }

    PLACEMENT_RECORDS {
        int id PK
        int student_id FK
        string company_name
        string offer_type
        float pay_amount
        text notes
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    TPO_ANALYSIS_GROUPS {
        int id PK
        string title
        text jd_summary
        string company_name
        string role_type
        string pay_or_stipend
        string duration
        text bond_details
        json jd_topics
        json jd_key_points
        string interview_timezone
        int total_rounds
        int current_round_no
        string round_state
        string created_by
        datetime created_at
    }

    TPO_ANALYSIS_GROUP_MEMBERS {
        int id PK
        int group_id FK
        int student_id FK
        datetime added_at
    }

    TPO_GROUP_ROUNDS {
        int id PK
        int group_id FK
        int round_no
        string status
        datetime finalized_at
        datetime created_at
        datetime updated_at
    }

    TPO_GROUP_ROUND_MEMBERS {
        int id PK
        int round_id FK
        int student_id FK
        string status
        datetime created_at
        datetime updated_at
    }

    TPO_MAIL_JOBS {
        int id PK
        int group_id FK
        string requested_by
        string mail_type
        int round_no
        string outcome
        string status
        int total_recipients
        int processed_count
        int success_count
        int failure_count
        text last_error
        datetime started_at
        datetime finished_at
        datetime created_at
        datetime updated_at
    }

    TPO_SETTINGS {
        int id PK
        string tpo_username UK
        string display_name
        string contact_number
        string institute_name
        string sender_name
        string reply_to_email
        string default_timezone
        boolean stale_group_reminder_enabled
        boolean daily_queue_summary_enabled
        boolean placement_update_confirmation_enabled
        string tpo_password_hash
        datetime created_at
        datetime updated_at
    }
```

---

## 3. Detailed Sequence Diagrams

### Sequence Diagram 1: Student Ingestion and Multi-Source Audit

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Web as Next.js Web App
    participant Master as master-service
    participant S3 as AWS S3 Vault
    participant Resume as resume-analyzer
    participant Coding as coding-analyzer
    participant Marksheet as marksheet-analyzer
    participant DB as PostgreSQL 16

    Student->>Web: Upload Resume (PDF) + Marksheet (PDF) + Handles
    Web->>Master: POST /analyze-profile (multipart/form-data)
    
    par Document Security & Storage
        Master->>S3: PutObject: Resume (AES-256 SSE, key: resumes/<uuid>.pdf)
        S3-->>Master: Resume S3 Key
        Master->>S3: PutObject: Marksheet (AES-256 SSE, key: marksheets/<uuid>.pdf)
        S3-->>Master: Marksheet S3 Key
    end

    par Parallel Async Analysis
        Master->>Resume: POST /analyze (resume document bytes)
        Resume-->>Master: Extracted Skills, Experience, Projects, ATS Score
        
        Master->>Coding: POST /analyze (GitHub / LeetCode usernames)
        Coding-->>Master: Commit History, Language Breakdown, LeetCode Solved Metrics
        
        Master->>Marksheet: POST /analyze (marksheet document bytes)
        Marksheet-->>Master: Computed CGPA, Semester SGPA History, Active Backlogs
    end

    Note over Master: Marksheet CGPA overrides self-reported resume values
    Master->>Master: Compute Placement Readiness Index and Component Scores
    
    Master->>DB: Upsert Student, StudentProfile, and RawUpload records
    DB-->>Master: Transaction Committed
    
    Master->>Master: Generate time-bound HMAC signed access tokens for documents
    Master-->>Web: Verified Profile JSON (scores, skills, tokens)
    Web-->>Student: Render Verified Student Profile Dashboard
```

---

### Sequence Diagram 2: Conversational TPO Search and Matching Engine

```mermaid
sequenceDiagram
    autonumber
    actor TPO as Placement Officer (TPO)
    participant Web as Next.js Web App
    participant Master as master-service
    participant JD as jd-analyzer
    participant Groq as Groq Cloud LLM
    participant DB as PostgreSQL 16

    TPO->>Web: Submit conversational prompt (e.g. "Find 5 students with 5-7 cgpa and webdev skills")
    Web->>Master: POST /student/match-jd { jd_text, top_k }
    
    Master->>JD: POST /analyze { jd_text }
    JD->>Groq: Few-shot structured inference with JSON schema
    Groq-->>JD: Extracted constraints JSON
    
    Note over JD: Regex fallback resolves bounded CGPA window [min: 5.0, max: 7.0]
    Note over JD: Domain expansion: "webdev" -> [html, css, javascript, react]
    Note over JD: Formulation of AI clarification questions for open criteria
    
    JD-->>Master: JDParsedConstraints (min_cgpa, max_cgpa, required_skills, clarifications)
    
    Master->>DB: Fetch candidates with joined profiles and placements
    DB-->>Master: Candidate dataset
    
    loop Candidate Filtering and Evaluation
        Master->>Master: Enforce min_cgpa and max_cgpa bounds
        Master->>Master: Apply branch, gender, and backlog exclusion rules
        Master->>Master: Apply Skill Gate (disqualify candidates with 0 required skill matches)
        Master->>Master: Compute dynamic weighted match score (Resume, Coding, Academics)
    end
    
    Master->>Master: Rank eligible candidates by score descending and truncate to top_k
    Master->>Master: Sign time-bound HMAC tokens for candidate resume previews
    Master-->>Web: JDMatchResponse (candidates, filter rejection summary, clarifications)
    
    Web-->>TPO: Render ranked shortlist table with score breakdown and AI insight chips
```

---

## 4. Scoring Algorithm Formulation

The final candidate rank score ($S_{\text{final}} \in [0, 100]$) is computed through dynamic weighted aggregation:

$$S_{\text{final}} = w_r \cdot S_{\text{resume}} + w_g \cdot S_{\text{github}} + w_l \cdot S_{\text{leetcode}} + w_a \cdot S_{\text{academics}}$$

### Default Weight Distribution

| Component | Default Weight | Scoring Basis |
| :--- | :--- | :--- |
| **Resume Score ($S_{\text{resume}}$)** | $0.40$ | Direct token matching and skill family intersection against required/preferred JD skills. |
| **GitHub Score ($S_{\text{github}}$)** | $0.20$ | 30-day commit velocity, language diversity, and original repository contribution depth. |
| **LeetCode Score ($S_{\text{leetcode}}$)** | $0.20$ | Problem difficulty mix: $\text{Score} \propto 1 \cdot \text{Easy} + 3 \cdot \text{Medium} + 5 \cdot \text{Hard}$. |
| **Academic Score ($S_{\text{academics}}$)** | $0.20$ | Normalized marksheet verified CGPA: $S_{\text{academics}} = \min(100, \frac{\text{CGPA}}{10} \cdot 100)$. |

### Placement Readiness Index (PRI) Tiers
- **Needs Focus**: $S_{\text{final}} < 40.0$
- **Building**: $40.0 \le S_{\text{final}} < 70.0$
- **Ready**: $70.0 \le S_{\text{final}} < 85.0$
- **Exceptional**: $S_{\text{final}} \ge 85.0$

---

## 5. Security and Document Access Architecture

1. **Private S3 Storage**: Objects are stored with Server-Side Encryption (`aws:kms` or `AES256`). Public read access is blocked.
2. **HMAC Signed URLs**: Access to stored documents (`resumes/`, `marksheets/`) requires a cryptographic HMAC signature:
   - Tokens embed the document key, expiration timestamp, and SHA-256 HMAC digest generated with `STORAGE_SIGNING_SECRET`.
   - Path traversal attempts (`..`, backslashes) and unauthorized S3 key prefixes are strictly rejected.
3. **Same-Origin PDF Proxy**: Vercel serves a streaming proxy route `/api/resume-preview` that validates the HMAC token and streams PDF bytes directly to the browser, resolving cross-origin CORS limitations with PDF.js viewers.
