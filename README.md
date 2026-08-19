<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff6ec7,35:f72585,70:9b5de5,100:00c6ff&height=240&section=header&text=IntelliDocs%20AI&fontSize=62&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI-powered%20document%20intelligence&descAlignY=61&descSize=20" width="100%" alt="IntelliDocs AI animated header" />

<a href="https://github.com/mishtee-khanna/intellidocs-ai">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=20&duration=2600&pause=700&color=9B5DE5&center=true&vCenter=true&width=820&lines=Upload+%E2%86%92+Understand+%E2%86%92+Ask+%E2%86%92+Get+Answers;Turn+documents+into+an+interactive+knowledge+base;Semantic+Search+%2B+RAG+%2B+Conversational+AI;Your+documents.+Your+knowledge.+Your+AI.%22" alt="Animated typing tagline" />
</a>

<br/>

<img src="https://img.shields.io/badge/✨_AI_Document_Intelligence-9b5de5?style=for-the-badge" alt="AI Document Intelligence" />
<img src="https://img.shields.io/badge/🚀_Built_with-Next.js-black?style=for-the-badge" alt="Built with Next.js" />
<img src="https://img.shields.io/badge/💬_Conversational-RAG-ff6ec7?style=for-the-badge" alt="Conversational RAG" />

<br/><br/>

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,mysql,vercel&perline=7" alt="Technology icons" />

<br/><br/>

<a href="https://github.com/mishtee-khanna/intellidocs-ai/stargazers"><img src="https://img.shields.io/github/stars/mishtee-khanna/intellidocs-ai?style=flat-square&logo=github&color=ff69b4" alt="GitHub stars" /></a>
<a href="https://github.com/mishtee-khanna/intellidocs-ai/network/members"><img src="https://img.shields.io/github/forks/mishtee-khanna/intellidocs-ai?style=flat-square&color=9b5de5" alt="GitHub forks" /></a>
<a href="https://github.com/mishtee-khanna/intellidocs-ai/issues"><img src="https://img.shields.io/github/issues/mishtee-khanna/intellidocs-ai?style=flat-square&color=00c6ff" alt="GitHub issues" /></a>
<img src="https://img.shields.io/github/last-commit/mishtee-khanna/intellidocs-ai?style=flat-square&color=f72585" alt="Last commit" />

</div>

---

## ✨ The Idea

<div align="center">

> ### 📚 **Stop searching through documents. Start talking to them.**
>
> IntelliDocs AI turns static **PDF, DOCX, PNG & JPG** files into an interactive knowledge base where users can upload, search, and ask questions in natural language.

</div>

<br/>

<div align="center">

```text
📄 DOCUMENTS  ──────►  🧠 UNDERSTAND  ──────►  💬 CONVERSE
     │                         │                       │
     └─────────────── IntelliDocs AI ────────────────┘
```

</div>

---

## ⚡ What Can It Do?

<table>
<tr>
<td width="50%" align="center">

### 📄 Smart Upload
Upload **PDF, DOCX, PNG & JPG** files and build your personal document workspace.

</td>
<td width="50%" align="center">

### 🧠 Semantic Understanding
Convert document content into meaningful vectors using **all-MiniLM-L6-v2** embeddings.

</td>
</tr>
<tr>
<td width="50%" align="center">

### 💬 Conversational Q&A
Ask questions naturally and receive answers based on your documents.

</td>
<td width="50%" align="center">

### 🔍 RAG-powered Retrieval
Retrieve relevant document chunks before generating an answer, helping keep responses grounded.

</td>
</tr>
<tr>
<td width="50%" align="center">

### 🔐 Secure Authentication
User authentication and sessions powered by **NextAuth.js**.

</td>
<td width="50%" align="center">

### 🗃️ Persistent Knowledge
Document metadata, extracted content, chunks and embeddings persist through **Prisma + MySQL/MariaDB**.

</td>
</tr>
</table>

---

## 🎬 The IntelliDocs Flow

<div align="center">

```text
       📤 UPLOAD
           │
           ▼
    ┌───────────────┐
    │ 📄 Extract    │
    │     Text      │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ ✂️ Chunk      │
    │   Content     │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ 🧠 Embed      │
    │ all-MiniLM    │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ 💾 Store      │
    │ Prisma + DB   │
    └───────┬───────┘
            │
            ▼
         ❓ ASK
            │
            ▼
    ┌───────────────┐
    │ 🔎 Retrieve   │
    │ Relevant      │
    │ Chunks        │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ ✨ ANSWER     │
    │ Context-aware │
    └───────────────┘
```

