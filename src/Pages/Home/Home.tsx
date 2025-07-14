import React, { useEffect, useState } from "react";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { COMPANY_DETAILS, plans } from "../../constants/constants";

// const HomePage:React.FC = () => {

//   const auth = useSelector((state: RootState) => state.authStore);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
//       {/* Navbar */}
//       <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
//         {/* ✅ Logo */}
//         <div className="flex items-center space-x-2">
//           <i className="fa-solid fa-house text-blue-600 text-2xl"></i>
//           <h1 className="text-xl font-bold text-blue-600">{COMPANY_DETAILS.COMPANY_NAME}</h1>
//         </div>

//         {/* ✅ Right side: only show if NOT authenticated */}
//         {!auth.isauthenticated ? (
//           <nav>
//             <Link
//               to="/login"
//               className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
//             >
//               <i className="fa-solid fa-right-to-bracket mr-2"></i>
//               Login / Register
//             </Link>
//           </nav>
//         )
//           :
//           <>
//             <nav>
//               <Link
//                 to="/organizations"
//                 className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
//               >
//                 <i className="fa-solid fa-right-to-bracket mr-2"></i>
//               </Link>
//             </nav>
//           </>
//         }
//       </header>

//       {/* Hero Section */}
//       <section className="pt-28 pb-20 px-6 flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
//         <div className="flex-1">
//           <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-slide-in">
//             Build Your Dream Home With Confidence
//           </h2>
//           <p className="text-lg mb-6 max-w-xl">
//             From requirements gathering to final delivery, Vertical Living handles every stage of your construction project.
//           </p>
//           <a href="/login" className="inline-block bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition">
//             <i className="fas fa-arrow-right mr-2"></i> Get Started
//           </a>
//         </div>
//         <div className="flex-1">
//           <img
//             src="/images/hero-house.png"
//             alt="House Illustration"
//             className="w-full rounded-xl shadow-lg animate-fade-in"
//           />
//         </div>
//       </section>

//       {/* Features */}
//       <section id="features" className="px-6 py-16">
//         <h3 className="text-3xl font-bold mb-10 text-center text-blue-600">Our Features</h3>
//         <div className="grid md:grid-cols-3 gap-8">
//           {[
//             {
//               icon: "fas fa-file-alt",
//               title: "Requirement Forms",
//               desc: "Collect detailed client requirements for every room."
//             },
//             {
//               icon: "fas fa-ruler-combined",
//               title: "Site Measurement",
//               desc: "Track on-site measurements with live progress."
//             },
//             {
//               icon: "fas fa-tasks",
//               title: "Project Workflow",
//               desc: "14-step workflow from planning to delivery."
//             },
//             {
//               icon: "fas fa-file-invoice-dollar",
//               title: "Cost Estimation",
//               desc: "Automate material & labor cost breakdowns."
//             },
//             {
//               icon: "fas fa-box-open",
//               title: "Material Ordering",
//               desc: "Manage material orders, uploads, and shop details."
//             },
//             {
//               icon: "fas fa-users-cog",
//               title: "Role-based Access",
//               desc: "Clients, Staff, CTOs & Owners work together securely."
//             }
//           ].map((feature, idx) => (
//             <div
//               key={idx}
//               className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 animate-fade-up"
//             >
//               <i className={`${feature.icon} text-blue-600 text-3xl mb-4`}></i>
//               <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
//               <p className="text-gray-600">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-20">
//         <h3 className="text-3xl font-bold mb-10 text-center">How It Works</h3>
//         <div className="max-w-4xl mx-auto space-y-6">
//           <p><i className="fas fa-check-circle mr-2"></i> Register as an owner and invite your team.</p>
//           <p><i className="fas fa-check-circle mr-2"></i> Collect client requirements and track approvals.</p>
//           <p><i className="fas fa-check-circle mr-2"></i> Handle material orders, uploads, payments and delivery.</p>
//         </div>
//       </section>

