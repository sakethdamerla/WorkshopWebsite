import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function WorkshopRegistrations() {
  const { workshopId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}/registrations`);
        const data = await response.json();
        if (response.ok) {
          setRegistrations(data.registrations);
          setWorkshop(data.workshop);
        } else {
          console.error("Failed to fetch registrations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };
    fetchRegistrations();
  }, [workshopId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 text-neutral-800">
      <div className="container mx-auto p-8">
        <Link to="/admin-dashboard" className="text-primary hover:underline mb-8 block">
          &larr; Back to Dashboard
        </Link>
        {workshop && (
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
            Registrations for {workshop.title}
          </h1>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {registrations.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Student Email</th>
                  <th className="p-4">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-4">{user.studentName}</td>
                    <td className="p-4">{user.studentEmail}</td>
                    <td className="p-4">{user.phoneNumber || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No registrations for this workshop yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
