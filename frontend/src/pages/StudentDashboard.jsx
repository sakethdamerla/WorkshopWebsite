import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Countdown from "../components/Countdown";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || "user";
  const [workshops, setWorkshops] = useState([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [view, setView] = useState("available"); // "available" or "registered"

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

  const fetchRegisteredWorkshops = async () => {
    console.log("fetchRegisteredWorkshops called. User:", user);
    if (!user?.email) {
      console.log("User email not available, skipping fetchRegisteredWorkshops.");
      return;
    }
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/workshops/registered-workshops/${user.email}`;
    console.log("Fetching registered workshops from URL:", url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Response from registered workshops API:", data);
      if (response.ok) {
        setRegisteredWorkshops(data);
      } else {
        console.error("Failed to fetch registered workshops:", data.message);
      }
    } catch (error) {
      console.error("Error fetching registered workshops:", error);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    fetchRegisteredWorkshops();
  }, [user?.email]);

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
        body: JSON.stringify({ studentEmail: user.email, phoneNumber: "000-000-0000" }), // Using a placeholder
      });
      console.log("Registration response.ok:", response.ok);
      const data = await response.json();
      console.log("Registration data.message:", data.message);
      if (response.ok) {
        alert(data.message);
        fetchWorkshops(); // Re-fetch all workshops
        fetchRegisteredWorkshops(); // Re-fetch registered workshops to ensure UI consistency
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error registering for workshop:", error);
      alert("An unexpected error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto p-4 sm:p-8">
        {/* Header Section */}
        <header className="md:flex md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Welcome, {userName}!
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Let's continue your learning journey.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row">
            <button
              onClick={() => setView("available")}
              className={`mr-0 sm:mr-4 mb-2 sm:mb-0 px-5 py-2.5 rounded-lg font-semibold transition-colors ${view === "available" ? "bg-primary text-white shadow-sm" : "bg-white text-gray-700 border hover:bg-gray-100"}`}
            >
              Available Workshops
            </button>
            <button
              onClick={() => setView("registered")}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${view === "registered" ? "bg-primary text-white shadow-sm" : "bg-white text-gray-700 border hover:bg-gray-100"}`}
            >
              My Registered Events
            </button>
          </div>
        </header>

        {/* Available Workshops Section */}
        {view === "available" && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
              Available Workshops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.length > 0 ? (
                workshops.map((workshop) => {
                  const isRegistered = registeredWorkshops.some(rw => rw?._id === workshop._id);
                  return (
                    <div key={workshop._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 flex flex-col">
                      {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-40 object-cover" />}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                        <p className="text-gray-600 mb-4 flex-grow text-sm">{workshop.description.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-500 mb-4">Date: {new Date(workshop.date).toLocaleDateString()}</p>
                        <button onClick={() => handleWorkshopRegistration(workshop._id)} disabled={isRegistered} className={`w-full mt-auto px-4 py-2 text-sm font-semibold rounded-md transition-colors ${isRegistered ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-opacity-90"}`}>
                          {isRegistered ? "Registered" : "Register Now"}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-lg text-gray-500 col-span-full text-center py-10">No workshops available yet. Check back later!</p>
              )}
            </div>
          </section>
        )}

        {/* My Registered Workshops Section */}
        {view === "registered" && (
          <section className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
              My Registered Workshops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {registeredWorkshops.length > 0 ? (
                registeredWorkshops
                  .filter(Boolean)
                  .sort((a, b) => new Date(a.date) - new Date(b.date)).map((workshop) => {
                  const eventDate = new Date(workshop.date);
                  const now = new Date();
                  const isEventStarted = now >= eventDate;

                  return (
                    <div key={workshop._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 flex flex-col">
                      {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-40 object-cover" />}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                        <p className="text-gray-600 mb-4 flex-grow text-sm">{workshop.description.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-500 mb-4">Date: {new Date(workshop.date).toLocaleDateString()}</p>
                        <div className="mt-auto pt-4 border-t border-gray-200">
                          {!isEventStarted ? (
                            <div className="text-center p-2 rounded-md bg-gray-100">
                              <p className="text-sm font-semibold mb-2">Event starts in:</p>
                              <Countdown date={workshop.date} />
                            </div>
                          ) : (
                            <Link to={`/workshop/${workshop._id}/video`} className="w-full block text-center px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-primary text-white hover:bg-opacity-90">
                              Watch Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-lg text-gray-500 col-span-full text-center py-10">You haven't registered for any workshops yet.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
