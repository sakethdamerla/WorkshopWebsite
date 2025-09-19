import React from "react";
import { Link } from "react-router-dom"; 

const cardsData = [
  { id: 1, title: "Workshop 1", description: "Learn AI basics", color: "bg-blue-200" },
  { id: 2, title: "Workshop 2", description: "React for beginners", color: "bg-green-200" },
  { id: 3, title: "Workshop 3", description: "Node.js crash course", color: "bg-yellow-200" },
  { id: 4, title: "Workshop 4", description: "Cybersecurity intro", color: "bg-red-200" },
];

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6"> Welcome to AI Workshop</h1>
      <h1 className="text-3xl font-bold mb-6">Upcoming Workshops</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className={`p-4 rounded-lg shadow-md ${card.color} hover:scale-105 transition-transform`}
          >
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p>{card.description}</p>
            {/* Link to Register page */}
            <Link
              to="/register"
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Register
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
