import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TypingEffect from "../components/TypingEffect";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import useMediaQuery from "../hooks/useMediaQuery";

const About = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="py-8 sm:py-16 bg-white text-center mt-8 sm:mt-16"
  >
    <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">About This Platform</h2>
    <p className="max-w-3xl mx-auto text-sm sm:text-lg text-neutral-600">
      Our platform is built to help students and professionals explore workshops, register easily, and track their learning progress.
    </p>
  </motion.section>
);

const Team = () => {
  const teamMembers = [
    { name: "John Doe", role: "Developer", image: "https://via.placeholder.com/150" },
    { name: "Jane Smith", role: "Designer", image: "https://via.placeholder.com/150" },
    { name: "Peter Jones", role: "Project Manager", image: "https://via.placeholder.com/150" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-8 sm:py-16 text-center"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Meet the Makers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-transform duration-300"
          >
            <img src={member.image} alt={member.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold">{member.name}</h3>
            <p className="text-sm sm:text-base text-neutral-600">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

const Contact = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="py-8 sm:py-16 bg-white text-center"
  >
    <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Get in Touch</h2>
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 inline-block">
      <p className="text-base sm:text-lg">Email: <a href="mailto:support@aiworkshop.com" className="text-primary hover:underline">support@aiworkshop.com</a></p>
      <p className="text-base sm:text-lg">Phone: +91 98765 43210</p>
      <div className="flex justify-center space-x-2 sm:space-x-4 mt-2 sm:mt-4">
        <a href="#" className="text-xl sm:text-2xl text-neutral-600 hover:text-primary"><FaLinkedin /></a>
        <a href="#" className="text-xl sm:text-2xl text-neutral-600 hover:text-primary"><FaInstagram /></a>
        <a href="#" className="text-xl sm:text-2xl text-neutral-600 hover:text-primary"><FaGithub /></a>
      </div>
    </div>
  </motion.section>
);

const Footer = () => (
  <footer className="bg-neutral-900 text-white py-6 sm:py-8">
    <div className="container mx-auto px-4 text-center">
      <div className="flex justify-center space-x-4 sm:space-x-8 mb-2 sm:mb-4 text-sm sm:text-base">
        <Link to="/about" className="hover:text-primary">About Us</Link>
        <Link to="/contact" className="hover:text-primary">Contact</Link>
        <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
      </div>
      <div className="flex justify-center space-x-2 sm:space-x-4">
        <a href="#" className="text-xl sm:text-2xl hover:text-primary"><FaLinkedin /></a>
        <a href="#" className="text-xl sm:text-2xl hover:text-primary"><FaInstagram /></a>
        <a href="#" className="text-xl sm:text-2xl hover:text-primary"><FaGithub /></a>
      </div>
    </div>
  </footer>
);

const Home = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workshops`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWorkshops(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading workshops...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 text-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center my-8 sm:my-16">
          <TypingEffect
            text={[
              "Welcome to the Workshop"
            ]}
            className="text-2xl sm:text-3xl md:text-7xl font-extrabold mb-4 text-neutral-900 h-20 sm:h-24"
            enabled={!isMobile}
          />
          <p className="text-neutral-600 max-w-s mx-auto text-sm sm:text-base">
            Explore the future of technology with our hands-on workshops led by
            industry experts. Level up your skills and build amazing things.
          </p>
        </header>

        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-neutral-800 text-center">
          Upcoming Workshops
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {workshops.length > 0 ? (
            workshops.map((workshop) => (
              <div
                key={workshop._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col group"
              >
                {workshop.image && <img src={workshop.image} alt={workshop.title} className="w-full h-40 sm:h-48 object-cover" />}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-neutral-900 group-hover:text-primary transition-colors duration-300">{workshop.title}</h3>
                  <p className="text-sm sm:text-base text-neutral-600 mb-4 flex-grow">{workshop.description}</p>
                  <p className="text-xs sm:text-sm text-neutral-500 mb-6">Date: {new Date(workshop.date).toLocaleDateString()}</p>
                  <Link
                    to={`/register/${workshop._id}`}
                    className="mt-auto self-start inline-block px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-300 text-sm sm:text-base"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-neutral-600 text-base sm:text-lg">No workshops available yet. Check back later!</p>
          )}
        </div>
        <About />
        <Team />
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
