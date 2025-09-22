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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 text-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center my-16">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-neutral-900">
            Welcome to the <span className="text-primary">AI</span> Workshop
          </h1>
          <p className="text-neutral-600 max-w-3xl mx-auto text-lg">
            Explore the future of technology with our hands-on workshops led by
            industry experts. Level up your skills and build amazing things.
          </p>
        </header>

        <h2 className="text-3xl font-bold mb-8 text-neutral-800 text-center">
          Upcoming Workshops
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {workshops.length > 0 ? (
            workshops.map((workshop) => (
              <div
                key={workshop._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col group"
              >
                {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-48 object-cover" />}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-neutral-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                  <p className="text-neutral-600 mb-4 flex-grow">{workshop.description}</p>
                  <p className="text-sm text-neutral-500 mb-6">Date: {workshop.date}</p>
                  <Link
                    to={`/register/${workshop._id}`}
                    className="mt-auto self-start inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-300"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-neutral-600 text-lg">No workshops available yet. Check back later!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;