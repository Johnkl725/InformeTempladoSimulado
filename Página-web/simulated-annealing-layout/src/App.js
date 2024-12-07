import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LayoutExample from "./LayoutExample";
import PathExample from "./PathExample";
import TSPExample from "./TSPExample";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <header className="w-full bg-white shadow-md p-4 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Ejemplos de Templado Simulado</h1>
        </header>
        <nav className="w-full max-w-4xl flex justify-center mb-6">
          <Link to="/layout" className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Ejemplo de Disposición
          </Link>
          <Link to="/tsp" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Problema del viajante
          </Link>
        </nav>
        <main className="w-full max-w-4xl bg-white shadow-md rounded p-6">
          <Routes>
            <Route path="/layout" element={<LayoutExample />} />
            <Route path="/path" element={<PathExample />} />
            <Route path="/tsp" element={<TSPExample />} />
            <Route path="/" element={<h2 className="text-xl text-center text-gray-700">Choose an example to view</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;