
<div align="center">
  <img src="https://github.com/Charley-sys/SoilIQ/blob/main/3409716-removebg-preview.png" alt="SoilIQ Logo" width="80" style="margin-bottom: 10px;"/>
  <br/>
  <span style="font-size:24px;"><strong>SoilIQ</strong> — Smart Soil Analysis Platform</span>
</div>


## 📖 **Overview**

SoilIQ is a full-stack MERN application built to empower farmers and agricultural professionals with intelligent soil analysis, real-time monitoring, and AI-powered insights.  
The platform merges modern web technologies with agricultural science to deliver accurate soil health data and predictive recommendations.


## 🚀 **Live Deployments**
 **Frontend:** https://client-omega-weld.vercel.app  
 **Backend API:** https://soiliq-server.onrender.com  
 **GitHub Repository:** https://github.com/Charley-sys/SoilIQ  

### 🔐 **Demo Credentials**
 **Email:** simple@soiliq.com  
 **Password:** 123456  



## ✨ **Key Features**

### 🔐 Authentication & User Management
 Secure registration & login  
 JWT authentication  
 User profile management  
 Session persistence  

### 🌿 Soil Analysis & Monitoring
 Real-time NPK, pH, moisture, temperature, geo-location  
 AI-powered insights  
 Historical soil data tracking  
 Predictive analytics for crop optimization  



## 📊 **Dashboard & Visualization**
 Interactive charts  
 Real-time metrics  
 Trend comparison  
 Mobile-responsive design  

## 🎯 Key Challenges & Solutions
Case Sensitivity
✔ Standardized filenames

CORS Issues
✔ Configured allowed origins

Environment Differences
✔ Dev vs Production .env files

MongoDB Atlas
✔ Fixed connection string and errors

## 📈 Performance Features
Optimized Vite builds

RESTful API

Mobile-first UI

Secure authentication

Real-time soil readings

## 🌟 Future Enhancements
Mobile app

IoT integration

Advanced ML models

Multi-language

Offline mode

PDF/Excel exports

Farmer community

## 👥 Target Users
Farmers

Consultants

Researchers

Institutions



## 🛠 **Technology Stack**

### **Frontend**
 React 18, Vite, JSX, CSS3, Context API  

### **Backend**
 Node.js, Express.js, MongoDB, Mongoose, JWT, CORS  



## 🏗 **Project Architecture**

SoilIQ/
├── client/

│ ├── src/

│ │ ├── components/

│ │ ├── pages/

│ │ ├── context/

│ │ ├── services/

│ │ └── utils/

│ ├── public/

│ └── package.json
│
├── server/

│ ├── config/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ └── server.js
│
└── README.md

markdown
Copy code



## 📋 **API Endpoints**

### **Authentication**
 POST `/api/auth/register`
 POST `/api/auth/login`
 GET `/api/auth/me`
 GET `/api/auth/logout`

### **Soil Management**
 POST `/api/soil/readings`
 GET `/api/soil/readings`
 GET `/api/soil/analysis`
 GET `/api/soil/stats`

### **System**
 GET `/api/health`
 GET `/api/debug`



## 🚀 **Installation & Local Development**

### **Prerequisites**
 Node.js 16+  
 MongoDB  
 Git  

### **Frontend Setup**

```bash
cd client
npm install
npm run dev
Backend Setup
bash
Copy code
cd server
npm install
npm start
Environment Variables
Client .env
env
Copy code
VITE_API_URL=http://localhost:3000
Server .env
env
Copy code
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

🤝 Contributing
Fork repo

Create feature branch

Commit changes

Push branch

Open PR

📄 License
MIT License

📞 Support
 For assistance: charlesotienoomondi@gmail.com


                                        Built with ❤️ for sustainable agriculture

