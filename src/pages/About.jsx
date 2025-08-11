import React from 'react';
import { FaUser, FaCode, FaPalette, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Heading with modern styling */}
        <div className="text-center mb-16">
          <div className="inline-block p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <FaUser className="text-2xl text-red-500" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
            About Us
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Intro Paragraph with better visibility */}
        <div className="text-center mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Welcome to our movie ticket booking website, a comprehensive project being developed for 
              <span className="text-red-400 font-bold"> Devkriti 2025</span>. This project is created by students from 
              <span className="text-blue-400 font-bold"> Atal Bihari Vajpayee Indian Institute of Information Technology and Management (IIITM), Gwalior</span>. 
              Our aim is to provide a seamless and intuitive ticket booking experience that revolutionizes how users discover, 
              select, and book their favorite movies.
            </p>
          </div>
        </div>

        {/* Team Members Section with modern cards */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-100">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Team Member 1 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                  <FaCode className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-red-400 group-hover:text-red-300 transition-colors">
                  Pranjal Manhgaye
                </h3>
                <p className="text-gray-400 mb-3 font-medium">
                  Roll No: 2024IMG-034
                </p>
                <p className="text-gray-300 font-semibold mb-4 text-lg">
                  Frontend & Backend Developer
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Responsible for developing the core functionality, API integration, and ensuring smooth user experience across all platforms.
                </p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-4 mt-6">
                  <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                    <FaGithub className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    <FaEnvelope className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <FaPalette className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-400 group-hover:text-blue-300 transition-colors">
                  Aryan Tyagi
                </h3>
                <p className="text-gray-400 mb-3 font-medium">
                  Roll No: 2024IMG-009
                </p>
                <p className="text-gray-300 font-semibold mb-4 text-lg">
                  UI/UX Designer & Feature Integrator
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Focused on creating intuitive user interfaces, enhancing user experience, and integrating advanced features seamlessly.
                </p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-4 mt-6">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <FaGithub className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    <FaEnvelope className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Goals with modern cards */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-100">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-2xl text-white" />
              </div>
              <h3 className="font-bold text-red-400 mb-3 text-lg">User Experience</h3>
              <p className="text-gray-400 leading-relaxed">
                Create an intuitive and seamless booking experience for movie enthusiasts with modern design principles.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCode className="text-2xl text-white" />
              </div>
              <h3 className="font-bold text-blue-400 mb-3 text-lg">Innovation</h3>
              <p className="text-gray-400 leading-relaxed">
                Implement cutting-edge features and modern web technologies to stay ahead of the curve.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPalette className="text-2xl text-white" />
              </div>
              <h3 className="font-bold text-green-400 mb-3 text-lg">Reliability</h3>
              <p className="text-gray-400 leading-relaxed">
                Ensure robust and secure ticket booking system for users with 99.9% uptime guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-gray-100">Get In Touch</h3>
            <p className="text-gray-400 mb-6">
              Have questions about our project? We'd love to hear from you!
            </p>
            <div className="flex justify-center gap-6">
              <a href="mailto:team@moviehub.example.com" className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors">
                <FaEnvelope />
                <span>Email Us</span>
              </a>
              <a href="https://github.com/your-team" className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors">
                <FaGithub />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 