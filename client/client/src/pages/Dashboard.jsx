import { useEffect, useState } from "react";
import { getStatistics } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalReadings: 0,
    avgPH: 0,
    avgNitrogen: 0,
    avgMoisture: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatistics("user123"); // replace with actual userId
        setStats(data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>🌱 SoilIQ Dashboard</h1>
      <p>Total Readings: {stats.totalReadings}</p>
      <p>Average pH: {stats.avgPH}</p>
      <p>Average Nitrogen: {stats.avgNitrogen}</p>
      <p>Average Moisture: {stats.avgMoisture}</p>
    </div>
  );
}

export default Dashboard;