//       {/* Contact / Footer */}
//       <footer id="contact" className="px-6 py-10 bg-gray-800 text-white text-center">
//         <p className="mb-2">Ready to get started?</p>
//         <a href="/login" className="inline-block bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition">
//           <i className="fas fa-user-plus mr-2"></i> Register Now
//         </a>
//         <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Vertical Living. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;




// code given by deepseek 




// import { useState } from 'react';

// function HomePage() {
//   const [email, setEmail] = useState('');
//   const [activeTab, setActiveTab] = useState('features');

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 flex items-center">
//                 <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
//                 </svg>
//                 <span className="ml-2 text-xl font-bold text-gray-900">TaskFlow</span>
//                 <span className="ml-2 text-sm text-gray-500">by Horizontal Living</span>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <a href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Features</a>
//               <a href="#pricing" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Pricing</a>
//               <a href="#testimonials" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Testimonials</a>
//               <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sign Up Free</button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
//             Task Management Made Simple
//           </h1>
//           <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
//             Organize, prioritize, and track your team's work with TaskFlow - the intuitive task management platform from Horizontal Living.
//           </p>
//           <div className="mt-8 flex justify-center">
//             <div className="inline-flex rounded-md shadow">
//               <a
//                 href="#"
//                 className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//               >
//                 Get Started
//               </a>
//             </div>
//             <div className="ml-3 inline-flex">
//               <a
//                 href="#"
//                 className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
//               >
//                 Live Demo
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div id="features" className="bg-white py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="lg:text-center">
//             <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
//             <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
//               A better way to manage tasks
//             </p>
//             <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
//               TaskFlow provides everything your team needs to stay organized and productive.
//             </p>
//           </div>

