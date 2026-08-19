<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff6ec7,30:f72585,65:9b5de5,100:00c6ff&height=250&section=header&text=IntelliDocs%20AI&fontSize=64&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Turn%20documents%20into%20conversations&descAlignY=61&descSize=20" width="100%" alt="Animated IntelliDocs AI header" />

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=20&duration=2400&pause=650&color=9B5DE5&center=true&vCenter=true&width=850&lines=%F0%9F%93%84+Upload+%E2%86%92+%F0%9F%A7%A0+Understand+%E2%86%92+%F0%9F%92%AC+Ask+%E2%86%92+%E2%9C%A8+Answer;AI-powered+document+intelligence;Semantic+Search+%2B+RAG+%2B+Conversational+AI;Your+documents.+Your+knowledge.+Your+AI." alt="Animated project tagline" />

<br/>

<img src="https://img.shields.io/badge/✨_AI_Document_Intelligence-9b5de5?style=for-the-badge" alt="AI Document Intelligence" />
<img src="https://img.shields.io/badge/🚀_Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/💬_RAG-ff6ec7?style=for-the-badge" alt="RAG" />

<br/><br/>

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,mysql,vercel&perline=7" alt="Tech stack icons" />

<br/><br/>

<a href="https://github.com/mishtee-khanna/intellidocs-ai/stargazers"><img src="https://img.shields.io/github/stars/mishtee-khanna/intellidocs-ai?style=flat-square&logo=github&color=ff69b4" alt="Stars" /></a>
<a href="https://github.com/mishtee-khanna/intellidocs-ai/network/members"><img src="https://img.shields.io/github/forks/mishtee-khanna/intellidocs-ai?style=flat-square&color=9b5de5" alt="Forks" /></a>
<a href="https://github.com/mishtee-khanna/intellidocs-ai/issues"><img src="https://img.shields.io/github/issues/mishtee-khanna/intellidocs-ai?style=flat-square&color=00c6ff" alt="Issues" /></a>
<img src="https://img.shields.io/github/last-commit/mishtee-khanna/intellidocs-ai?style=flat-square&color=f72585" alt="Last commit" />

</div>

---

<div align="center">

## 💫 Meet Your Documents Differently

<img src="https://readme-typing-svg.demolab.com?font=Space+Mono&size=17&duration=2200&pause=700&color=F72585&center=true&vCenter=true&width=720&lines=No+more+endless+scrolling+%F0%9F%93%9C;No+more+manual+searching+%F0%9F%94%8D;Just+upload%2C+ask%2C+and+understand+%F0%9F%92%AC" alt="Animated value proposition" />

**IntelliDocs AI** transforms static PDF, DOCX, PNG and JPG files into an interactive knowledge base where users can upload documents and ask questions in natural language.

</div>

---

## 🌸 Core Features

<div align="center">

| 📄 Smart Upload | 🧠 Semantic Understanding | 💬 Conversational Q&A |
|:---:|:---:|:---:|
| PDF • DOCX • PNG • JPG | Embeddings with `all-MiniLM-L6-v2` | Ask questions naturally |

| 🔍 RAG Retrieval | 🔐 Authentication | 🗃️ Persistent Knowledge |
|:---:|:---:|:---:|
| Retrieve relevant chunks | NextAuth.js sessions | Prisma + MySQL/MariaDB |

</div>

---

## 🎞️ How IntelliDocs Thinks

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&duration=1800&pause=500&color=9B5DE5&center=true&vCenter=true&width=760&lines=STEP+01+%E2%86%92+Read+the+document;STEP+02+%E2%86%92+Split+the+content;STEP+03+%E2%86%92+Create+embeddings;STEP+04+%E2%86%92+Retrieve+relevant+chunks;STEP+05+%E2%86%92+Generate+an+answer" alt="Animated RAG steps" />

