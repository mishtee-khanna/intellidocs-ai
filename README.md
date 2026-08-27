<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff6ec7,30:f72585,65:9b5de5,100:00c6ff&height=220&section=header&text=IntelliDocs%20AI&fontSize=62&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Turn%20documents%20into%20conversations&descAlignY=61&descSize=20" width="100%" alt="Animated IntelliDocs AI header" />
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=19&duration=2200&pause=600&color=9B5DE5&center=true&vCenter=true&width=820&height=40&lines=Upload+%E2%86%92+Understand+%E2%86%92+Ask+%E2%86%92+Answer;AI-powered+document+intelligence;Semantic+Search+%2B+RAG+%2B+Conversational+AI" alt="Animated project tagline" />
<p><img src="https://img.shields.io/badge/AI_Document_Intelligence-9b5de5?style=for-the-badge" alt="AI Document Intelligence" /> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /> <img src="https://img.shields.io/badge/RAG-ff6ec7?style=for-the-badge" alt="RAG" /></p>
<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,mysql,vercel&perline=7" alt="Technology icons" />
<p><a href="https://github.com/mishtee-khanna/intellidocs-ai/stargazers"><img src="https://img.shields.io/github/stars/mishtee-khanna/intellidocs-ai?style=flat-square&logo=github&color=ff69b4" alt="Stars" /></a> <a href="https://github.com/mishtee-khanna/intellidocs-ai/network/members"><img src="https://img.shields.io/github/forks/mishtee-khanna/intellidocs-ai?style=flat-square&color=9b5de5" alt="Forks" /></a> <a href="https://github.com/mishtee-khanna/intellidocs-ai/issues"><img src="https://img.shields.io/github/issues/mishtee-khanna/intellidocs-ai?style=flat-square&color=00c6ff" alt="Issues" /></a></p>
</div>

---

<div align="center">
<h2>💫 Meet Your Documents Differently</h2>
<img src="https://readme-typing-svg.demolab.com?font=Space+Mono&size=16&duration=1900&pause=500&color=F72585&center=true&vCenter=true&width=720&height=34&lines=No+more+endless+scrolling;No+more+manual+searching;Just+upload%2C+ask%2C+and+understand" alt="Animated value proposition" />
<p><b>IntelliDocs AI</b> transforms PDF, DOCX, PNG and JPG files into an interactive knowledge base where users can ask questions in natural language.</p>
</div>

## 🌸 Core Features
<div align="center">
<table><tr><td align="center">📄 <b>Smart Upload</b><br/>PDF • DOCX • PNG • JPG</td><td align="center">🧠 <b>Semantic Understanding</b><br/>all-MiniLM-L6-v2 embeddings</td><td align="center">💬 <b>Conversational Q&A</b><br/>Natural-language questions</td></tr><tr><td align="center">🔍 <b>RAG Retrieval</b><br/>Relevant document chunks</td><td align="center">🔐 <b>Authentication</b><br/>NextAuth.js sessions</td><td align="center">🗃️ <b>Persistent Knowledge</b><br/>Prisma + MySQL/MariaDB</td></tr></table>
</div>

## 🎞️ How IntelliDocs Thinks
<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=1600&pause=350&color=9B5DE5&center=true&vCenter=true&width=760&height=32&lines=01+READ;02+CHUNK;03+EMBED;04+RETRIEVE;05+ANSWER" alt="Animated RAG steps" />
<p>📤 Upload → 📄 Extract → ✂️ Chunk → 🧠 Embed → 💾 Store → ❓ Ask → 🔎 Retrieve → ✨ Answer</p>
</div>

## 🌈 Application Architecture
<div align="center">
<pre>👩‍💻 USER
   │
   ▼
🎨 FRONTEND ──⚡ API──► ⚙️ BACKEND
Next.js • React • TS       │
Tailwind CSS               ├──► 🗄️ Prisma + MySQL
                           └──► 🧠 LangChain + RAG</pre>
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=2000&pause=500&color=00C6FF&center=true&vCenter=true&width=680&height=32&lines=Frontend+%E2%9A%A1+API+%E2%9A%A1+Database+%E2%9A%A1+AI;Authentication+%E2%9A%A1+Documents+%E2%9A%A1+Chat" alt="Animated architecture" />
</div>

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

