import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
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
    const interval = setInterval(fetchWorkshops, 5000); // Refetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="container mx-auto p-8">
        <header className="md:flex md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Welcome Admin! Here you can manage students and workshops.</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </header>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-700">Create New Workshop</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  id="image"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Workshop
              </button>
            </form>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-slate-700">Manage Workshops</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            {workshops.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrations
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workshops.map((workshop) => (
                      <tr key={workshop._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {workshop.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(workshop.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workshop.registrations ? workshop.registrations.length : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(workshop._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-600">No workshops created yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}