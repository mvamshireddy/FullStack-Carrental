import React, { useState } from "react";
import "./Vehicles.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";

const Vehicles = () => {
  const allVehicles = [
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

  const [filteredCategory, setFilteredCategory] = useState("All Vehicles");

  const filteredVehicles =
    filteredCategory === "All Vehicles"
      ? allVehicles
      : allVehicles.filter((vehicle) => vehicle.category === filteredCategory);

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
          {["All Vehicles", "Luxury Sedans", "Premium SUVs", "Luxury Vans", "Ultra Luxury"].map(
            (category) => (
              <button
                key={category}
                className={`filter-button ${
                  filteredCategory === category ? "active" : ""
                }`}
                onClick={() => setFilteredCategory(category)}
              >
                {category}
              </button>
            )
          )}
        </div>
        <div className="vehicles-list">
          {filteredVehicles.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Vehicles;