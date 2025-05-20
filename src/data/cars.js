// src/data/cars.js
export const allCars = [
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

export const getFeaturedCars = () => {
  // Return first 3 cars for homepage
  return allCars.slice(0, 3);
};