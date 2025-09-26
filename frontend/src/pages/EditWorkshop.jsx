import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function EditWorkshop() {
  const { workshopId } = useParams();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}`);
        if (!response.ok) throw new Error('Workshop not found');
        const data = await response.json();
        setWorkshop(data);
        setLiveUrl(data.liveUrl || '');
        setVideoUrl(data.videoUrl || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [workshopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Using FormData to handle file uploads
    const formData = new FormData();
    formData.append('liveUrl', liveUrl);
    formData.append('videoUrl', videoUrl);
    if (videoFile) {
      formData.append('video', videoFile);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update workshop');
      }
      alert('Workshop updated successfully!');
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center p-10">Loading workshop details...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-2">Edit Workshop: {workshop?.title}</h1>
        <Link to="/admin-dashboard" className="text-primary hover:underline mb-6 block">&larr; Back to Admin Dashboard</Link>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="liveUrl" className="block text-sm font-medium text-neutral-700">Live Session URL</label>
            <input
              type="text"
              id="liveUrl"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="https://example.com/live"
            />
          </div>
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-neutral-700">Pre-recorded Video URL</label>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div className="text-center text-sm text-gray-500">OR</div>
          <div>
            <label htmlFor="videoFile" className="block text-sm font-medium text-neutral-700">Upload Video from Device</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {videoFile && <p className="text-sm text-gray-600 mt-2">Selected: {videoFile.name}</p>}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}