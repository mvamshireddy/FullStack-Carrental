import React, { useState, useEffect } from "react";
import "./Vehicles.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const staticVehicles = [
  {
    id: 1,
    name: "Mercedes S-Class",
    image: "/assests/images/mercedes-s-class.png",
    description: "The pinnacle of luxury sedans, offering unmatched comfort for executive travel.",
    price: 120,
    passengers: 3,
    luggage: 2,
    category: "Luxury Sedans",
  },
  {
    id: 2,
    name: "BMW 7 Series",
    image: "/assests/images/bmw-7-series.png",
    description: "Blend of performance and luxury with spacious interior for business or leisure.",
    price: 110,
    passengers: 3,
    luggage: 2,
    category: "Luxury Sedans",
  },
  {
    id: 3,
    name: "Cadillac Escalade",
    image: "/assests/images/cadillac-escalade.png",
    description: "Spacious luxury SUV perfect for group travel with ample luggage space.",
    price: 150,
    passengers: 6,
    luggage: 4,
    category: "Premium SUVs",
  },
  {
    id: 4,
    name: "Range Rover",
    image: "/assests/images/range-rover.png",
    description: "The epitome of luxury SUVs, combining opulence with off-road capability.",
    price: 140,
    passengers: 4,
    luggage: 3,
    category: "Premium SUVs",
  },
  {
    id: 5,
    name: "Mercedes V-Class",
    image: "/assests/images/mercedes-v-class.png",
    description: "Spacious luxury van for group travel with exceptional comfort.",
    price: 160,
    passengers: 5,
    luggage: 5,
    category: "Luxury Vans",
  },
  {
    id: 6,
    name: "Rolls-Royce Phantom",
    image: "/assests/images/rolls-royce.png",
    description: "The ultimate symbol of prestige and luxury for special occasions.",
    price: 300,
    passengers: 3,
    luggage: 2,
    category: "Ultra Luxury",
  },
];

const Vehicles = () => {
  const navigate = useNavigate();
  const [filteredCategory, setFilteredCategory] = useState("All Vehicles");
  const [backendVehicles, setBackendVehicles] = useState([]);
  const [mergedVehicles, setMergedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cars from backend on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/cars`)
      .then((res) => {
        setBackendVehicles(res.data || []);
      })
      .catch(() => {
        setBackendVehicles([]); // fallback to static only
      })
      .finally(() => setLoading(false));
  }, []);

  // Always merge static and backend cars, avoid duplicates by name
  useEffect(() => {
    const merged = [
      ...staticVehicles,
      ...backendVehicles.filter(
        (bcar) => !staticVehicles.some((scar) => scar.name === bcar.name)
      ),
    ];
    setMergedVehicles(merged);
  }, [backendVehicles]);

  // Dynamically generate categories from all available vehicles
  const categorySet = new Set(mergedVehicles.map(car => car.category));
  const categoryList = ["All Vehicles", ...Array.from(categorySet)];

  const filteredVehicles =
    filteredCategory === "All Vehicles"
      ? mergedVehicles
      : mergedVehicles.filter((vehicle) => vehicle.category === filteredCategory);

  // Handler for booking a car
  const handleBookNow = (car) => {
    localStorage.setItem("selectedCar", JSON.stringify(car));
    navigate("/booknow");
  };

  return (
    <>
      <Navbar />
      <div className="vehicles-page">
        <div className="vehicles-header">
          <h1>Available Cars</h1>
          <p>
            Choose from our range of luxury vehicles, operated by professional chauffeurs.
          </p>
        </div>
        <div className="filter-bar">
          {categoryList.map((category) => (
            <button
              key={category}
              className={`filter-button ${
                filteredCategory === category ? "active" : ""
              }`}
              onClick={() => setFilteredCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="vehicles-list">
          {loading ? (
            <div style={{ padding: 24 }}>Loading cars...</div>
          ) : filteredVehicles.length === 0 ? (
            <div style={{ padding: 24 }}>No cars found.</div>
          ) : (
            filteredVehicles.map((car) => (
              <CarCard
                key={car._id || car.id || car.name}
                car={car}
                onSelect={() => handleBookNow(car)}
                hideBookNowButton={false}
                // Do NOT pass isSelected here!
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Vehicles;