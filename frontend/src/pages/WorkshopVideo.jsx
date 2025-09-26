import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Countdown from "../components/Countdown";

export default function WorkshopVideo() {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch workshop details.");
        }
        const data = await response.json();
        setWorkshop(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [workshopId]);

  if (loading) return <div className="text-center p-10">Loading workshop...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!workshop) return <div className="text-center p-10">Workshop not found.</div>;
  
  const eventDate = new Date(workshop.date);
  const now = new Date();
  const isEventStarted = now >= eventDate;

  // Basic URL validation for YouTube embed
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const videoUrl = new URL(url);
      if (videoUrl.hostname === "www.youtube.com" || videoUrl.hostname === "youtube.com") {
        const videoId = videoUrl.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (videoUrl.hostname === "youtu.be") {
        return `https://www.youtube.com/embed/${videoUrl.pathname.slice(1)}`;
      }
    } catch (e) {
      console.error("Invalid video URL", e);
      return null;
    }
    // For other video sources, you might just return the URL if it's a direct link
    return url;
  };

  const videoSrc = workshop.video?.data
    ? `${import.meta.env.VITE_API_BASE_URL}/api/workshops/${workshopId}/video`
    : getEmbedUrl(workshop.videoUrl || workshop.liveUrl);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{workshop.title}</h1>
        <p className="text-neutral-600 mb-6">{workshop.description}</p>
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          {isEventStarted ? (
            videoSrc ? (
              videoSrc.includes('embed') ? (
                <iframe src={videoSrc} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={workshop.title} className="w-full h-full"></iframe>
              ) : (
                <video src={videoSrc} controls className="w-full h-full">Your browser does not support the video tag.</video>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-white p-4 text-center"><p className="text-xl">The video for this workshop will be available soon.</p></div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
              <h2 className="text-2xl mb-4">The workshop has not started yet!</h2>
              <Countdown date={workshop.date} />
            </div>
          )}
        </div>
        <div className="mt-8">
          <Link to="/student-dashboard" className="text-primary hover:underline">&larr; Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}