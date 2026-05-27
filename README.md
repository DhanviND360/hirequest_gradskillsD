# ⚔️ HireQuest — Cinematic Video-First Hiring Platform

> *Your Career. Your Quest. Your Legacy.*

**HireQuest** is a cinematic, highly gamified, video-first hiring platform designed for the modern web. Built for the **Gradskills Hackathon**, it transforms the tedious, paper-based recruitment pipeline into an immersive, RPG-themed adventure where job seekers level up their careers as **Players** and recruiters build elite teams as **Guild Masters**.

---

## 📽️ Video-First Philosophy

In a world filled with generic, flat resumes, **HireQuest** places human expression at the center of the matching process.

### 🎙️ The "Battle Cry" (Video Resume)
Candidates do not just apply with text; they record and upload a **1-Minute Battle Cry**—a condensed, high-energy video pitch. 
* **Face & Voice Telemetry:** Recruiters inspect the candidate's battle cry alongside a comprehensive, **6-axis AI behavioral breakdown** grading their confidence, articulation, enthusiasm, and posture.
* **Instant Transcripts:** AI-generated transcripts make scrubbing, searching, and reviewing candidates instantaneous.

### 🏟️ The "Boss Arena" (Live Interview)
Guild Masters can challenge top players to a live, full-screen **Boss Arena** interview session:
* **Interactive HUD Layout:** Features a gaming-themed grid showing active recruiter camera streams side-by-side with candidates.
* **Live Telemetry Streams:** Displays a live-updating score ring showing cognitive focus, grammar metrics, and body language alignment in real time.
* **Party Chat:** In-game party chat allows interviewers to converse and share strategy details during active calls.

---

## 🎮 The Gamification Mechanics

HireQuest maps professional recruitment workflows directly onto RPG concepts, turning anxiety into engagement:

| Real-World Hiring Concept | Gamified RPG Equivalent | Mechanic |
| :--- | :--- | :--- |
| **Job Posting** | 📜 Quest Scroll | Placed on the interactive **World Job Map** with coordinates and scaling challenges. |
| **Required Skills** | ⚔️ Equipped Weapons | Candidates build their attribute sheet (Strength, Agility, Intellect) by listing verified skills. |
| **Applying for a Job** | 🛡️ Signing the Guild Ledger | Initiates the questline and prompts candidates to prepare their Battle Cry. |
| **The Interview** | 💀 Boss Fight | A live, AI-telemetry-monitored challenge inside the Boss Arena. |
| **Progressing to Next Round** | 📈 Leveling Up | Candidates earn XP, climb global leaderboards, and unlock profile rewards. |
| **Accepting an Offer** | 🏆 Quest Complete | The candidate officially joins the Guild (Hired!). |

---

## ⚙️ Key Features

### ⚔️ For Job Seekers (Players)
* **Interactive World Map:** A gorgeous 3D Globe displaying active job openings as coordinates and glowing pins.
* **Scroll of Knowledge:** A parsed PDF resume scanner that automatically calculates your base character class and attributes.
* **Skill Trees:** Ascend your expertise (Frontend Strength, DevOps Agility, AI Wisdom) with progressive level locks.
* **Inventory & Badges:** Equipped item slots representing certifications and unlocked fantasy achievements.
* **Party Messaging:** Dynamic real-time party chats with active Recruiters and Guilds.

### 🏰 For Employers (Guild Masters)
* **Guild Hall Dashboard:** Central hub tracking active quests, active applicants, and hired coordinators.
* **Candidate Scout Directory:** High-fidelity directory card layouts featuring AI observations, trait scans, and direct links to candidate video cries.
* **Quest Drafting scroll:** RPG-themed job draft form complete with loading indicators ("Forging Quest Scroll...") and premium detailed stats confirmation modals.
* **Kanban Pipeline:** An outline-vector-based drag-and-drop pipeline representing the quest state (Quest Sign, Screening, Boss Arena, Quest Complete).

---

## 💻 Technology Stack

* **Frontend:** [Next.js 16 (App Router)](https://nextjs.org/) utilizing React Server Components & Turbopack.
* **Database & Auth:** [Supabase](https://supabase.com/) (SSR Client integration, OAuth callbacks, and secure storage).
* **AI Telemetry:** Google Gemini API / OpenRouter for resume parsing and real-time behavioral insights.
* **Styling:** Custom Vanilla CSS for flexible responsive glassmorphism sheets and micro-animations.
* **Interactive Visuals:** Leaflet Maps for geographic coordinates and canvas particle systems.

---

## 🛠️ Local Development Setup

Follow these steps to run the realm coordinates on your local computer:

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/hirequest.git
cd hirequest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file inside the root directory and define the following variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key

# Google Gemini / AI Configuration
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Dev Realm
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to enter the gate!

---

## 🚀 Cloud Deployment (Vercel)

The easiest way to publish HireQuest live for free:

1. Push your local repository to a **private** or **public** GitHub repository.
2. Sign up or log into **[Vercel](https://vercel.com/)** using GitHub.
3. Import your project repo and add all keys from your `.env.local` inside the Vercel **Environment Variables** tab.
4. Click **Deploy**. Vercel will bundle and launch your app globally!
5. *Important:* Update your **Supabase Dashboard** ➡️ **URL Configuration** with your new live Vercel URL to secure OAuth and email callback routing.

---

## 🏅 Hackathon Project Credit

Crafted with ♥ by **Dhanvi** for the **Gradskills Hackathon**. 

*Defeat the monsters. Master the interview. Level up your career!*
