# 🥗 VitalPlate - Personalized AI Meal Planner

VitalPlate is a full-stack MERN meal planning app that generates weekly nutrition plans tailored to each user's health conditions, preferences, and goals — powered by Open AI (Groq).

---

## 🚀 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Data API) |
| Authentication | JWT |
| AI Meal Planning | Google Gemini Flash |
| UI Icons & Charts | Lucide-React + Recharts |

---

## ✨ Features

✔ Personalized onboarding (age, weight, dietary preferences, conditions)  
✔ AI-generated 7-day meal plan  
✔ Drag-and-drop planner  
✔ Smart grocery list  
✔ Nutrition insights (macros + calories)  
✔ Recipe search + detailed cooking view  
✔ Secure login / authentication  
✔ Full dark mode theme

---

## 🆕 Recent updates
- Multiple meal plans per user; view & select your active plan from Profile.  
- Replace/swaps: replace any meal slot with another recipe.  
- SMS reminders (Twilio) and Web Push reminders (VAPID).  
- Chat embeddings search for context-aware follow-ups.

---

## 📁 Project Structure

VitalPlate/
├ frontend/
│ ├ src/
│ │ ├ pages/ (Landing, Login, Planner, Dashboard, Recipes…)
│ │ ├ components/
│ │ ├ context/AuthContext.jsx
│ │ └ main.jsx / App.jsx
│ ├ public/
│ └ index.html
├ backend/
│ ├ src/
│ │ ├ config/db.js
│ │ ├ controllers/
│ │ ├ routes/
│ │ ├ middleware/
│ │ └ server.js / app.js
│ └ .env
└ README.md


---

## 🛠 Setup Instructions

### 1️⃣ Clone & Install Dependencies

git clone https://github.com/Kubojah-Dan/VitalPlate_Application.git

cd VitalPlate
cd frontend && npm install
cd ../backend && npm install


---

### 2️⃣ Environment Variables

Create:

📍 `backend/.env`

PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_key
MONGO_DATA_API_KEY=your_mongo_data_api_key
MONGO_DATA_API_URL=https://data.mongodb-api.com/app/<APP_ID>/endpoint/data/v1

# OAuth / Deployment settings
<br/>
CLIENT_URL=https://your-frontend-domain.com     
BACKEND_URL=https://your-backend-domain.com      
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://your-backend-domain.com/api/auth/github/callback


> Do **NOT** commit `.env`

---

### 3️⃣ Run Development Servers

Frontend:
cd frontend
npm run dev

Backend:
cd backend
npm run dev

Frontend: http://localhost:3000  
Backend: http://localhost:5000

---

## 🐳 Docker Support Ready

```bash
docker compose up --build

🔒 Authentication Flow

Frontend stores JWT in secure storage → attaches to API → verifies → dashboard access.

💡 Future Enhancements

Favorites + ratings

Adaptive health goal tracking

Mobile app with Expo

Community recipe sharing

🤝 Contribution

Pull requests welcome! Please open an Issue first.

📜 License

MIT © 2025 VitalPlate

dependencies

node_modules/
package-lock.json

environment variables

.env

build output

dist/
build/
.vite/

logs

npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

OS junk

.DS_Store
Thumbs.db





