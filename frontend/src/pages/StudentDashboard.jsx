import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || "user";
  const [workshops, setWorkshops] = useState([]);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops`);
      const data = await response.json();
      if (response.ok) {
        setWorkshops(data);
      } else {
        console.error("Failed to fetch workshops:", data.message);
      }
    } catch (error) {
      console.error("Error fetching workshops:", error);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleWorkshopRegistration = async (workshopId) => {
    console.log("StudentDashboard: User object before registration check:", user);
    if (!user?.email) {
      alert("You must be logged in to register for a workshop.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentEmail: user.email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchWorkshops(); // Re-fetch workshops to update registration status
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error registering for workshop:", error);
      alert("You are registred for this Workshop.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 text-neutral-800">
      <div className="container mx-auto p-8">
        {/* Header Section */}
        <header className="md:flex md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Welcome, {userName}!
            </h1>
            <p className="text-neutral-600 mt-2 text-lg">
              Let's continue your learning journey.
            </p>
          </div>
        </header>

        {/* Available Workshops Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-neutral-800">
            Available Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.length > 0 ? (
              workshops.map((workshop) => (
                <div key={workshop._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group">
                  {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-48 object-cover" />}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-2 text-neutral-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                    <p className="text-neutral-600 mb-4 flex-grow">{workshop.description}</p>
                    <p className="text-sm text-neutral-500 mb-6">Date: {workshop.date}</p>
                    <button
                      onClick={() => handleWorkshopRegistration(workshop._id)}
                      disabled={workshop.registrations?.includes(user?.email)}
                      className={`mt-auto self-start inline-block px-6 py-3 font-semibold rounded-lg transition-colors ${
                        workshop.registrations?.includes(user?.email)
                          ? "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-opacity-90"
                      }`}
                    >
                      {workshop.registrations?.includes(user?.email)
                        ? "Registered"
                        : "Register Now"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-lg text-neutral-600">No workshops available yet. Check back later!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}