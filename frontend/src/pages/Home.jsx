import React from "react";
import { Link } from "react-router-dom"; 


const cardsData = [
  { 
    id: 1, 
    title: "Workshop 1", 
    description: "Learn AI basics", 
    image: "https://placeholder.com/300x200.png?text=AI+Basics" 
  },
  { 
    id: 2, 
    title: "Workshop 2", 
    description: "React for beginners", 
    image: "https://placeholder.com/300x200.png?text=React" 
  },
  { 
    id: 3, 
    title: "Workshop 3", 
    description: "Node.js crash course", 
    image: "https://placeholder.com/300x200.png?text=Node.js" 
  },
  { 
    id: 4, 
    title: "Workshop 4", 
    description: "Cybersecurity intro", 
    image: "https://placeholder.com/300x200.png?text=Cybersecurity" 
  },
];


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-black">
      <div className="container mx-auto p-8">
        <header className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to the AI Workshop
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore the future of technology with our hands-on workshops led by
            industry experts.
          </p>
        </header>

        <h2 className="text-xl font-bold mb-4 text-slate-700">
          Upcoming Workshops
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col"
          >
            <img src={card.image} alt={card.title} className="w-full h-40 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-slate-600 mb-4 flex-grow">{card.description}</p>
              <Link
                to={`/register?workshop=${encodeURIComponent(card.description)}`}
                className="mt-auto self-start inline-block px-5 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
