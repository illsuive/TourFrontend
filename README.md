# 🌌 MoonVoyage Operations — Full-Stack Frontend Architecture Blueprint

Welcome to the production-ready frontend subsystem for the **MoonVoyage Operations Platform**. This workspace is engineered using **Next.js 15 (App Router)** and compiled via the **Turbopack** build engine to deliver a hyper-performant, zero-hydration-flash Single Page Application (SPA) environment. 

The frontend orchestrates deterministic AI engine interactions, reactive dashboard grids, and secure client-side payment gateways.

---

## 🏗️ System & Architecture Topology

The application relies on a strict separation of concerns, utilizing an alias-mapped (`@/`) directory tree to preserve modular structure. To maximize page speeds, data distribution filters, user sandbox sorting, and administrative analytics charts are computed lazily directly inside client components.

### 1. Unified Single-Query Data Ingestion
To eliminate the network overhead of multiple REST queries on mounting, the dashboard operates on a single **Master Manifest Data Stream** pattern.

```mermaid
graph TD
    A[Express Database Server] -->|Single Array Payload| B[src/app/dashboard/page.jsx]
    B -->|Filter: userId == creator && !isPublic| C[📦 Personal Generative Sandboxes]
    B -->|Filter: isPublic == true| D[🌟 Featured Public Marketplace Tours]
    B -->|Filter: assignedTo == user._id| E[🎁 Direct Admin Assignments]
    
    style B fill:#7c3aed,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#f3e8ff,stroke:#c084fc,stroke-width:1px
    style D fill:#fef3c7,stroke:#f59e0b,stroke-width:1px
    style E fill:#e0e7ff,stroke:#818cf8,stroke-width:1px
