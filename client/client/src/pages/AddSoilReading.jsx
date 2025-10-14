import React, { useState } from "react";
import { addSoilReading } from "../services/api"; // make sure this is added in your api.js

const AddSoilReading = () => {
  const [form, setForm] = useState({
    userId: "user123", // change this if using auth
    locationName: "",
    latitude: "",
    longitude: "",
    pH: "",
    nitrogen: "",
    moisture: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        userId: form.userId,
        location: {
          name: form.locationName,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
        soilData: {
          pH: parseFloat(form.pH),
          nitrogen: parseFloat(form.nitrogen),
          moisture: parseFloat(form.moisture),
        },
      };

      const response = await addSoilReading(payload);
      setMessage(`✅ New soil reading added successfully for ${response.location?.name}`);
      setForm({
        userId: "user123",
        locationName: "",
        latitude: "",
        longitude: "",
        pH: "",
        nitrogen: "",
        moisture: "",
      });
    } catch (err) {
      console.error("❌ Error adding reading:", err);
      setMessage("❌ Failed to add soil reading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>➕ Add Soil Reading</h1>

      {message && (
        <div
          style={{
            background: message.startsWith("✅") ? "#c8e6c9" : "#ffcdd2",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <input
          type="text"
          name="locationName"
          placeholder="Location Name"
          value={form.locationName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="any"
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="any"
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="any"
          name="pH"
          placeholder="Soil pH"
          value={form.pH}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="any"
          name="nitrogen"
          placeholder="Nitrogen (mg/kg)"
          value={form.nitrogen}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="any"
          name="moisture"
          placeholder="Moisture (%)"
          value={form.moisture}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#4fc3f7",
            color: "white",
            border: "none",
            padding: "0.8rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {loading ? "Submitting..." : "Add Reading"}
        </button>
      </form>
    </div>
  );
};

export default AddSoilReading;