//           <div className="mt-20">
//             <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
//               {[
//                 {
//                   name: 'Task Boards',
//                   description: 'Visualize your workflow with customizable Kanban boards.',
//                   icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
//                 },
//                 {
//                   name: 'Team Collaboration',
//                   description: 'Assign tasks, add comments, and track progress together.',
//                   icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
//                 },
//                 {
//                   name: 'Time Tracking',
//                   description: 'Monitor time spent on tasks and generate reports.',
//                   icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
//                 },
//                 {
//                   name: 'Priority Management',
//                   description: 'Set priorities and deadlines to focus on what matters.',
//                   icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
//                 },
//                 {
//                   name: 'Integrations',
//                   description: 'Connect with Slack, Google Calendar, and other tools you use.',
//                   icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
//                 },
//                 {
//                   name: 'Mobile Friendly',
//                   description: 'Access your tasks from anywhere on any device.',
//                   icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
//                 },
//               ].map((feature) => (
//                 <div key={feature.name} className="pt-6">
//                   <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
//                     <div className="-mt-6">
//                       <div>
//                         <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
//                           <svg
//                             className="h-6 w-6 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             aria-hidden="true"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d={feature.icon}
//                             />
//                           </svg>
//                         </span>
//                       </div>
//                       <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
//                       <p className="mt-5 text-base text-gray-500">
//                         {feature.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pricing Section */}
//       <div id="pricing" className="bg-gray-50 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="sm:flex sm:flex-col sm:align-center">
//             <h2 className="text-3xl font-extrabold text-gray-900 text-center">Pricing Plans</h2>
//             <p className="mt-5 text-xl text-gray-500 text-center max-w-2xl mx-auto">
//               Simple, transparent pricing that scales with your team.
//             </p>
//             <div className="relative mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
//               <div className="grid grid-cols-1 md:grid-cols-3">
//                 {[
//                   {
//                     name: 'Starter',
//                     price: '$9',
//                     description: 'Perfect for individuals',
//                     features: [
//                       'Up to 5 projects',
//                       'Basic task management',
//                       '1GB file storage',
//                       'Email support',
//                     ],
//                     cta: 'Get Started',
//                   },
//                   {
//                     name: 'Team',
//                     price: '$29',
//                     description: 'For growing teams',
//                     features: [
//                       'Unlimited projects',
//                       'Advanced task management',
//                       '10GB file storage',
//                       'Priority support',
//                       'Team collaboration',
//                     ],
//                     cta: 'Popular',
//                     featured: true,
//                   },
//                   {
//                     name: 'Enterprise',
//                     price: 'Custom',
//                     description: 'For large organizations',
//                     features: [
//                       'Unlimited everything',
//                       'Dedicated account manager',
//                       'On-premise options',
//                       'Custom integrations',
//                       '24/7 support',
//                     ],
//                     cta: 'Contact Sales',
//                   },
//                 ].map((plan) => (
//                   <div
//                     key={plan.name}
//                     className={`p-8 ${plan.featured ? 'bg-indigo-50' : ''}`}
//                   >
//                     <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
//                     <p className="mt-4">
//                       <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
//                       {plan.price !== 'Custom' && (
//                         <span className="text-base font-medium text-gray-500">/mo</span>
//                       )}
//                     </p>
//                     <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
//                     <ul className="mt-6 space-y-4">
//                       {plan.features.map((feature) => (
//                         <li key={feature} className="flex items-start">
//                           <svg
//                             className="flex-shrink-0 h-5 w-5 text-green-500"
//                             xmlns="http://www.w3.org/2000/svg"
//                             viewBox="0 0 20 20"
//                             fill="currentColor"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                           <span className="ml-3 text-base text-gray-500">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                     <button
//                       className={`mt-8 w-full block text-center px-6 py-3 border border-transparent rounded-md text-base font-medium ${
//                         plan.featured
//                           ? 'bg-indigo-600 text-white hover:bg-indigo-700'
//                           : 'bg-white text-indigo-600 hover:bg-gray-50 border border-gray-300'
//                       }`}
//                     >
//                       {plan.cta}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Testimonials */}
//       <div id="testimonials" className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="lg:text-center">
//             <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
//             <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
//               Trusted by teams worldwide
//             </p>
//           </div>
//           <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
//             {[
//               {
//                 quote: "TaskFlow has transformed how our team works. We're 40% more productive since switching.",
//                 name: "Sarah Johnson",
//                 title: "CEO, TechStart Inc.",
//               },
//               {
//                 quote: "The intuitive interface makes it easy for our non-technical team members to adopt.",
//                 name: "Michael Chen",
//                 title: "Product Manager, Horizon Labs",
//               },
//               {
//                 quote: "Finally a task management tool that doesn't get in the way of actual work!",
//                 name: "Emily Rodriguez",
//                 title: "CTO, DigitalWave",
//               },
//             ].map((testimonial) => (
//               <div key={testimonial.name} className="bg-gray-50 p-6 rounded-lg">
//                 <svg
//                   className="h-12 w-12 text-gray-400"
//                   fill="currentColor"
//                   viewBox="0 0 32 32"
//                   aria-hidden="true"
//                 >
//                   <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
//                 </svg>
//                 <p className="mt-4 text-lg text-gray-600">{testimonial.quote}</p>
//                 <p className="mt-4 font-medium text-gray-900">{testimonial.name}</p>
//                 <p className="text-sm text-gray-500">{testimonial.title}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="bg-indigo-700">
//         <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
//             <span className="block">Ready to streamline your workflow?</span>
//             <span className="block">Start using TaskFlow today.</span>
//           </h2>
//           <p className="mt-4 text-lg leading-6 text-indigo-200">
//             Join thousands of teams who are already more productive with TaskFlow.
//           </p>
//           <div className="mt-10 flex justify-center">
//             <div className="inline-flex rounded-md shadow">
//               <a
//                 href="#"
//                 className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
//               >
//                 Sign up for free
//               </a>
//             </div>
//             <div className="ml-3 inline-flex">
//               <a
//                 href="#"
//                 className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70"
//               >
//                 Learn more
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white">
//         <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
//           <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
//             <div className="px-5 py-2">
//               <a href="#" className="text-base text-gray-500 hover:text-gray-900">
//                 About
//               </a>
//             </div>
//             <div className="px-5 py-2">
//               <a href="#" className="text-base text-gray-500 hover:text-gray-900">
//                 Blog
//               </a>
//             </div>
//             <div className="px-5 py-2">
//               <a href="#" className="text-base text-gray-500 hover:text-gray-900">
//                 Jobs
//               </a>
//             </div>
//             <div className="px-5 py-2">
//               <a href="#" className="text-base text-gray-500 hover:text-gray-900">
//                 Press
//               </a>
//             </div>
//             <div className="px-5 py-2">
//               <a href="#" className="text-base text-gray-500 hover:text-gray-900">
//                 Accessibility
//               </a>
//             </div>
//             <div className="px-5 py-2">
//               <a href="#" className="text-base text-gray-500 hover:text-gray-900">
//                 Partners
//               </a>
//             </div>
//           </nav>
//           <div className="mt-8 flex justify-center space-x-6">
//             <a href="#" className="text-gray-400 hover:text-gray-500">
//               <span className="sr-only">Facebook</span>
//               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path
//                   fillRule="evenodd"
//                   d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </a>
//             <a href="#" className="text-gray-400 hover:text-gray-500">
//               <span className="sr-only">Twitter</span>
//               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//               </svg>
//             </a>
//             <a href="#" className="text-gray-400 hover:text-gray-500">
//               <span className="sr-only">GitHub</span>
//               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path
//                   fillRule="evenodd"
//                   d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </a>
//           </div>
//           <p className="mt-8 text-center text-base text-gray-400">
//             &copy; {new Date().getFullYear()} Horizontal Living, Inc. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default HomePage;


