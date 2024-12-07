import React, { useState, useEffect } from "react";

const PAGE_WIDTH = 800;
const PAGE_HEIGHT = 600;

const elements = [
  { name: "Header", width: 200, height: 50 },
  { name: "Image", width: 300, height: 200 },
  { name: "Paragraph", width: 400, height: 100 },
];

const calculateEnergy = (layout) => {
  let penalty = 0;
  for (let i = 0; i < layout.length; i++) {
    for (let j = i + 1; j < layout.length; j++) {
      const elemA = layout[i];
      const elemB = layout[j];
      if (
        elemA.x < elemB.x + elemB.width &&
        elemA.x + elemA.width > elemB.x &&
        elemA.y < elemB.y + elemB.height &&
        elemA.y + elemA.height > elemB.y
      ) {
        penalty += 1;
      }
    }
  }
  return penalty;
};

const generateNeighbor = (layout) => {
  const newLayout = [...layout];
  const index = Math.floor(Math.random() * newLayout.length);
  newLayout[index] = {
    ...newLayout[index],
    x: Math.max(
      0,
      Math.min(PAGE_WIDTH - newLayout[index].width, newLayout[index].x + (Math.random() > 0.5 ? 20 : -20))
    ),
    y: Math.max(
      0,
      Math.min(PAGE_HEIGHT - newLayout[index].height, newLayout[index].y + (Math.random() > 0.5 ? 20 : -20))
    ),
  };
  return newLayout;
};

const simulatedAnnealing = (initialLayout, setLayout, onComplete) => {
  let T = 100;
  const T_min = 0.01;
  const alpha = 0.9;

  let currentLayout = initialLayout;
  let currentEnergy = calculateEnergy(currentLayout);

  const interval = setInterval(() => {
    if (T <= T_min) {
      clearInterval(interval);
      onComplete(); // Llamar cuando el algoritmo termine
      return;
    }

    for (let i = 0; i < 100; i++) {
      const neighborLayout = generateNeighbor(currentLayout);
      const neighborEnergy = calculateEnergy(neighborLayout);

      const delta = neighborEnergy - currentEnergy;
      if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
        currentLayout = neighborLayout;
        currentEnergy = neighborEnergy;
      }
    }

    setLayout(currentLayout);
    T *= alpha;
  }, 100);
};

function LayoutExample() {
  const [layout, setLayout] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Inicializa el layout y corre el algoritmo
    const runAlgorithm = () => {
      const initialLayout = elements.map((el) => ({
        ...el,
        x: Math.floor(Math.random() * (PAGE_WIDTH - el.width)),
        y: Math.floor(Math.random() * (PAGE_HEIGHT - el.height)),
      }));

      setLayout(initialLayout);
      simulatedAnnealing(initialLayout, setLayout, runAlgorithm); // Reinicia el algoritmo al completar
    };

    runAlgorithm(); // Llamar al algoritmo por primera vez
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => prevStep + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen justify-center items-center">
      {/* Contenedor centrado */}
      <div className="relative w-[800px] h-[600px] border border-gray-300 bg-gray-50 flex justify-center items-center">
        {layout.map((el, index) => (
          <div
            key={index}
            className="absolute bg-white border border-black text-center text-xs"
            style={{
              width: el.width,
              height: el.height,
              left: el.x,
              top: el.y,
            }}
          >
            {el.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LayoutExample;
