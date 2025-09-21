import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWorkshops(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading workshops...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

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
          {workshops.length > 0 ? (
            workshops.map((workshop) => (
              <div
                key={workshop._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col"
              >
                {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-40 object-cover" />}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2">{workshop.title}</h3>
                  <p className="text-slate-600 mb-4 flex-grow">{workshop.description}</p>
                  <p className="text-sm text-slate-500 mb-4">Date: {workshop.date}</p>
                  <Link
                    to={`/register/${workshop._id}`}
                    className="mt-auto self-start inline-block px-5 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-slate-600">No workshops available yet. Check back later!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;