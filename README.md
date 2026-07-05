<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This repository contains everything you need to run the app locally and a GitHub Actions workflow to publish the frontend to GitHub Pages.

Live demo (GitHub Pages): https://sandeep99-beep.github.io/Manohar-pattern-AI

> Note: The frontend is deployed to GitHub Pages. The server (backend) that calls the Gemini API is defined in server.ts and must be deployed separately (e.g., Cloud Run) and provided with GEMINI_API_KEY. Do NOT put GEMINI_API_KEY in client-side code.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Deploy frontend to GitHub Pages

A GitHub Actions workflow (.github/workflows/deploy-pages.yml) is included. On push to main the workflow will run `npm run build` and publish the `./dist` output to the `gh-pages` branch which GitHub Pages serves.

## Notes

- Do NOT commit your GEMINI_API_KEY. Use environment variables or a secrets manager when deploying the backend.
- If you want me to also add backend deployment (Cloud Run) and CORS config so the Pages site can call your API, tell me and I will add a Cloud Run deploy workflow and server tweaks.
