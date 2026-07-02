# 🚀 CodeRoast AI

CodeRoast AI is an AI-powered code review platform that analyzes JavaScript and TypeScript code using Google's Gemini AI. It detects bugs, security vulnerabilities, performance issues, code smells, complexity, and best-practice violations while generating optimized code with detailed explanations.

---

## ✨ Features

- 🤖 AI-powered code analysis using Gemini AI
- 🐞 Bug detection with detailed explanations
- 🔒 Security vulnerability detection
- ⚡ Time & Space Complexity analysis
- 📊 Overall Code Quality Score
- 📈 Score breakdown (Security, Performance, Readability, Maintainability, Reliability)
- 📝 AI-generated summary
- 💡 Optimized code generation
- 🎯 Suggested fixes and best practices
- 🌙 Modern responsive dark UI
- 🚀 Built with Next.js 15 and TypeScript
- ☁️ Ready for Vercel deployment

---

## 🖥️ Demo

### Landing Page
- Modern SaaS-style landing page
- Clean code editor preview
- Direct "Analyze Code" workflow

### Code Analyzer
- Paste JavaScript/TypeScript code
- Analyze using Gemini AI
- Loading animations
- Automatic redirect to Results page

### Results Dashboard
- Roast Score
- AI Summary
- Performance Analysis
- Bug Detection
- Security Analysis
- Code Smells
- Best Practices
- Suggested Fixes
- Optimized Code

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- Next.js API Routes
- Gemini AI API
- Prisma
- Zod

### Deployment
- Vercel

---

## 📂 Project Structure

```
src/
 ├── app/
 ├── components/
 ├── lib/
 ├── services/
 ├── types/
 └── utils/

prisma/

public/
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/CodeRoastAI.git
```

Move into the project

```bash
cd CodeRoastAI
```

Install dependencies

```bash
npm install
```

Create your environment file

```bash
cp .env.example .env.local
```

Add your Gemini API Key

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run locally

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## 🚀 Build

```bash
npm run build
```

Start production

```bash
npm start
```

---

## 🌍 Deploy on Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add the required environment variables.
4. Deploy.

---

## 📌 Environment Variables

```env
GEMINI_API_KEY=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

> Only add the variables your project actually uses.

---

## 🎯 Future Improvements

- User authentication
- Analysis history
- PDF report export
- Multi-language support
- Repository analysis
- Pull Request reviews
- AI chat for code improvements
- Team dashboard
- Saved reports

---

## 📸 Screenshots

Add screenshots of:

- Landing Page
- Analyze Page
- Results Dashboard
- Optimized Code
- Mobile View

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome.

Fork the repository and submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Varun Arora**

Built with ❤️ using Next.js, TypeScript, and Gemini AI.
