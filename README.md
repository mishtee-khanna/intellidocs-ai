# IntelliDocs AI

> An intelligent document management and Q&A platform powered by local AI embeddings and RAG (Retrieval-Augmented Generation).

IntelliDocs AI lets you upload your documents (PDF, PNG, JPG, DOCX) and instantly chat with them. The app extracts text, generates semantic embeddings, and uses a context-aware AI pipeline to answer your questions based on the content of your documents.

---

## ✨ Features

- 📄 **Document Upload** — Upload PDF, PNG, JPG, and DOCX files via a clean drag-and-drop interface
- 🧠 **AI Embeddings** — Text is automatically chunked and embedded using HuggingFace's `all-MiniLM-L6-v2` model
- 💬 **Chat / Q&A** — Ask questions and get answers sourced directly from your uploaded documents
- 🔍 **RAG Pipeline** — Retrieval-Augmented Generation ensures answers are grounded in your own data
- 🔐 **Authentication** — Secure user accounts powered by NextAuth.js with credentials support
- 🗃️ **Database Persistence** — Document metadata and chunk embeddings are stored in a MySQL database via Prisma ORM

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Database** | MySQL / MariaDB |
| **AI Embeddings** | [@huggingface/transformers](https://huggingface.co/docs/transformers.js) |
| **LLM Chaining** | [LangChain.js](https://js.langchain.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **MySQL / MariaDB** database instance

### 1. Clone the Repository

```bash
git clone https://github.com/mishtee-khanna/intellidocs-ai.git
cd intellidocs-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project:

```env
# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🗂 Project Structure

```
intellidocs-ai/
├── prisma/
│   └── schema.prisma        # Database schema (User, Document, DocumentChunk)
├── src/
│   ├── app/
│   │   ├── page.tsx         # Landing / Login page
│   │   ├── (main)/          # Authenticated app routes
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── documents/   # Document upload & management
│   │   │   ├── chat/        # Chat / Q&A interface
│   │   │   └── settings/    # User settings
│   │   └── api/
│   │       ├── auth/        # NextAuth route handlers
│   │       ├── chat/        # Chat API (RAG pipeline)
│   │       └── documents/
│   │           ├── upload/  # File upload handler
│   │           └── process/ # Text extraction & embedding
│   ├── components/          # Shared UI components
│   └── lib/
│       ├── auth.ts          # NextAuth configuration
│       └── prisma.ts        # Prisma client singleton
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/upload` | Upload a document file |
| `POST` | `/api/documents/process` | Extract text and generate embeddings |
| `POST` | `/api/chat` | Submit a question and get an AI answer |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth authentication handlers |

---

## ☁️ Deployment (Vercel)

This project is configured for deployment on Vercel.

### Required Environment Variables on Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your MySQL/MariaDB connection string |
| `NEXTAUTH_SECRET` | A random 32+ character secret string |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://your-app.vercel.app`) |

> **Note:** The `npm run build` script automatically runs `prisma generate` before the Next.js build, so no extra Vercel configuration is needed for Prisma.

### Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 📋 Database Schema

```
User ──< Document ──< DocumentChunk
```

- **User** — Stores account credentials and profile info
- **Document** — Tracks uploaded files, their status (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`), and extracted text
- **DocumentChunk** — Stores chunked content and JSON-serialized vector embeddings for semantic search

---

## 🧩 How It Works

1. **Upload** — User uploads a file → saved to `/tmp` (Vercel-safe) → metadata saved to the database
2. **Process** — Text is extracted from the file → split into chunks → each chunk is embedded using `all-MiniLM-L6-v2`
3. **Chat** — User asks a question → question is embedded → most similar chunks are retrieved → answer is generated using the retrieved context

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is private and not licensed for public distribution.
