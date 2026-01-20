# Sādhanā Prototype (Web-first PWA)

A demoable Next.js 14 prototype for Sādhanā featuring Pandit Mode (RAG with citations), an adaptive daily practice generator, journaling, and source ingestion health.

## Features
- **Ask**: Pandit Mode chat with RAG citations (no hallucinated citations).
- **Practice**: Adaptive daily sādhanā plan generator.
- **Journal**: Entries with optional summaries + weekly summary demo.
- **Sources**: Catalog + ingestion health dashboard.
- **PWA**: Installable manifest + placeholder icons.
- **Tier gating**: Ajñā, Jijñāsu, Jñānī demo tiers.

## Windows-first setup
1. **Install Node.js 18+** (includes npm).
2. Clone the repo and open PowerShell in the project root.
3. Create your environment file:
   ```powershell
   Copy-Item .env.example .env
   ```
4. Install dependencies:
   ```powershell
   npm install
   ```
5. Run Prisma migrations:
   ```powershell
   npx prisma migrate dev --name init
   ```
6. Ingest sources:
   ```powershell
   npm run ingest
   ```
7. Start the dev server:
   ```powershell
   npm run dev
   ```

The app will be available at http://localhost:3000.

## Environment variables
| Variable | Purpose | Example |
| --- | --- | --- |
| `DATABASE_URL` | SQLite connection string | `file:./dev.db` |

## Scripts
- `npm run dev`: Start Next.js dev server.
- `npm run ingest`: Chunk, embed, and ingest sources from `/sources_seed`.
- `npm run prisma:migrate`: Run Prisma migrations.

## Notes
- Embeddings are generated locally with a deterministic hash-based embedder for fast local demoing.
- Pandit Mode system prompt is shipped in the API response for inspection.
