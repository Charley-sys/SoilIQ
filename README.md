<div align="center"> <img src="https://github.com/Charley-sys/SoilIQ/blob/main/3409716-removebg-preview.png" alt="SoilIQ Logo" width="80" style="margin-bottom: 10px;"/> <br/> <span style="font-size:40px; font-weight:bold; display:block; margin: 20px 0 30px 0;"> SoilIQ — Smart Soil Analysis Platform </span> <img src="https://github.com/Charley-sys/SoilIQ/blob/main/Neon%20Retro%20Stars%20Marketing%20Mockup%20Website%20Instagram%20Post%20(3).png" alt="SoilIQ Mockup" width="100%" style="margin: 40px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 1200px;"/> </div>

## 📖 Overview

SoilIQ is a full-stack MERN application designed to empower farmers and agricultural professionals with intelligent soil analysis, real-time monitoring, and AI-driven insights.
It leverages modern web technologies and agricultural science to provide accurate soil health data, predictive analytics, and actionable recommendations.

## 🚀 Live Deployments

Frontend: https://soiliqui.vercel.app/

Backend API: https://soiliq-server.onrender.com

GitHub Repository: https://github.com/Charley-sys/SoilIQ

## ✨ Key Features
- Soil Analysis & Monitoring

-Real-time measurements: NPK, pH, moisture, temperature, geo-location

-AI-powered soil insights and recommendations

-Historical soil data tracking

-Predictive analytics for crop optimization

## 📊 Dashboard & Visualization

-Interactive charts and graphs

-Real-time metrics and trends

-Historical comparisons

-Mobile-responsive design

## 🎯 Challenges & Solutions

-Case Sensitivity: Standardized filenames for consistency

-CORS Issues: Configured allowed origins in backend

-Environment Differences: Separate .env files for development and production

-MongoDB Atlas Connectivity: Optimized connection strings and error handling

## 📈 Performance Optimizations

-Optimized React Vite builds

-RESTful API architecture

-Mobile-first responsive design

-Real-time soil data visualization

## 🌟 Future Enhancements

-Mobile application for Android/iOS

-IoT sensor integration

-Advanced AI/ML soil analysis models

-Multi-language support

-Offline mode for remote locations

-Export data to PDF/Excel

-Community platform for farmers

## 👥 Target Users

-Farmers

-Agricultural consultants

-Researchers

-Institutions

## 🛠 Technology Stack
Frontend

-React 18, Vite, JSX, CSS3, Context API

Backend

-Node.js, Express.js, MongoDB, Mongoose, CORS

## 🏗 Project Architecture
SoilIQ/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│   └── package.json
└── README.md

## 📋 API Endpoints
Soil Management

POST /api/soil/readings — Submit new soil readings

GET /api/soil/readings — Retrieve soil readings history

GET /api/soil/analysis — Get AI-powered soil insights

GET /api/soil/stats — Aggregate soil statistics

System

GET /api/health — API health check

GET /api/debug — Debugging information

## 🚀 Installation & Local Development
Prerequisites

Node.js 16+

MongoDB

Git

Frontend Setup
cd client
npm install
npm run dev

Backend Setup
cd server
npm install
npm start

Environment Variables

Client .env:

VITE_API_URL=http://localhost:3000


Server .env:

NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://charlesotienoomondi_db_user:soiliq_database@cluster0.walfe71.mongodb.net/?soiliq=Cluster0

🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m "Add feature")

Push to the branch (git push origin feature-name)

Open a Pull Request

📄 License

MIT License

📞 Support

For assistance: charlesotienoomondi@gmail.com
                                             Built with ❤️ for sustainable agriculture
