<div align="center">
</div>

# Expecta

**AI-powered pregnancy and nursing safety scanner** that cross-references product ingredients against clinical safety databases instantly — helping expecting and nursing parents make informed decisions about skincare, cosmetics, and personal care products.

🌐 **Live app:** [https://expecta.onrender.com](https://expecta.onrender.com)

> Note: hosted on a free tier instance — the app may take up to ~50 seconds to wake up if it hasn't been visited recently.

## Features

- 🔍 Scan or enter a product's ingredient list for instant analysis
- 🛡️ Get a clear **SAFE / CAUTION / AVOID** verdict for both pregnancy and breastfeeding
- 🧪 Ingredient-by-ingredient breakdown with safer alternatives suggested
- 📊 Overall safety score and plain-language reasoning summary
- 📷 Camera-based scanning support

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- **Backend:** Express (Node.js), TypeScript
- **AI:** Google Gemini API (`@google/genai`)
- **Deployment:** [Render](https://render.com) (free tier, config in `render.yaml`)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`:
   ```
   cp .env.example .env
   ```
3. Run the app in development mode:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Build & Run in Production

```
npm run build
npm start
```

## Deployment

This project deploys to [Render](https://render.com) using the included `render.yaml` Blueprint:

1. Push your changes to the `main` branch on GitHub
2. In the Render dashboard, trigger a **Manual Sync** on the Blueprint (or it deploys automatically on push, depending on your settings)
3. Set the `GEMINI_API_KEY` environment variable in the Render dashboard under your service's **Environment** tab

A Railway configuration (`railway.json`) is also included as an alternative deployment option.

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key — get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

## License

This project is private and not licensed for public redistribution.
