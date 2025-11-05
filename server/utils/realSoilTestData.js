// Real soil samples from different agricultural scenarios
const realSoilTestSamples = [
  // Scenario 1: Healthy Wheat Field
  {
    farm: "wheat_field_1", // Use an actual farm ID from your database
    pH: 6.8,
    nitrogen: 65,
    phosphorus: 42,
    potassium: 75,
    moisture: 48,
    organicMatter: 3.2,
    temperature: 18.5,
    notes: "Healthy wheat field - optimal growing conditions",
    readingDate: new Date().toISOString().split('T')[0]
  },
  
  // Scenario 2: Acidic Soil - Needs Lime
  {
    farm: "corn_field_1",
    pH: 5.2, // Too acidic for most crops
    nitrogen: 25, // Low nitrogen
    phosphorus: 18,
    potassium: 45,
    moisture: 52,
    organicMatter: 2.1,
    temperature: 22.0,
    notes: "Soil testing acidic, yellowing leaves observed",
    readingDate: new Date().toISOString().split('T')[0]
  },
  
  // Scenario 3: High pH - Alkaline Soil
  {
    farm: "vegetable_garden_1",
    pH: 8.1, // Too alkaline
    nitrogen: 85,
    phosphorus: 55,
    potassium: 90,
    moisture: 35, // Low moisture
    organicMatter: 1.8,
    temperature: 25.5,
    notes: "Alkaline soil with low organic matter",
    readingDate: new Date().toISOString().split('T')[0]
  },
  
  // Scenario 4: Nutrient Deficient
  {
    farm: "rice_paddy_1",
    pH: 6.3,
    nitrogen: 15, // Very low
    phosphorus: 12, // Very low
    potassium: 25, // Very low
    moisture: 68,
    organicMatter: 2.5,
    temperature: 26.0,
    notes: "Multiple nutrient deficiencies - poor plant growth",
    readingDate: new Date().toISOString().split('T')[0]
  },
  
  // Scenario 5: Optimal Vegetable Garden
  {
    farm: "vegetable_garden_2",
    pH: 6.7,
    nitrogen: 55,
    phosphorus: 48,
    potassium: 72,
    moisture: 52,
    organicMatter: 4.2,
    temperature: 20.5,
    notes: "Excellent soil health - high yields expected",
    readingDate: new Date().toISOString().split('T')[0]
  }
];

module.exports = realSoilTestSamples;