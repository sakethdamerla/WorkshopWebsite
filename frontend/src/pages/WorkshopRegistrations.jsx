import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function WorkshopRegistrations() {
  const { workshopId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [workshopTitle, setWorkshopTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}/registrations`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch registrations.");
        }
        const data = await response.json();
        setRegistrations(data.registrations);
        if (data.registrations.length > 0) {
          setWorkshopTitle(data.registrations[0].workshopTitle);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [workshopId]);

  if (loading) return <div className="text-center p-10">Loading registrations...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Registrations for {workshopTitle || "Workshop"}</h1>
        <Link to="/admin-dashboard" className="text-primary hover:underline mb-6 block">&larr; Back to Admin Dashboard</Link>
        
        {registrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Student Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id} className="border-b">
                    <td className="py-2 px-4">{reg.studentName}</td>
                    <td className="py-2 px-4">{reg.studentEmail}</td>
                    <td className="py-2 px-4">{reg.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No registrations found for this workshop.</p>
        )}
      </div>
    </div>
  );
}