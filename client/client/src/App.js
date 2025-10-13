import React, { useEffect, useState } from "react";
import { getStatistics } from "./services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function App() {
  const [stats, setStats] = useState(null);
  const userId = "user123"; // Make sure this matches your MongoDB document

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getStatistics(userId);
        setStats(data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    }
    fetchData();
  }, [userId]);

  if (!stats) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
        <h1>🌱 SoilIQ Dashboard</h1>
        <p>Loading statistics...</p>
      </div>
    );
  }

  // Color-coded cards based on value thresholds
  const cardStyle = (metric, value) => {
    let bg = "#e0e0e0";
    if (metric === "pH") bg = value >= 6 && value <= 7 ? "#c8e6c9" : "#ffcdd2";
    if (metric === "Nitrogen") bg = value >= 20 ? "#c8e6c9" : "#ffcc80";
    if (metric === "Moisture") bg = value >= 15 ? "#c8e6c9" : "#ffe082";
    return {
      flex: 1,
      background: bg,
      padding: "1rem",
      margin: "0.5rem",
      borderRadius: "12px",
      textAlign: "center",
      transition: "0.3s",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    };
  };

  // Prepare chart data
  const chartData = [
    { name: "pH", value: parseFloat(stats.avgPH) },
    { name: "Nitrogen", value: parseFloat(stats.avgNitrogen) },
    { name: "Moisture", value: parseFloat(stats.avgMoisture) },
  ];

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "1000px", margin: "auto", padding: "2rem" }}>
      {/* Hero Banner */}
      <header style={{
        textAlign: "center",
        padding: "2rem",
        background: "linear-gradient(90deg, #81d4fa, #4fc3f7)",
        borderRadius: "15px",
        color: "#fff",
        marginBottom: "2rem"
      }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>🌱 SoilIQ</h1>
        <p style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>Smart Insights for Better Soil & Crop Health</p>
      </header>

      {/* Metrics Cards */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div style={cardStyle("Total Readings", stats.totalReadings)}>
          <h3>Total Readings</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.totalReadings}</p>
        </div>
        <div style={cardStyle("pH", stats.avgPH)}>
          <h3>Avg pH</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.avgPH}</p>
        </div>
        <div style={cardStyle("Nitrogen", stats.avgNitrogen)}>
          <h3>Avg Nitrogen</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.avgNitrogen}</p>
        </div>
        <div style={cardStyle("Moisture", stats.avgMoisture)}>
          <h3>Avg Moisture</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.avgMoisture}</p>
        </div>
      </div>

      {/* Chart */}
      <section style={{ marginBottom: "2rem", background: "#f1f8e9", padding: "1rem", borderRadius: "12px" }}>
        <h2 style={{ textAlign: "center" }}>📊 Soil Metrics Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4fc3f7" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Last Reading */}
      {stats.lastReading && (
        <section style={{ background: "#fff3e0", padding: "1.5rem", borderRadius: "12px" }}>
          <h2>📌 Last Reading</h2>
          <p><strong>Location:</strong> {stats.lastReading.location.name}</p>
          <p><strong>Soil pH:</strong> {stats.lastReading.soilData.pH}</p>
          <p><strong>Nitrogen:</strong> {stats.lastReading.soilData.nitrogen}</p>
          <p><strong>Moisture:</strong> {stats.lastReading.soilData.moisture}</p>
          <p><strong>AI Insights:</strong> {stats.lastReading.aiInsights}</p>
          <p><strong>Recommendations:</strong> {stats.lastReading.recommendations.join(", ")}</p>
        </section>
      )}
    </div>
  );
}

export default App;