</div>

---

## 🌈 Architecture at a Glance

<div align="center">

```text
                         👩‍💻 USER
                            │
                            ▼
              ┌─────────────────────────┐
              │      🎨 FRONTEND        │
              │ Next.js • React • TS    │
              │      Tailwind CSS       │
              └────────────┬────────────┘
                           │
                       API REQUESTS
                           │
                           ▼
              ┌─────────────────────────┐
              │       ⚙️ API LAYER       │
              │ Auth • Documents • Chat │
              └────────────┬────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
        ┌───────────────┐     ┌────────────────┐
        │ 🗄️ DATABASE   │     │ 🧠 AI / RAG     │
        │ Prisma + MySQL│     │ LangChain.js   │
        └───────────────┘     │ + Embeddings   │
                              └────────────────┘
```

</div>

---

## 🛠️ Tech Stack

<div align="center">

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

</div>

---

## 🔌 API Layer

<div align="center">

| Method | Endpoint | Purpose |
|:---:|---|---|
| `POST` | `/api/documents/upload` | 📤 Upload a document |
| `POST` | `/api/documents/process` | 🔎 Extract text + generate embeddings |
| `POST` | `/api/chat` | 💬 Ask questions through the RAG pipeline |
| `GET / POST` | `/api/auth/[...nextauth]` | 🔐 Authentication handlers |

</div>

---

## 🗂️ Project Structure

```text
intellidocs-ai/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── page.tsx                 # 🏠 Landing / Login
│   │   ├── (main)/
│   │   │   ├── dashboard/           # 📊 Dashboard
│   │   │   ├── documents/           # 📄 Upload & management
│   │   │   ├── chat/                # 💬 AI Q&A
│   │   │   └── settings/            # ⚙️ Settings
│   │   │
│   │   └── api/
│   │       ├── auth/                # 🔐 Authentication
│   │       ├── chat/                # 💬 Chat API
│   │       └── documents/
│   │           ├── upload/          # 📤 File upload
│   │           └── process/          # 🧠 Processing
│   │
│   ├── components/                  # 🧩 Reusable UI
│   └── lib/                          # 🔧 Shared utilities
│
└── README.md
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/mishtee-khanna/intellidocs-ai.git
cd intellidocs-ai
npm install
```

Create `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

Then:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Open **http://localhost:3000** ✨

---

## 🗃️ Data Model

<div align="center">

```text
            👤 User
              │
              │ 1 : N
              ▼
         📄 Document
              │
              │ 1 : N
              ▼
       🧩 DocumentChunk
```

</div>

- **User** → account and profile information
- **Document** → uploaded file metadata, status and extracted text
- **DocumentChunk** → chunked content + serialized vector embeddings

---

## 💖 Why IntelliDocs AI?

<div align="center">

| Traditional Way | IntelliDocs AI |
|:---:|:---:|
| 🔍 Search | 💬 Ask |
| 📜 Scroll | 🧠 Understand |
| ⏳ Spend time | ⚡ Get answers |
| 🔁 Repeat | ✨ Converse |

### **Upload → Ask → Retrieve → Understand** 🚀

</div>

---

## 🔮 Roadmap

```text
████████████████████░░  Core platform
██████████████░░░░░░░░  API integration
████████████░░░░░░░░░░  Advanced RAG
██████████░░░░░░░░░░░░  Multi-document Q&A
████████░░░░░░░░░░░░░░  Multilingual support
```

- [ ] 📊 Advanced document analytics
- [ ] 📑 Better table & structured-data extraction
- [ ] 🌍 Multilingual document Q&A
- [ ] 🧩 More document formats
- [ ] 🔎 Improved vector-search infrastructure
- [ ] 👥 Shared document workspaces
- [ ] 📚 Multi-document conversations

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌱 Create a feature branch
3. 💻 Commit your changes
4. 🚀 Open a pull request

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&duration=3000&pause=1000&color=FF6EC7&center=true&vCenter=true&width=650&lines=Made+with+curiosity+%E2%9C%A8;Built+to+make+documents+smarter+%F0%9F%A7%A0;Upload.+Ask.+Understand.+%F0%9F%92%AC" alt="Animated closing message" />

<br/><br/>

<a href="https://github.com/mishtee-khanna/intellidocs-ai">⭐ Star the repository if you like IntelliDocs AI!</a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,35:9b5de5,70:f72585,100:ff6ec7&height=140&section=footer&animation=fadeIn" width="100%" alt="Animated footer" />

</div>
