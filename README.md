🌱 SoilIQ – Smart Soil Monitoring for a Greener Planet

“Empowering farmers with real-time soil insights to boost yield, reduce waste, and protect the environment.”

SoilIQ is a full-stack web application designed to help farmers monitor soil conditions, analyze soil health, and get actionable AI-driven recommendations. It aims to promote sustainable farming practices, reduce overuse of fertilizers, and contribute to a greener planet.

🌟 Features

Monitor Soil Data: Record soil pH, nitrogen, phosphorus, potassium, organic matter, moisture, and texture.

Weather Integration: Fetch live weather data to contextualize soil readings.

AI Insights & Recommendations: Get automated suggestions to optimize soil health.

Dashboard: Visualize total readings, average soil parameters, and last reading details.

User-Specific Data: Track multiple farms/users with personalized soil analytics.

🛠 Tech Stack

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB Atlas

Other Tools: Axios, dotenv

🚀 Getting Started
1. Clone the repository
git clone https://github.com/Charley-sys/SoilIQ.git
cd SoilIQ

2. Setup Backend
cd server
npm install


Create a .env file in server/:

MONGODB_URI=<your_mongodb_connection_string>
PORT=5000


Start the server:

npm run dev

3. Setup Frontend
cd client/client
npm install
npm start


Frontend runs at http://localhost:3000

4. Seed Sample Data (Optional)
cd server
node seed.js

🌍 Deployment

Live App: [Paste your deployment link here]

Build frontend:

cd client/client
npm run build


Serve frontend via backend:

// server.js
const path = require("path");
app.use(express.static(path.join(__dirname, "../client/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/client/build", "index.html"));
});


Deploy to Render, Vercel, Heroku, or any Node.js supported platform.

🖥 Usage

Open the dashboard at the live link or localhost.

View Total Readings, Average pH, Nitrogen, Moisture, and AI Insights.

Add new soil readings via POST requests (or frontend form if implemented).

🌍 Environmental Impact

Reduce over-fertilization and chemical runoff.

Improve crop yield through data-driven decisions.

Promote sustainable soil management for a greener planet.

📂 Project Structure
SoilIQ/
├─ client/client/          
│  ├─ src/
│  └─ public/
├─ server/                 
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ utils/
│  └─ server.js
├─ .gitignore
└─ README.md

🙌 Contribution

Fork and improve:

User authentication

Advanced AI insights

Multi-farm support

📜 License

MIT License