# PesaSwift - Kenyan Digital Credit Provider App

A high-performance, mobile-first Digital Credit Provider (DCP) application optimized for the Kenyan market. Built with React and designed for deployment on Vercel.

## 🚀 Deployment on Vercel

### 1. Prerequisites
- A Vercel Account
- A Google Gemini API Key (for the AI financial advisor features)

### 2. Setup Steps

1.  **Clone or Download** this repository.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Local Development**:
    Create a `.env` file in the root directory:
    ```
    API_KEY=your_gemini_api_key_here
    ```
    Then run:
    ```bash
    npm run dev
    ```

### 3. Deploying to Vercel

1.  **Push to Git**: Push this code to a GitHub, GitLab, or Bitbucket repository.
2.  **Import Project**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Import the repository you just created.
3.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect "Vite". If not, select it.
    - **Root Directory**: `./` (default)
    - **Build Command**: `npm run build` (default)
    - **Output Directory**: `dist` (default)
4.  **Environment Variables**:
    - Expand the **"Environment Variables"** section.
    - Add a new variable:
        - **Key**: `API_KEY`
        - **Value**: `Your Actual Google Gemini API Key`
5.  **Deploy**: Click **"Deploy"**.

## 🏗 Architecture

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router (HashRouter for easy static hosting)
- **AI Integration**: Google Gemini API via `@google/genai` SDK
- **Charts**: Recharts

## 🔒 Security & Compliance

- **Environment Variables**: API keys are injected at build time via Vercel secrets.
- **Headers**: Configured in `vercel.json` for XSS protection and content security.
- **Data**: No PII is persisted in this demo version; all state is local.

## 📝 License

This project is a prototype for educational and demonstration purposes.
