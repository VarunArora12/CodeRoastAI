# CodeRoast AI

CodeRoast AI is a production-ready Next.js frontend and API foundation for AI-assisted code review. Users paste code, choose a language, and receive structured review feedback from OpenAI.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide React
- OpenAI SDK
- Zod validation

## Routes

- `/` - Dark SaaS landing page
- `/analyze` - Code input, language selection, loading states, and rendered analysis
- `/results` - Static placeholder results view
- `POST /api/analyze` - OpenAI-backed code analysis route handler

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

Optional:

```bash
OPENAI_MODEL=gpt-5.5
```

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Deployment

The app is compatible with Vercel. Configure these environment variables in the Vercel project settings:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` if you want to override the default model

Vercel build command:

```bash
npm run build
```

No database or persistent storage is required.
