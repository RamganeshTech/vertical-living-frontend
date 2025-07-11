import React from "react";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CommonSiteInfo from "../Stage Pages/Site Measurement/CommonSiteInfo";
import { COMPANY_DETAILS } from "../../constants/constants";

const HomePage = () => {

  const auth = useSelector((state: RootState) => state.authStore);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        {/* ✅ Logo */}
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-house text-blue-600 text-2xl"></i>
          <h1 className="text-xl font-bold text-blue-600">{COMPANY_DETAILS.COMPANY_NAME}</h1>
        </div>

        {/* ✅ Right side: only show if NOT authenticated */}
        {!auth.isauthenticated ? (
          <nav>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
            >
              <i className="fa-solid fa-right-to-bracket mr-2"></i>
              Login / Register
            </Link>
          </nav>
        )
          :
          <>
            <nav>
              <Link
                to="/organizations"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
              >
                <i className="fa-solid fa-right-to-bracket mr-2"></i>
              </Link>
            </nav>
          </>
        }
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6 flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-slide-in">
            Build Your Dream Home With Confidence
          </h2>
          <p className="text-lg mb-6 max-w-xl">
            From requirements gathering to final delivery, Vertical Living handles every stage of your construction project.
          </p>
          <a href="/login" className="inline-block bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition">
            <i className="fas fa-arrow-right mr-2"></i> Get Started
          </a>
        </div>
        <div className="flex-1">
          <img
            src="/images/hero-house.png"
            alt="House Illustration"
            className="w-full rounded-xl shadow-lg animate-fade-in"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16">
        <h3 className="text-3xl font-bold mb-10 text-center text-blue-600">Our Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "fas fa-file-alt",
              title: "Requirement Forms",
              desc: "Collect detailed client requirements for every room."
            },
            {
              icon: "fas fa-ruler-combined",
              title: "Site Measurement",
              desc: "Track on-site measurements with live progress."
            },
            {
              icon: "fas fa-tasks",
              title: "Project Workflow",
              desc: "14-step workflow from planning to delivery."
            },
            {
              icon: "fas fa-file-invoice-dollar",
              title: "Cost Estimation",
              desc: "Automate material & labor cost breakdowns."
            },
            {
              icon: "fas fa-box-open",
              title: "Material Ordering",
              desc: "Manage material orders, uploads, and shop details."
            },
            {
              icon: "fas fa-users-cog",
              title: "Role-based Access",
              desc: "Clients, Staff, CTOs & Owners work together securely."
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 animate-fade-up"
            >
              <i className={`${feature.icon} text-blue-600 text-3xl mb-4`}></i>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-20">
        <h3 className="text-3xl font-bold mb-10 text-center">How It Works</h3>
        <div className="max-w-4xl mx-auto space-y-6">
          <p><i className="fas fa-check-circle mr-2"></i> Register as an owner and invite your team.</p>
          <p><i className="fas fa-check-circle mr-2"></i> Collect client requirements and track approvals.</p>
          <p><i className="fas fa-check-circle mr-2"></i> Handle material orders, uploads, payments and delivery.</p>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="contact" className="px-6 py-10 bg-gray-800 text-white text-center">
        <p className="mb-2">Ready to get started?</p>
        <a href="/login" className="inline-block bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition">
          <i className="fas fa-user-plus mr-2"></i> Register Now
        </a>
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Vertical Living. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
