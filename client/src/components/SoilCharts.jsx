// client/src/components/SoilCharts.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SoilCharts = ({ soilReadings }) => {
  if (!soilReadings || soilReadings.length < 2) {
    return (
      <div className="charts-section">
        <h2>📊 Soil Analytics</h2>
        <div className="no-chart-data">
          <p>Add at least 2 soil readings to see trend charts</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const dates = soilReadings.map(reading => {
    const date = new Date(reading.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }).reverse();

  const pHData = soilReadings.map(reading => reading.pH).reverse();
  const nitrogenData = soilReadings.map(reading => reading.nitrogen).reverse();
  const phosphorusData = soilReadings.map(reading => reading.phosphorus).reverse();
  const potassiumData = soilReadings.map(reading => reading.potassium).reverse();

  // Line Chart Options - Soil Trends
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Soil Nutrient Trends Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Level (ppm/pH)'
        }
      },
    },
  };

  const lineData = {
    labels: dates,
    datasets: [
      {
        label: 'pH Level',
        data: pHData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Nitrogen (N)',
        data: nitrogenData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Phosphorus (P)',
        data: phosphorusData,
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Potassium (K)',
        data: potassiumData,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3,
      },
    ],
  };

  // Bar Chart - Current Nutrient Levels
  const latestReading = soilReadings[0];
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Soil Nutrient Levels',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Parts Per Million (ppm)'
        }
      },
    },
  };

  const barData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [
      {
        label: 'Current Levels',
        data: [latestReading.nitrogen, latestReading.phosphorus, latestReading.potassium],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      },
      {
        label: 'Optimal Range (Min)',
        data: [40, 30, 30],
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        type: 'line',
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  // Doughnut Chart - Nutrient Balance
  const totalNutrients = latestReading.nitrogen + latestReading.phosphorus + latestReading.potassium;
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nutrient Balance Ratio',
      },
    },
  };

  const doughnutData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [
      {
        label: 'Nutrient Distribution',
        data: [
          (latestReading.nitrogen / totalNutrients) * 100,
          (latestReading.phosphorus / totalNutrients) * 100,
          (latestReading.potassium / totalNutrients) * 100,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // pH Status Gauge-like display
  const pHOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'pH Level Analysis',
      },
    },
    scales: {
      x: {
        min: 0,
        max: 14,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const pHBarData = {
    labels: ['pH Scale'],
    datasets: [
      {
        label: 'Current pH',
        data: [latestReading.pH],
        backgroundColor: (context) => {
          const pH = context.dataset.data[0];
          if (pH < 5.5) return 'rgba(220, 53, 69, 0.8)'; // Red - acidic
          if (pH < 6.0) return 'rgba(255, 193, 7, 0.8)'; // Yellow - slightly acidic
          if (pH <= 7.0) return 'rgba(40, 167, 69, 0.8)'; // Green - optimal
          if (pH <= 7.5) return 'rgba(255, 193, 7, 0.8)'; // Yellow - slightly alkaline
          return 'rgba(220, 53, 69, 0.8)'; // Red - alkaline
        },
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
      },
      {
        label: 'Optimal Range',
        data: [6.5], // Center of optimal range
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 2,
        type: 'line',
        pointRadius: 0,
      }
    ],
  };

  return (
    <div className="charts-section">
      <h2>📊 Soil Analytics</h2>
      
      <div className="charts-grid">
        {/* Trend Analysis */}
        <div className="chart-card">
          <Line options={lineOptions} data={lineData} />
          <div className="chart-description">
            <h4>Trend Analysis</h4>
            <p>Track how your soil nutrients change over time</p>
          </div>
        </div>

        {/* Current Levels */}
        <div className="chart-card">
          <Bar options={barOptions} data={barData} />
          <div className="chart-description">
            <h4>Nutrient Levels</h4>
            <p>Compare current levels against optimal ranges</p>
          </div>
        </div>

        {/* Nutrient Balance */}
        <div className="chart-card">
          <Doughnut options={doughnutOptions} data={doughnutData} />
          <div className="chart-description">
            <h4>Nutrient Balance</h4>
            <p>Ideal ratio: Balanced N-P-K distribution</p>
          </div>
        </div>

        {/* pH Analysis */}
        <div className="chart-card">
          <Bar options={pHOptions} data={pHBarData} />
          <div className="chart-description">
            <h4>pH Level</h4>
            <p>Optimal range: 6.0-7.0 (green zone)</p>
          </div>
        </div>
      </div>

      {/* Chart Insights */}
      <div className="chart-insights">
        <h3>📈 Chart Insights</h3>
        <div className="insight-points">
          <div className="insight-point">
            <span className="bullet">•</span>
            <span><strong>Trend Lines:</strong> Watch for consistent patterns in nutrient changes</span>
          </div>
          <div className="insight-point">
            <span className="bullet">•</span>
            <span><strong>Optimal Ranges:</strong> Aim for nitrogen (40-60ppm), phosphorus (30+ppm), potassium (30+ppm)</span>
          </div>
          <div className="insight-point">
            <span className="bullet">•</span>
            <span><strong>Balance:</strong> Balanced nutrients prevent deficiencies and excesses</span>
          </div>
          <div className="insight-point">
            <span className="bullet">•</span>
            <span><strong>pH Impact:</strong> Affects nutrient availability to plants</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilCharts;