<div align="center">

<a href="https://github.com/mishtee-khanna/intellidocs-ai">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff6ec7,50:9b5de5,100:00c6ff&height=220&section=header&text=IntelliDocs%20AI&fontSize=58&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Chat%20with%20your%20documents%20using%20AI%20%7C%20RAG%20%7C%20Semantic%20Search&descAlignY=60&descSize=18" width="100%" alt="IntelliDocs AI banner" />
</a>

<a href="https://github.com/mishtee-khanna/intellidocs-ai">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=900&color=9B5DE5&center=true&vCenter=true&width=750&lines=Upload+%E2%86%92+Understand+%E2%86%92+Ask+%E2%86%92+Get+Answers;AI-powered+document+intelligence;Retrieval-Augmented+Generation+%2B+semantic+embeddings;Your+documents%2C+your+knowledge%2C+your+AI" alt="Typing animation" />
</a>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

<p>
  <img src="https://img.shields.io/badge/LangChain.js-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face" />
  <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=auth0&logoColor=white" alt="NextAuth.js" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p>
  <a href="https://github.com/mishtee-khanna/intellidocs-ai/stargazers"><img src="https://img.shields.io/github/stars/mishtee-khanna/intellidocs-ai?style=flat-square&logo=github&color=ff69b4" alt="GitHub stars" /></a>
  <a href="https://github.com/mishtee-khanna/intellidocs-ai/network/members"><img src="https://img.shields.io/github/forks/mishtee-khanna/intellidocs-ai?style=flat-square&color=9b5de5" alt="GitHub forks" /></a>
  <a href="https://github.com/mishtee-khanna/intellidocs-ai/issues"><img src="https://img.shields.io/github/issues/mishtee-khanna/intellidocs-ai?style=flat-square&color=00c6ff" alt="GitHub issues" /></a>
  <img src="https://img.shields.io/github/last-commit/mishtee-khanna/intellidocs-ai?style=flat-square&color=7b2cbf" alt="Last commit" />
</p>

</div>

---

## 💡 What is IntelliDocs AI?

**IntelliDocs AI** is an intelligent document management and Q&A platform that turns static files into an interactive knowledge base.

Upload **PDF, PNG, JPG, or DOCX** files, let the AI process their contents, and ask questions in natural language. Instead of manually searching through pages, IntelliDocs retrieves the most relevant information and generates context-aware answers from your own documents.

> ✨ **Think of it as:** *your documents + semantic search + RAG + conversational AI in one place.*

---

## ⚡ Core Features

<table>
<tr>
<td width="50%">

### 📄 Smart Document Upload
Drag & drop **PDF, PNG, JPG & DOCX** files into the platform and start building your personal knowledge base.

</td>
<td width="50%">

### 🧠 Semantic Embeddings
Documents are chunked and transformed into semantic vectors using **Hugging Face `all-MiniLM-L6-v2`**.

</td>
</tr>
<tr>
<td width="50%">

### 💬 Conversational Q&A
Ask questions naturally and receive answers based on the content of your uploaded documents.

</td>
<td width="50%">

### 🔍 RAG Pipeline
Retrieval-Augmented Generation retrieves relevant chunks before generating an answer, keeping responses grounded in your data.

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Authentication
Secure user accounts and protected application routes powered by **NextAuth.js**.

</td>
<td width="50%">

### 🗃️ Persistent Knowledge Base
Document metadata, extracted content, chunks, and embeddings are persisted through **Prisma + MySQL/MariaDB**.

</td>
</tr>
</table>

---

## 🧠 How IntelliDocs AI Works

```text
┌─────────────────┐
│   📤 UPLOAD     │
│ PDF • DOCX •    │
│ PNG • JPG       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  🔎 EXTRACT     │
│   Text / Data   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✂️ CHUNK       │
│ Split content   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  🧠 EMBED       │
│ all-MiniLM-     │
│ L6-v2 vectors   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  💾 STORE       │
│ Prisma + MySQL  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  💬 ASK         │
│ Natural-language│
│ question        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  🔍 RETRIEVE    │
│ Relevant chunks │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✨ ANSWER      │
│ Context-aware   │
│ AI response     │
└─────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🎨 Frontend | **Next.js 16 · React · Tailwind CSS v4** |
| 💻 Language | **TypeScript** |
| 🔐 Authentication | **NextAuth.js** |
| 🗄️ Database | **MySQL / MariaDB** |
| 🔄 ORM | **Prisma** |
| 🧠 Embeddings | **Hugging Face Transformers · all-MiniLM-L6-v2** |
| 🔎 AI Pipeline | **LangChain.js · RAG** |
| ☁️ Deployment | **Vercel** |

---

## 🗂️ Project Structure

```text
intellidocs-ai/
│
├── prisma/
│   └── schema.prisma          # Database schema
│
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing / Login
│   │   ├── (main)/
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── documents/     # Upload & management
│   │   │   ├── chat/          # AI Q&A interface
│   │   │   └── settings/      # User settings
│   │   │
│   │   └── api/
│   │       ├── auth/          # NextAuth handlers
│   │       ├── chat/           # RAG chat API
│   │       └── documents/
│   │           ├── upload/    # File upload
│   │           └── process/   # Extraction & embeddings
│   │
│   ├── components/            # Reusable UI components
│   └── lib/
│       ├── auth.ts            # Auth configuration
│       └── prisma.ts          # Prisma client
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/documents/upload` | Upload a document |
| `POST` | `/api/documents/process` | Extract text + generate embeddings |
| `POST` | `/api/chat` | Ask questions through the RAG pipeline |
| `GET/POST` | `/api/auth/[...nextauth]` | Authentication handlers |

---

## 🚀 Run Locally

### 1. Clone

```bash
git clone https://github.com/mishtee-khanna/intellidocs-ai.git
cd intellidocs-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create `.env` in the project root:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Prepare Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the app

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## ☁️ Deploy with Vercel

IntelliDocs AI is configured for Vercel deployment.

Add these environment variables in your Vercel project:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL/MariaDB connection string |
| `NEXTAUTH_SECRET` | 32+ character authentication secret |
| `NEXTAUTH_URL` | Your deployed application URL |

```bash
npm i -g vercel
vercel --prod
```

---

## 🗃️ Database Model

```text
User
 │
 └───< Document
          │
          └───< DocumentChunk
```

- **User** → account and profile information
- **Document** → uploaded file metadata, status, extracted text
- **DocumentChunk** → chunked content + serialized vector embeddings

---

## 🌟 Why IntelliDocs AI?

> **Traditional document reading:** Search → Scroll → Read → Repeat
>
> **IntelliDocs AI:** Upload → Ask → Retrieve → Understand ✨

It is designed to reduce the time spent manually navigating long documents and make document knowledge accessible through natural-language interaction.

---

## 🔮 Future Scope

- [ ] 📊 Advanced document analytics
- [ ] 📑 Better table and structured-data extraction
- [ ] 🌍 Multilingual document Q&A
- [ ] 🧩 More document formats
- [ ] 🔎 Improved vector-search infrastructure
- [ ] 👥 Shared document workspaces
- [ ] 📚 Multi-document conversations

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

<div align="center">

### 💖 Built to make documents easier to understand.

<a href="https://github.com/mishtee-khanna/intellidocs-ai">⭐ Star the repository if you like the project!</a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,50:9b5de5,100:ff6ec7&height=120&section=footer&animation=fadeIn" width="100%" alt="Footer animation" />

</div>