interface ImageWithBlurProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

const ImageWithBlur: React.FC<ImageWithBlurProps> = ({ src, alt, className = "", width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState("")

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
    img.src = src
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 transition-opacity duration-500 ${isLoaded ? "opacity-0" : "opacity-100"
          }`}
      />
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
            }`}
        />
      )}
    </div>
  )
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
)

const Button: React.FC<{
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  onClick?: () => void
}> = ({ children, variant = "primary", size = "md", className = "", onClick }) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center"

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
    outline: "border-2 border-current bg-transparent hover:bg-current hover:text-white",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ${className}`}
  >
    {children}
  </span>
)

export default function HomePage() {
  const auth = useSelector((state: RootState) => state.authStore);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()


  const handleClose = ()=>{
    setIsMobileMenuOpen(false)
  }

  const phrase: Record<string, string> = {
    basic: "Perfect for small design studios",
    enterprise: "For large design firms",
    advanced: " For growing design businesses"
  }



  return (
    <div className="min-h-full w-full bg-white">
      {/* Header */}
      <header className="border-b px-4 border-gray-300 w-full bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className=" w-full">
          <div className="flex justify-between w-full items-center py-4">
            <div className="flex items-center space-x-3">
              <ImageWithBlur
                src={COMPANY_DETAILS.COMPANY_LOGO}
                alt="Vertical Living Logo"
                className="w-10 h-10 rounded-lg"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold text-gray-900">{COMPANY_DETAILS.COMPANY_NAME}</span>
            </div>

            {/* <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </nav> */}

          <div>
              <div className="hidden sm:flex items-center space-x-4">
              <Button onClick={()=> navigate('/login')}  variant="secondary" className="hidden sm:inline-flex cursor-pointer">
                Sign In
              </Button>
              {auth?.isauthenticated && <Button onClick={()=> navigate('/')} className="cursor-pointer">Get Started</Button>}
            </div>

              <button className="sm:hidden block p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <i className="fas fa-bars text-gray-600"></i>
              </button>
          </div>
          </div> 
        </div>
      </header>


       {/* Mobile Menu */}
          
            {/* <div className={`sm:hidden top-0 py-4 border-t absolute z-100 border bg-white min-h-screen  ${isMobileMenuOpen ? "-left-[100%]" : "left-[0%]"} w-[80%] transition-all`}> */}
            <div className={`fixed top-0 left-0 z-50 h-screen bg-white w-[75%] flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} `}>
              <nav className="flex flex-col space-y-4 ">

                 <div className="flex items-center justify-between p-4 border-b">
                          <div className={`flex items-center gap-3`}>
                            <img src={COMPANY_DETAILS.COMPANY_LOGO} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                            <span className="text-lg font-semibold">{COMPANY_DETAILS.COMPANY_NAME}</span>
                          </div>
                          <button onClick={handleClose} className="text-xl text-gray-700">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                
                {/* <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a> */}

               <ul className="px-4 space-x-2 max-h-screen overflow-y-auto space-y-4 ">
                <li onClick={()=> navigate('/login')} className="border-b border-gray-300 py-5">
                   <Link to={'/login'} className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                </li>
                <li onClick={()=> navigate('/organizations')}>
                <Link to={'/organizations'} className="text-gray-600 hover:text-gray-900 transition-colors">Get Started</Link>
                </li>
               </ul>
              </nav>
            </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4">
              <i className="fas fa-rocket mr-2"></i>
              Interior Design Task Management
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               Work Flows
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Manage client requirements, assign tasks to workers, set timers, and send automated email reminders.
              Everything you need to deliver exceptional interior design projects on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={()=> navigate('/organizations')} size="lg" className="text-lg px-8 py-3 cursor-pointer">
                Get Started Today
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
              {/* <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Learn More
              </Button> */}
            </div>
            {/* <p className="text-sm text-gray-500 mt-4">Start managing your projects efficiently • No setup fees</p> */}
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <ImageWithBlur
              src="/placeholder.svg?height=600&width=1000"
              alt="Vertical Living Dashboard"
              className="rounded-xl shadow-2xl border"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for interior design project management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for interior designers and their teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Client Requirements</h3>
              <p className="text-gray-600">
                Capture and organize client requirements, preferences, and specifications in one centralized location.
              </p>
            </Card>

            <Card className="text-center border-0 shadow-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-green-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Task Assignment</h3>
              <p className="text-gray-600">
                Assign tasks to team members and workers with clear deadlines and detailed instructions.
              </p>
            </Card>

            <Card className="text-center border-0 shadow-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-envelope text-purple-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Email Reminders</h3>
              <p className="text-gray-600">
                Automated email notifications and reminders to keep everyone on track and informed.
              </p>
            </Card>

            <Card className="text-center border-0 shadow-lg p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-stopwatch text-orange-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Tracking</h3>
              <p className="text-gray-600">
                Built-in timers to track work hours and monitor project progress in real-time.
              </p>
            </Card>
          </div>

          <div className="mt-16">
            <div className="w-[100%] sm:w-[60%] mx-auto">
              <h3 className="text-2xl font-bold text-center  text-gray-900 mb-4">Designed for Interior Design Professionals</h3>
              <p className="text-gray-600 mb-6 text-center">
                Unlike generic project management tools, Vertical Living is built specifically for interior designers.
                We understand your workflow, from initial client consultation to final installation.
              </p>
              {/* <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-gray-900">Project Templates</h4>
                    <p className="text-gray-600">Pre-built templates for common interior design projects</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-gray-900">Resource Management</h4>
                    <p className="text-gray-600">Track materials, furniture, and vendor information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                    <p className="text-gray-600">Visual progress indicators for each project phase</p>
                  </div>
                </div>
              </div> */}
            </div>
            <div>
              <ImageWithBlur
                src="/placeholder.svg?height=400&width=500"
                alt="Interior Design Project Management"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Explore Plan</h2>
            <p className="text-xl text-gray-600">Start with our Basic plan and upgrade as your business grows</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {plans.map((plan) => {


              let iconClass = "";
              switch (plan.key) {
                case "basic":
                  iconClass = "fa-seedling"; // Example: seedling for basic
                  break;
                case "advanced":
                  iconClass = "fa-rocket"; // Example: rocket for advanced
                  break;
                case "enterprise":
                  iconClass = "fa-building"; // Example: building for enterprise
                  break;
                default:
                  iconClass = "fa-layer-group"; // fallback
              }

              return (<Card key={plan.key} className={`border-2 ${plan.price ? "border-blue-500" : "border-none"} shadow-xl relative p-6`}>
                {plan.price === 0 && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gray-500 text-white">Coming Soon</Badge>
                </div>}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    <i className={`fa-solid ${iconClass} ${plan.price ? "text-blue-600" : "text-gray-600"} mr-2`}></i>
                    {plan.name}</h3>
                  <p className="text-gray-600 mb-4">{phrase[plan.key]}</p>
                  <div className="mb-4">

                    <span className={`text-2xl sm:text-2xl ${plan.price ? "text-3xl" : "text-xl"} font-bold`}> {plan.price ? `₹ ${plan.price}` : "Coming Soon"}</span>


                    {plan.price > 0 && <span className="text-gray-500">/month</span>}
                  </div>
                </div>
                <ul className="text-sm text-gray-700 mt-2 mb-5 space-y-2">
                  {plan.features.length > 0 ? (
                    plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <i
                          className={`fa-solid ${feature.includes("✔") ? "fa-check text-green-600 mt-1" : "fa-xmark text-red-400 mt-1"
                            }`}
                        />
                        <span>{feature.replace("✔", "").replace("✘", "")}</span>
                      </li>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 text-center">Features Coming Soon</div>
                  )}
                </ul>
              </Card>)
            }
            )}

            {/* <Card className="border-2 border-green-500 shadow-xl relative p-6"> 
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white">Available Now</Badge>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <p className="text-gray-600 mb-4">Perfect for small design studios</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  Up to 5 active projects
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  Client requirement management
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  Basic task assignment
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  Email reminders
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  Time tracking
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  Basic reporting
                </li>
              </ul>
             <Button className="w-full" onClick={()=> navigate('/login')}>Get Started</Button> 

             </Card> */}

            {/* <Card className="shadow-lg relative p-6 opacity-75">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gray-500 text-white">Coming Soon</Badge>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Advanced</h3>
                <p className="text-gray-600 mb-4">For growing design businesses</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Up to 25 active projects
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Advanced client portal
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Team collaboration tools
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Automated workflows
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Priority support
                </li>
              </ul>
              <Button variant="secondary" className="w-full" onClick={() => {}}>
                Notify Me
              </Button>
            </Card>

            <Card className="shadow-lg relative p-6 opacity-75">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gray-500 text-white">Coming Soon</Badge>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">For large design firms</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Unlimited projects
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  White-label solution
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Advanced security
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-gray-400 mr-3"></i>
                  Custom onboarding
                </li>
              </ul>
<Button variant="secondary" className="w-full" onClick={() => {}}>
                Notify Me
              </Button> 
            </Card> */}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your interior design workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join interior designers who are already using Vertical Living to manage their projects more efficiently and
            deliver exceptional results to their clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start with Basic Plan
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Contact Sales
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">Get started today • No setup fees • Cancel anytime</p>
        </div>
      </section> */}

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <ImageWithBlur
                  src={COMPANY_DETAILS.COMPANY_LOGO || "/placeholder.svg"}
                  alt="Vertical Living Logo"
                  className="w-8 h-8 rounded-lg"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold">{COMPANY_DETAILS.COMPANY_NAME}</span>
              </div>
              <p className="text-gray-400 mb-4">
                Streamline your Work flow with our specialized task management platform.
              </p>
              <div className="flex space-x-4">
                {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a> */}
                {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a> */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>

                  <a href="#features" className="text-gray-400 scroll-smooth  hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Updates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Roadmap
                  </a>
                </li> */}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li> */}
                {/* <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li> */}
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div> */}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



