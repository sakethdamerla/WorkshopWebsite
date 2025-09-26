import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [view, setView] = useState("workshops"); // workshops, create

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 text-neutral-800">
      <div className="container mx-auto p-4 sm:p-8">
        <header className="md:flex md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">Admin Dashboard</h1>
          </div>
          <div className="flex flex-col sm:flex-row">
            <button onClick={() => setView("workshops")} className="mr-0 sm:mr-4 mb-2 sm:mb-0 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold">All Workshops</button>
            <button onClick={() => setView("create")} className="px-4 py-2 sm:px-6 sm:py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold">Create Workshop</button>
          </div>
        </header>

        {view === "create" && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-neutral-800 text-center">Create New Workshop</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mx-auto max-w-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-neutral-700">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-neutral-700">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Create Workshop
                </button>
              </form>
            </div>
          </section>
        )}

        {view === "workshops" && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-neutral-800">Manage Workshops</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {workshops.length > 0 ? (
                workshops.map((workshop) => (
                  <div key={workshop._id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 group border border-slate-200/80 hover:shadow-lg hover:-translate-y-1">
                    {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-40 object-cover" />}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-1 text-neutral-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                      <p className="text-sm text-neutral-500 mb-2">Date: {new Date(workshop.date).toLocaleDateString()}</p>
                      <p className="text-sm text-neutral-600 mb-4 flex-grow">Registrations: {workshop.registrations ? workshop.registrations.length : 0}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-auto">
                        <Link
                          to={`/admin-dashboard/workshop/${workshop._id}/registrations`}
                          className="w-full text-center px-4 py-2 text-sm bg-blue-300 text-black rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
                        >
                          View Registrations
                        </Link>
                        <Link
                          to={`/admin-dashboard/workshop/${workshop._id}/edit`}
                          className="w-full text-center px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(workshop._id)}
                          className="w-full sm:col-span-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-600 text-lg">No workshops created yet.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}