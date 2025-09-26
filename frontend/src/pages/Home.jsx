import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext'; // Correctly import and use the useAuth hook

export default function Home() {
  const [workshops, setWorkshops] = useState([]);
  const { user } = useAuth(); // Get user from auth context

  useEffect(() => {
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

    fetchWorkshops();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <motion.header
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Welcome to the <span className="text-primary">AI Workshop Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Explore the cutting edge of Artificial Intelligence. Register for workshops, watch exclusive content, and accelerate your learning journey.
          </p>
          <div className="mt-8">
            <Link 
              to={user ? (user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard') : '/login'}
              className="inline-block px-8 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {user ? 'Go to Your Dashboard' : 'Get Started'}
            </Link>
          </div>
        </motion.header>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-slate-800 text-center">Upcoming Workshops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.length > 0 ? (
              workshops.map((workshop, i) => (
                <motion.div 
                  key={workshop._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 group border border-slate-200/80 hover:shadow-lg hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-48 object-cover" />}
                  <div className="p-4 sm:p-6 flex flex-col h-full">
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Date: {new Date(workshop.date).toLocaleDateString()}</p>
                      <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                      <p className="text-slate-600 mb-6 flex-grow">{workshop.description.substring(0, 100)}...</p>
                    </div>
                    <div className="mt-auto">
                      <Link
                        to={user ? (user.role === 'student' ? `/register/${workshop._id}` : '/admin-dashboard') : '/login'}
                        className="w-full text-center block px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold shadow-sm"
                      >
                        {user ? (user.role === 'student' ? 'Register Now' : 'Manage') : 'Login to Register'}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-600 text-lg col-span-full text-center">No upcoming workshops at the moment. Please check back soon!</p>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="my-16 sm:my-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">About the AI Workshop Hub</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            The AI Workshop Hub is dedicated to providing high-quality, accessible, and engaging workshops in Artificial Intelligence.
            Our mission is to empower students and professionals with the knowledge and skills needed to thrive in the rapidly evolving AI landscape.
            Join our community to learn from experts, collaborate on projects, and stay ahead in the world of AI.
          </p>
        </section>

        {/* Makers Section */}
        <section className="my-16 sm:my-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-slate-800 text-center">Meet the Makers</h2>
          <div className="flex justify-center flex-wrap gap-10">
            {/* Maker 1 */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-slate-200/80 w-full max-w-sm">
              <img src="https://placehold.co/150" alt="Saketh Damerla" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-bold text-slate-900 mb-1">Saketh Damerla</h3>
              <p className="text-slate-500 mb-4">Lead Developer & AI Enthusiast</p>
              <div className="flex justify-center space-x-4">
                <a href="https://github.com/sakethdamerla" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                  <FaGithub size={24} />
                </a>
                <a href="https://linkedin.com/in/sakethdamerla" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                  <FaLinkedin size={24} />
                </a>
                <a href="mailto:sakethdamerla@example.com" className="text-slate-500 hover:text-primary transition-colors">
                  <FaEnvelope size={24} />
                </a>
              </div>
            </div>

            {/* Maker 2 (Example, add more as needed) */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-slate-200/80 w-full max-w-sm">
              <img src="https://placehold.co/150" alt="Another Contributor" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-bold text-slate-900 mb-1">Jane Doe</h3>
              <p className="text-slate-500 mb-4">UI/UX Designer</p>
              <div className="flex justify-center space-x-4">
                <a href="https://github.com/janedoe" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                  <FaGithub size={24} />
                </a>
                <a href="https://linkedin.com/in/janedoe" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                  <FaLinkedin size={24} />
                </a>
                <a href="mailto:janedoe@example.com" className="text-slate-500 hover:text-primary transition-colors">
                  <FaEnvelope size={24} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="my-16 sm:my-24 text-center bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200/80">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-800">Get in Touch</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
            Have questions or suggestions? We'd love to hear from you! Reach out to us via email or connect on social media.
          </p>
          <div className="flex justify-center space-x-4 sm:space-x-6">
            <a href="mailto:support@aiworkshop.com" className="flex items-center px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors font-semibold shadow-sm">
              <FaEnvelope className="mr-2" /> Email Us
            </a>
            <a href="https://linkedin.com/company/aiworkshop" target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold shadow-sm">
              <FaLinkedin className="mr-2" /> LinkedIn
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 sm:mt-24 pt-8 text-center text-slate-500 border-t border-slate-200">
          <p>&copy; {new Date().getFullYear()} AI Workshop Hub. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}