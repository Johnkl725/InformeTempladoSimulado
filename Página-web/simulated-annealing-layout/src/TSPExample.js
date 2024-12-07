import React, { useState, useEffect } from "react";

const cities = [
  { name: "City A", x: 100, y: 200 },
  { name: "City B", x: 300, y: 400 },
  { name: "City C", x: 500, y: 100 },
  { name: "City D", x: 700, y: 300 },
  { name: "City E", x: 200, y: 500 },
  { name: "City F", x: 400, y: 200 },
  { name: "City G", x: 600, y: 400 },
  { name: "City H", x: 800, y: 100 },
  { name: "City I", x: 100, y: 600 },
  { name: "City J", x: 300, y: 100 },
];

const calculateDistance = (city1, city2) => {
  return Math.sqrt(Math.pow(city1.x - city2.x, 2) + Math.pow(city1.y - city2.y, 2));
};

const calculateTotalDistance = (path) => {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += calculateDistance(path[i], path[i + 1]);
  }
  totalDistance += calculateDistance(path[path.length - 1], path[0]); // Return to the starting city
  return totalDistance;
};

const generateNeighborPath = (path) => {
  const newPath = [...path];
  const index1 = Math.floor(Math.random() * newPath.length);
  const index2 = (index1 + 1 + Math.floor(Math.random() * (newPath.length - 1))) % newPath.length;
  [newPath[index1], newPath[index2]] = [newPath[index2], newPath[index1]];
  return newPath;
};

const simulatedAnnealingPath = (initialPath, setPath, setDistance) => {
  let T = 1000;
  const T_min = 0.01;
  const alpha = 0.95;

  let currentPath = initialPath;
  let currentDistance = calculateTotalDistance(currentPath);

  let bestPath = currentPath;
  let bestDistance = currentDistance;

  const interval = setInterval(() => {
    if (T <= T_min) {
      clearInterval(interval);
      return;
    }

    for (let i = 0; i < 10; i++) {
      const neighborPath = generateNeighborPath(currentPath);
      const neighborDistance = calculateTotalDistance(neighborPath);

      const delta = neighborDistance - currentDistance;
      if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
        currentPath = neighborPath;
        currentDistance = neighborDistance;

        if (currentDistance < bestDistance) {
          bestPath = currentPath;
          bestDistance = currentDistance;
        }
      }
    }

    setPath(currentPath);
    setDistance(currentDistance);
    T *= alpha;
  }, 500);

  return bestPath;
};

function TSPExample() {
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const initialPath = [...cities];
    simulatedAnnealingPath(initialPath, setPath, setDistance);
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Problema del Viajante de Comercio</h2>
      <p className="text-lg mb-4">Distancia Total: {distance.toFixed(2)} unidades</p>
      <div className="relative w-[800px] h-[600px] border border-gray-300 bg-gray-100">
        {/* Visualización de las ciudades */}
        {path.map((city, index) => (
          <div
            key={index}
            className={`city absolute border border-black rounded-full ${
              index === 0 ? "bg-red-500" : "bg-blue-500"
            } text-white flex items-center justify-center`}
            style={{
              width: 30,
              height: 30,
              left: city.x - 15,
              top: city.y - 15,
            }}
          >
            {city.name}
          </div>
        ))}

        {/* Visualización de las rutas */}
        <svg className="absolute top-0 left-0 w-full h-full">
          {path.map((city, index) => {
            const nextCity = path[(index + 1) % path.length];
            return (
              <line
                key={index}
                x1={city.x}
                y1={city.y}
                x2={nextCity.x}
                y2={nextCity.y}
                stroke={index === 0 ? "red" : "black"}
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default TSPExample;