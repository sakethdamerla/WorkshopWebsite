import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [view, setView] = useState("workshops"); // workshops, create
  const [expandedWorkshopId, setExpandedWorkshopId] = useState(null);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops`);
      const data = await response.json();
      console.log("Workshops data received:", data); // Add this line
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
    const interval = setInterval(fetchWorkshops, 5000); // Refetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, image, date }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Workshop created successfully!");
        setTitle("");
        setDescription("");
        setImage("");
        setDate("");
        fetchWorkshops();
        setView("workshops");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating workshop:", error);
      alert("Failed to create workshop.");
    }
  };

  const handleDelete = async (workshopId) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message);
          fetchWorkshops(); // Re-fetch workshops to update the list
        } else {
          // If response is not OK, try to get more details
          const errorText = await response.text();
          console.error(`Error deleting workshop: ${response.status} - ${errorText}`);
          alert(`Failed to delete workshop: ${errorText || response.statusText}`);
        }
      } catch (error) {
        console.error("Network or unexpected error deleting workshop:", error);
        alert("Failed to delete workshop due to a network error or unexpected issue.");
      }
    }
  };

  const toggleRegistrations = (workshopId) => {
    setExpandedWorkshopId(expandedWorkshopId === workshopId ? null : workshopId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 text-neutral-800">
      <div className="container mx-auto p-8">
        <header className="md:flex md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl mb-6 font-bold text-neutral-900">Admin Dashboard</h1>
            {/* <p className="text-neutral-600 mt-2 text-lg">Welcome Admin! Here you can manage students and workshops.</p> */}
          </div>
          <div>
            <button onClick={() => setView("workshops")} className="mr-4 mb-2 sm:mb-0 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold">All Workshops</button>
            <button onClick={() => setView("create")} className="px-4 py-2 sm:px-6 sm:py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold">Create Workshop</button>
          </div>
        </header>

        {view === "create" && (
          <section className="mb-12">
            <h2 className="text-xl -mx-6 font-bold mb-8 text-neutral-800 text-center">Create New Workshop</h2>
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mx-auto max-w-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-neutral-700">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-neutral-700">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    className="w-full p-2 sm:p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-neutral-700">Image URL</label>
                  <input
                    type="url"
                    id="image"
                    className="w-full p-2 sm:p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-neutral-700">Date</label>
                  <input
                    type="date"
                    id="date"
                    className="w-full p-2 sm:p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 sm:py-3 sm:px-6 border border-transparent shadow-sm text-sm sm:text-base font-medium rounded-lg text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Create Workshop
                </button>
              </form>
            </div>
          </section>
        )}

        {view === "workshops" && (
          <section>
            <h2 className="text-2xl font-bold mb-8 text-neutral-800">Manage Workshops</h2>
            <div className="flex flex-wrap gap-8">
              {workshops.length > 0 ? (
                workshops.map((workshop) => (
                  <div key={workshop._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] mb-8">
                    {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-32 object-cover" />}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-1 text-neutral-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                      <p className="text-sm text-neutral-500 mb-2">Date: {new Date(workshop.date).toLocaleDateString()}</p>
                      <p className="text-sm text-neutral-600 mb-4 flex-grow">Registrations: {workshop.registrations ? workshop.registrations.length : 0}</p>
                      <div className="flex flex-row space-x-2">
                        <button
                          onClick={() => toggleRegistrations(workshop._id)}
                          className="w-full px-4 py-2 text-sm bg-blue-300 text-black rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
                        >
                          {expandedWorkshopId === workshop._id ? "Hide Registrations" : "View Registrations"}
                        </button>
                        <button
                          onClick={() => handleDelete(workshop._id)}
                          className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                      {expandedWorkshopId === workshop._id && (
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <h4 className="font-semibold mb-2 text-neutral-800">Registered Users:</h4>
                          {workshop.registrations && workshop.registrations.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-neutral-700">
                              {workshop.registrations.map((email, index) => (
                                <li key={index}>{email}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-neutral-600 text-sm">No registrations for this workshop yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-600 text-lg">No workshops created yet.</p>
              )}
            </div>
          </section>
        )}

        {view === "registeredEvents" && (
          <section>
            <h2 className="text-2xl font-bold mb-8 text-neutral-800">Registered Workshops</h2>
            <div className="flex flex-wrap gap-8">
              {workshops.filter(workshop => workshop.registrations && workshop.registrations.length > 0).length > 0 ? (
                workshops.filter(workshop => workshop.registrations && workshop.registrations.length > 0).map((workshop) => (
                  <div key={workshop._id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] mb-8">
                    {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-32 object-cover" />}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-1 text-neutral-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                      <p className="text-sm text-neutral-500 mb-2">Date: {new Date(workshop.date).toLocaleDateString()}</p>
                      <p className="text-sm text-neutral-600 mb-4 flex-grow">Registrations: {workshop.registrations ? workshop.registrations.length : 0}</p>
                      <div className="flex flex-row space-x-2">
                        <button
                          onClick={() => toggleRegistrations(workshop._id)}
                          className="w-full px-4 py-2 text-sm bg-blue-300 text-black rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
                        >
                          {expandedWorkshopId === workshop._id ? "Hide Registrations" : "View Registrations"}
                        </button>
                        <button
                          onClick={() => handleDelete(workshop._id)}
                          className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                      {expandedWorkshopId === workshop._id && (
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <h4 className="font-semibold mb-2 text-neutral-800">Registered Users:</h4>
                          {workshop.registrations && workshop.registrations.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-neutral-700">
                              {workshop.registrations.map((email, index) => (
                                <li key={index}>{email}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-neutral-600 text-sm">No registrations for this workshop yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-600 text-lg">No registered workshops found.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
