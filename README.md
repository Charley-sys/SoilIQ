# 🌱 SoilIQ - AI-Powered Soil Analysis Platform

![SoilIQ Dashboard](https://img.shields.io/badge/SoilIQ-AI%20Soil%20Analysis-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)
![Render](https://img.shields.io/badge/Deployment-Render-46b3a0)

## 🚀 Live Demo

- **Frontend**: [https://soiliq.vercel.app](https://soiliq.vercel.app)
- **Backend API**: [https://soiliq-backend.onrender.com](https://soiliq-backend.onrender.com)
- **API Health Check**: [https://soiliq-backend.onrender.com/api/health](https://soiliq-backend.onrender.com/api/health)

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Local Development](#-local-development)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

SoilIQ is a comprehensive web application that empowers farmers with AI-powered soil analysis and actionable insights. Transform your farming decisions with real-time soil health monitoring, predictive analytics, and personalized recommendations.

### 🎯 Problem Statement

Farmers often struggle with:
- Expensive and slow soil testing laboratories
- Lack of actionable insights from soil data
- Difficulty interpreting complex soil science
- Inefficient fertilizer application

### 💡 Our Solution

SoilIQ provides:
- **Instant AI Analysis** of soil nutrients
- **Actionable Recommendations** for improvement
- **Historical Tracking** of soil health
- **Crop Suitability** suggestions
- **Cost Optimization** for fertilizers

## ✨ Features

### 🔬 Smart Soil Analysis
- **AI-Powered Insights**: Intelligent recommendations based on soil nutrient data
- **Health Scoring**: Comprehensive soil health score (0-100) with priority levels
- **Nutrient Balance**: Real-time analysis of N-P-K ratios and pH levels
- **Risk Detection**: Early warning system for soil deficiencies and imbalances

### 📊 Advanced Visualization
- **Interactive Charts**: Trend analysis, nutrient comparisons, and balance ratios
- **Real-time Dashboards**: Live soil health metrics with status indicators
- **Historical Tracking**: Monitor soil changes over time with detailed timelines
- **Comparative Analytics**: Benchmark against optimal growing conditions

### 🌾 Farmer-Centric Tools
- **Crop Recommendations**: AI-suggested crops based on soil conditions
- **Fertilizer Guidance**: Precise fertilizer recommendations and application rates
- **Actionable Insights**: Step-by-step improvement plans for soil health
- **Quick Soil Assessment**: Rapid soil reading input with validation

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Fast development build tool
- **Chart.js** - Interactive data visualization
- **CSS3** - Custom design system with gradients

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for soil data
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication

### AI & Analytics
- **Custom AI Engine** - Soil analysis algorithms
- **Predictive Analytics** - Trend analysis and forecasting
- **Recommendation System** - Crop and fertilizer suggestions

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/soiliq.git
cd soiliq
Setup Backend

bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
Setup Frontend

bash
cd client
npm install
cp .env.example .env
# Edit .env with your backend API URL
npm run dev
Access the application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

📡 API Documentation
Authentication Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	User login
GET	/api/auth/me	Get user profile
Soil Data Endpoints
Method	Endpoint	Description
POST	/api/soil/readings	Add soil reading
GET	/api/soil/readings	Get all soil readings
GET	/api/soil/analysis	Get AI analysis
GET	/api/soil/stats	Get soil statistics
Example API Usage
javascript
// Register user
const response = await fetch('https://soiliq-backend.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Farmer',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123'
  })
});
🌐 Deployment
Frontend (Vercel)
Push code to GitHub

Connect repository to Vercel

Set environment variables

Auto-deploy on push

Backend (Render)
Push code to GitHub

Connect repository to Render

Set environment variables

Auto-deploy on push

Environment Variables
Frontend:

env
VITE_API_BASE_URL=https://soiliq-backend.onrender.com/api
Backend:

env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
NODE_ENV=production
CLIENT_URL=https://soiliq.vercel.app
💻 Local Development
Development Setup
Start MongoDB (local or use Atlas)

Start Backend: cd server && npm run dev

Start Frontend: cd client && npm run dev

Testing
bash
# Test backend API
curl http://localhost:5000/api/health

# Test frontend
open http://localhost:3000
Project Structure
text
soiliq/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── styles/        # CSS styles
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Entry point
└── README.md
🤝 Contributing
We welcome contributions from the agricultural and tech communities!

Areas for Contribution
AI Algorithm Enhancement

New Visualization Types

Mobile App Development

Additional Crop Databases

Localization and Translation

Development Process
Fork the repository

Create a feature branch

Make your changes

Submit a pull request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🌍 Our Mission
SoilIQ exists to democratize soil intelligence and empower farmers worldwide with AI-driven insights for sustainable agriculture and food security.



"Healthy Soil, Healthy Planet, Healthy People"






