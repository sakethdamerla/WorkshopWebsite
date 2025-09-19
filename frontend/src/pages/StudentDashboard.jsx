// Placeholder data for enrolled workshops. In a real app, you'd fetch this.
import { useState } from "react";
const enrolledWorkshops = [
  {
    id: 1,
    title: "Learn AI basics",
    progress: 75,
    image: "https://placeholder.com/300x200.png?text=AI+Basics",
  },
  {
    id: 3,
    title: "Node.js crash course",
    progress: 30,
    image: "https://placeholder.com/300x200.png?text=Node.js",
  },
];

export default function StudentDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Placeholder for the logged-in user's name.
  // In a real app, this would come from your auth context or state management.
  const userName = "Alex Doe";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="container mx-auto p-8">
        {/* Header Section */}
        <header className="md:flex md:items-center md:justify-between mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome, {userName}!
              </h1>
              <p className="text-slate-600 mt-2">
                Let's continue your learning journey.
              </p>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="text-slate-500 hover:text-slate-600 focus:outline-none focus:text-slate-600"
                aria-label="toggle menu"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  {isMenuOpen ? (
                    <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                  ) : (
                    <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {/* Navigation */}
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
            <button className="w-full px-5 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors md:w-auto">
              Logout
            </button>
          </nav>
        </header>

        {/* Enrolled Workshops Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-slate-700">
            Your Enrolled Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledWorkshops.map((workshop) => (
              <div key={workshop.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                <img src={workshop.image} alt={workshop.title} className="w-full h-40 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-4">{workshop.title}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${workshop.progress}%` }}></div>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{workshop.progress}% Complete</p>
                  <button className="mt-auto self-start inline-block px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors">Continue Learning</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