## 🔌 API Layer
<div align="center">
<table><tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr><tr><td><code>POST</code></td><td><code>/api/documents/upload</code></td><td>📤 Upload a document</td></tr><tr><td><code>POST</code></td><td><code>/api/documents/process</code></td><td>🔎 Process document + embeddings</td></tr><tr><td><code>POST</code></td><td><code>/api/chat</code></td><td>💬 Document Q&A</td></tr><tr><td><code>GET / POST</code></td><td><code>/api/auth/[...nextauth]</code></td><td>🔐 Authentication</td></tr></table>
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&duration=1700&pause=400&color=FF6EC7&center=true&vCenter=true&width=620&height=30&lines=API+Layer+%E2%86%92+Connecting+the+whole+experience" alt="Animated API message" />
</div>

## 🗂️ Project Structure
```text
intellidocs-ai/
├── prisma/schema.prisma
├── src/app/
│   ├── page.tsx
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── documents/
│   │   ├── chat/
│   │   └── settings/
│   └── api/
│       ├── auth/
│       ├── chat/
│       └── documents/
├── src/components/
└── src/lib/
```

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
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```
Open **http://localhost:3000** ✨

## 💖 Traditional vs IntelliDocs
<div align="center">
<table><tr><th>Traditional</th><th>IntelliDocs AI</th></tr><tr><td>🔍 Search → 📜 Scroll → 👀 Read → 🔁 Repeat</td><td>📤 Upload → 💬 Ask → 🔎 Retrieve → ✨ Understand</td></tr></table>
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=2200&pause=500&color=00C6FF&center=true&vCenter=true&width=700&height=34&lines=From+static+files+to+interactive+knowledge;From+searching+to+conversing;From+pages+to+answers" alt="Animated comparison" />
</div>

## 🔮 Roadmap
<div align="center"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=1800&pause=450&color=9B5DE5&center=true&vCenter=true&width=650&height=32&lines=Frontend+%E2%9C%85;Authentication+%E2%9C%85;APIs+%F0%9F%9A%A7;AI%2FRAG+%F0%9F%A7%A0" alt="Animated roadmap status" /></div>
- [x] 🎨 Core frontend structure
- [x] 🔐 Authentication foundation
- [x] 🔌 API structure
- [ ] 🧠 Complete AI/RAG integration
- [ ] 📚 Multi-document conversations
- [ ] 📊 Advanced document analytics
- [ ] 🌍 Multilingual Q&A
- [ ] 👥 Shared document workspaces

## 🌟 Project Status
<div align="center">
<img src="https://img.shields.io/badge/Frontend-Active-ff69b4?style=for-the-badge" alt="Frontend active" />
<img src="https://img.shields.io/badge/Authentication-Implemented-9b5de5?style=for-the-badge" alt="Authentication implemented" />
<img src="https://img.shields.io/badge/API-In%20Progress-00c6ff?style=for-the-badge" alt="API in progress" />
<img src="https://img.shields.io/badge/AI%2FRAG-In%20Progress-f72585?style=for-the-badge" alt="AI RAG in progress" />
<p><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=2300&pause=600&color=9B5DE5&center=true&vCenter=true&width=620&height=32&lines=Building+%E2%80%A2+Learning+%E2%80%A2+Improving" alt="Animated project status" /></p>
</div>

## 🤝 Contributing
<div align="center"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=1900&pause=450&color=FF6EC7&center=true&vCenter=true&width=600&height=30&lines=Fork+%E2%86%92+Branch+%E2%86%92+Build+%E2%86%92+Pull+Request" alt="Animated contribution flow" /></div>
1. 🍴 Fork the repository
2. 🌱 Create a feature branch
3. 💻 Commit your changes
4. 🚀 Open a pull request

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=17&duration=2600&pause=700&color=FF6EC7&center=true&vCenter=true&width=620&height=34&lines=Made+with+curiosity;Built+to+make+documents+smarter;Upload%2C+Ask%2C+Understand" alt="Animated closing message" />
<p><a href="https://github.com/mishtee-khanna/intellidocs-ai">⭐ Star IntelliDocs AI</a></p>
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,35:9b5de5,70:f72585,100:ff6ec7&height=110&section=footer&animation=fadeIn" width="100%" alt="Animated footer" />
</div>