```text
📤 UPLOAD
    │
    ▼
📄 EXTRACT ──► ✂️ CHUNK ──► 🧠 EMBED ──► 💾 STORE
                                             │
                                             ▼
❓ ASK ◄────────────────────────────── 🔎 RETRIEVE
    │
    ▼
✨ CONTEXT-AWARE ANSWER
```

</div>

---

## 🌈 Application Architecture

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
                      ⚡ API REQUESTS
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

## 🔌 API Layer

<div align="center">

| Method | Endpoint | Purpose |
|:---:|---|---|
| `POST` | `/api/documents/upload` | 📤 Upload a document |
| `POST` | `/api/documents/process` | 🔎 Process document + embeddings |
| `POST` | `/api/chat` | 💬 Document Q&A |
| `GET / POST` | `/api/auth/[...nextauth]` | 🔐 Authentication |

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
│   │   │   ├── documents/           # 📄 Documents
│   │   │   ├── chat/                # 💬 AI Chat
│   │   │   └── settings/            # ⚙️ Settings
│   │   │
│   │   └── api/
│   │       ├── auth/                # 🔐 Authentication
│   │       ├── chat/                # 💬 Chat API
│   │       └── documents/
│   │           ├── upload/          # 📤 Upload API
│   │           └── process/         # 🧠 Processing API
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

## 💖 Traditional vs IntelliDocs

<div align="center">

```text
TRADITIONAL DOCUMENT WORKFLOW

🔍 Search → 📜 Scroll → 👀 Read → 🔁 Repeat

                         VS

INTELLIDOCS AI

📤 Upload → 💬 Ask → 🔎 Retrieve → ✨ Understand
```

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&duration=2600&pause=800&color=00C6FF&center=true&vCenter=true&width=700&lines=From+static+files+to+interactive+knowledge;From+searching+to+conversing;From+pages+to+answers+%E2%9C%A8" alt="Animated comparison" />

</div>

---

## 🔮 Roadmap

<div align="center">

**CURRENT** `██████████████████░░` **BUILDING**

</div>

- [x] 🎨 Core frontend structure
- [x] 🔐 Authentication foundation
- [x] 🔌 API structure
- [ ] 🧠 Complete AI/RAG integration
- [ ] 📚 Multi-document conversations
- [ ] 📊 Advanced document analytics
- [ ] 🌍 Multilingual Q&A
- [ ] 👥 Shared document workspaces

---

## 🌟 Project Status

<div align="center">

<img src="https://img.shields.io/badge/Frontend-Active-ff69b4?style=for-the-badge" alt="Frontend active" />
<img src="https://img.shields.io/badge/Authentication-Implemented-9b5de5?style=for-the-badge" alt="Authentication implemented" />
<img src="https://img.shields.io/badge/API-In%20Progress-00c6ff?style=for-the-badge" alt="API in progress" />
<img src="https://img.shields.io/badge/AI%2FRAG-In%20Progress-f72585?style=for-the-badge" alt="AI RAG in progress" />

<br/><br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=17&duration=2500&pause=700&color=9B5DE5&center=true&vCenter=true&width=720&lines=Building+%F0%9F%92%BB+%E2%80%A2+Learning+%F0%9F%A7%A0+%E2%80%A2+Improving+%E2%9C%A8;One+feature+at+a+time+%F0%9F%9A%80" alt="Animated project status" />

</div>

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌱 Create a feature branch
3. 💻 Commit your changes
4. 🚀 Open a pull request

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=19&duration=2800&pause=800&color=FF6EC7&center=true&vCenter=true&width=700&lines=Made+with+curiosity+%E2%9C%A8;Built+to+make+documents+smarter+%F0%9F%A7%A0;Upload.+Ask.+Understand.+%F0%9F%92%AC" alt="Animated closing message" />

<br/><br/>

<a href="https://github.com/mishtee-khanna/intellidocs-ai">⭐ Star IntelliDocs AI</a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,35:9b5de5,70:f72585,100:ff6ec7&height=150&section=footer&animation=fadeIn" width="100%" alt="Animated footer" />

</div>
