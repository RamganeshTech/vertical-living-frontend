// import React, { useEffect, useState } from "react";
// import type { RootState } from "../../store/store";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { c_DETAILS, NO_IMAGE, plans } from "../../constants/constants";

// interface ImageWithBlurProps {
//   src: string
//   alt: string
//   className?: string
//   width?: number
//   height?: number
// }

// const ImageWithBlur: React.FC<ImageWithBlurProps> = ({ src, alt, className = "", width, height }) => {
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [imageSrc, setImageSrc] = useState("")

//   useEffect(() => {
//     const img = new Image()
//     img.crossOrigin = "anonymous"
//     img.onload = () => {
//       setImageSrc(src)
//       setIsLoaded(true)
//     }
//     img.src = src
//   }, [src])

//   return (
//     <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
//       <div
//         className={`absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 transition-opacity duration-500 ${isLoaded ? "opacity-0" : "opacity-100"
//           }`}
//       />
//       {imageSrc && (
//         <img
//           src={imageSrc}
//           alt={alt}
//           className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
//             }`}
//         />
//       )}
//     </div>
//   )
// }

// const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
//   <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
// )

// const Button: React.FC<{
//   children: React.ReactNode
//   variant?: "primary" | "secondary" | "outline"
//   size?: "sm" | "md" | "lg"
//   className?: string
//   onClick?: () => void
// }> = ({ children, variant = "primary", size = "md", className = "", onClick }) => {
//   const baseClasses = "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center"

//   const variantClasses = {
//     primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
//     secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
//     outline: "border-2 border-current bg-transparent hover:bg-current ",
//   }

//   const sizeClasses = {
//     sm: "px-4 py-2 text-sm",
//     md: "px-6 py-3 text-base",
//     lg: "px-8 py-4 text-lg",
//   }

//   return (
//     <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} onClick={onClick}>
//       {children}
//     </button>
//   )
// }

// const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
//   <span
//     className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ${className}`}
//   >
//     {children}
//   </span>
// )

// export default function HomePage() {
//   const auth = useSelector((state: RootState) => state.authStore);

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const navigate = useNavigate()


//   const handleClose = () => {
//     setIsMobileMenuOpen(false)
//   }

//   const phrase: Record<string, string> = {
//     basic: "Perfect for small design studios",
//     enterprise: "For large design firms",
//     advanced: " For growing design businesses"
//   }



//   return (
//     <div className="min-h-full w-screen bg-white ">
//       {/* Header */}
//       <header className="border-b px-2 sm:px-8 border-gray-300 w-full bg-white/95 backdrop-blur sticky top-0 z-50">
//         <div className=" w-full">
//           <div className="flex justify-between w-full items-center py-4">
//             <div className="flex items-center space-x-3">
//               <ImageWithBlur
//                 src={c_DETAILS.c_LOGO}
//                 alt="Vertical Living Logo"
//                 className="w-10 h-10 rounded-lg"
//                 width={40}
//                 height={40}
//               />
//               <span className="text-xl font-bold text-gray-900">{c_DETAILS.c_NAME}</span>
//             </div>

//             {/* <nav className="hidden md:flex items-center space-x-8">
//               <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
//                 Features
//               </a>
//               <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
//                 Pricing
//               </a>
//               <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
//                 About
//               </a>
//               <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
//                 Contact
//               </a>
//             </nav> */}

//             <div>
//               <div className="hidden sm:flex items-center space-x-4">
//                 {/* NEW: Quote Calculator Button */}
//                 {/* <Button
//                   onClick={() => navigate('/quotecalculator')}
//                   variant="outline"
//                   // className="border-blue-600 text-blue-600 hover:text-blue-600 hover:bg-transparent cursor-pointer"
//                   className="border-blue-600 text-blue-600 hover:text-blue-600 hover:border-blue-600 hover:bg-transparent cursor-pointer"
//                 >
//                   <i className="fas fa-calculator mr-2"></i>
//                   Calculate Quote
//                 </Button> */}
//                 <Button onClick={() => navigate('/login/common')} variant="secondary" className="hidden sm:inline-flex cursor-pointer">
//                   Sign In
//                 </Button>
//                 {auth?.isauthenticated && <Button onClick={() => navigate('/')} className="cursor-pointer">Get Started</Button>}
//               </div>

//               <button className="sm:hidden block p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//                 <i className="fas fa-bars text-gray-600"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>


//       {/* Mobile Menu */}

//       {/* <div className={`sm:hidden top-0 py-4 border-t absolute z-100 border bg-white min-h-screen  ${isMobileMenuOpen ? "-left-[100%]" : "left-[0%]"} w-[80%] transition-all`}> */}
//       <div className={`fixed top-0 left-0 z-50 h-screen bg-white w-[75%] flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} `}>
//         <nav className="flex flex-col space-y-4 ">

//           <div className="flex items-center justify-between p-4 border-b">
//             <div className={`flex items-center gap-3`}>
//               <img src={c_DETAILS.c_LOGO} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
//               <span className="text-lg font-semibold">{c_DETAILS.c_NAME}</span>
//             </div>
//             <button onClick={handleClose} className="text-xl text-gray-700">
//               <i className="fas fa-times"></i>
//             </button>
//           </div>

//           {/* <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
//                   Features
//                 </a>
//                 <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
//                   Pricing
//                 </a>
//                 <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
//                   About
//                 </a>
//                 <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
//                   Contact
//                 </a> */}

//           <ul className="px-4 space-x-2 max-h-screen overflow-y-auto space-y-4 ">
//             <li onClick={() => navigate('/login')} className="border-b border-gray-300 py-5">
//               <Link to={'/login'} className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
//             </li>
//             <li onClick={() => navigate('/organizations')}>
//               <Link to={'/organizations'} className="text-gray-600 hover:text-gray-900 transition-colors">Get Started</Link>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Hero Section */}
//       <section className="pt-20 pb-16 sm:py-24">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-4xl mx-auto">
//             <Badge className="mb-4">
//               <i className="fas fa-rocket mr-2"></i>
//               Interior Design Task Management
//             </Badge>
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
//               Streamline Your{" "}
//               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Work Flows
//               </span>
//             </h1>
//             <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//               Manage client requirements, assign tasks to workers, set timers, and send automated email reminders.
//               Everything you need to deliver exceptional interior design projects on time.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button onClick={() => navigate('/organizations')} size="lg" className="text-lg px-8 py-3 cursor-pointer">
//                 Get Started Today
//                 <i className="fas fa-arrow-right ml-2"></i>
//               </Button>
//               {/* <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
//                 Learn More
//               </Button> */}
//             </div>
//             {/* <p className="text-sm text-gray-500 mt-4">Start managing your projects efficiently • No setup fees</p> */}
//           </div>

//           <div className="mt-16 max-w-5xl mx-auto">
//             <ImageWithBlur
//               src="/placeholder.svg?height=600&width=1000"
//               alt="Vertical Living Dashboard"
//               className="rounded-xl shadow-2xl border"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               Everything you need for interior design project management
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Powerful features designed specifically for interior designers and their teams
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <Card className="text-center border-0 shadow-lg p-6">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                 <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Client Requirements</h3>
//               <p className="text-gray-600">
//                 Capture and organize client requirements, preferences, and specifications in one centralized location.
//               </p>
//             </Card>

//             <Card className="text-center border-0 shadow-lg p-6">
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                 <i className="fas fa-users text-green-600 text-xl"></i>
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Task Assignment</h3>
//               <p className="text-gray-600">
//                 Assign tasks to team members and workers with clear deadlines and detailed instructions.
//               </p>
//             </Card>

//             <Card className="text-center border-0 shadow-lg p-6">
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                 <i className="fas fa-envelope text-purple-600 text-xl"></i>
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Email Reminders</h3>
//               <p className="text-gray-600">
//                 Automated email notifications and reminders to keep everyone on track and informed.
//               </p>
//             </Card>

//             <Card className="text-center border-0 shadow-lg p-6">
//               <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                 <i className="fas fa-stopwatch text-orange-600 text-xl"></i>
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Time Tracking</h3>
//               <p className="text-gray-600">
//                 Built-in timers to track work hours and monitor project progress in real-time.
//               </p>
//             </Card>
//           </div>

//           <div className="mt-16">
//             <div className="w-[100%] sm:w-[60%] mx-auto">
//               <h3 className="text-2xl font-bold text-center  text-gray-900 mb-4">Designed for Interior Design Professionals</h3>
//               <p className="text-gray-600 mb-6 text-center">
//                 Unlike generic project management tools, Vertical Living is built specifically for interior designers.
//                 We understand your workflow, from initial client consultation to final installation.
//               </p>
//               {/* <div className="space-y-4">
//                 <div className="flex items-start">
//                   <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Resource Management</h4>
//                     <p className="text-gray-600">Track materials, furniture, and vendor information</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
//                     <p className="text-gray-600">Visual progress indicators for each project phase</p>
//                   </div>
//                 </div>
//               </div> */}
//             </div>
//             <div>
//               <ImageWithBlur
//                 src="/placeholder.svg?height=400&width=500"
//                 alt="Interior Design Project Management"
//                 className="rounded-lg shadow-lg"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section id="pricing" className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Explore Plan</h2>
//             <p className="text-xl text-gray-600">Start with our Basic plan and upgrade as your business grows</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

//             {plans.map((plan) => {


//               let iconClass = "";
//               switch (plan.key) {
//                 case "basic":
//                   iconClass = "fa-seedling"; // Example: seedling for basic
//                   break;
//                 case "advanced":
//                   iconClass = "fa-rocket"; // Example: rocket for advanced
//                   break;
//                 case "enterprise":
//                   iconClass = "fa-building"; // Example: building for enterprise
//                   break;
//                 default:
//                   iconClass = "fa-layer-group"; // fallback
//               }

//               return (<Card key={plan.key} className={`border-2 ${plan.price ? "border-blue-500" : "border-none"} shadow-xl relative p-6`}>
//                 {plan.price === 0 && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                   <Badge className="bg-gray-500 text-white">Coming Soon</Badge>
//                 </div>}

//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold mb-2">
//                     <i className={`fa-solid ${iconClass} ${plan.price ? "text-blue-600" : "text-gray-600"} mr-2`}></i>
//                     {plan.name}</h3>
//                   <p className="text-gray-600 mb-4">{phrase[plan.key]}</p>
//                   <div className="mb-4">

//                     <span className={`text-2xl sm:text-2xl ${plan.price ? "text-3xl" : "text-xl"} font-bold`}> {plan.price ? `₹ ${plan.price}` : "Coming Soon"}</span>


//                     {plan.price > 0 && <span className="text-gray-500">/month</span>}
//                   </div>
//                 </div>
//                 <ul className="text-sm text-gray-700 mt-2 mb-5 space-y-2">
//                   {plan.features.length > 0 ? (
//                     plan.features.map((feature, idx) => (
//                       <li key={idx} className="flex items-start gap-2">
//                         <i
//                           className={`fa-solid ${feature.includes("✔") ? "fa-check text-green-600 mt-1" : "fa-xmark text-red-400 mt-1"
//                             }`}
//                         />
//                         <span>{feature.replace("✔", "").replace("✘", "")}</span>
//                       </li>
//                     ))
//                   ) : (
//                     <div className="text-sm text-gray-500 text-center">Features Coming Soon</div>
//                   )}
//                 </ul>
//               </Card>)
//             }
//             )}

//             {/* <Card className="border-2 border-green-500 shadow-xl relative p-6"> 
//              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                 <Badge className="bg-green-500 text-white">Available Now</Badge>
//               </div>
//               <div className="text-center mb-6">
//                 <h3 className="text-2xl font-bold mb-2">Basic</h3>
//                 <p className="text-gray-600 mb-4">Perfect for small design studios</p>
//                 <div className="mb-4">
//                   <span className="text-4xl font-bold">$29</span>
//                   <span className="text-gray-500">/month</span>
//                 </div>
//               </div>
//               <ul className="space-y-3 mb-6">
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-green-500 mr-3"></i>
//                   Up to 5 active projects
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-green-500 mr-3"></i>
//                   Client requirement management
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-green-500 mr-3"></i>
//                   Basic task assignment
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-green-500 mr-3"></i>
//                   Email reminders
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-green-500 mr-3"></i>
//                   Time tracking
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-green-500 mr-3"></i>
//                   Basic reporting
//                 </li>
//               </ul>
//              <Button className="w-full" onClick={()=> navigate('/login')}>Get Started</Button> 

//              </Card> */}

//             {/* <Card className="shadow-lg relative p-6 opacity-75">
//               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                 <Badge className="bg-gray-500 text-white">Coming Soon</Badge>
//               </div>
//               <div className="text-center mb-6">
//                 <h3 className="text-2xl font-bold mb-2">Advanced</h3>
//                 <p className="text-gray-600 mb-4">For growing design businesses</p>
//                 <div className="mb-4">
//                   <span className="text-4xl font-bold">$79</span>
//                   <span className="text-gray-500">/month</span>
//                 </div>
//               </div>
//               <ul className="space-y-3 mb-6">
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Up to 25 active projects
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Advanced client portal
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Team collaboration tools
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Automated workflows
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Advanced analytics
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Priority support
//                 </li>
//               </ul>
//               <Button variant="secondary" className="w-full" onClick={() => {}}>
//                 Notify Me
//               </Button>
//             </Card>

//             <Card className="shadow-lg relative p-6 opacity-75">
//               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                 <Badge className="bg-gray-500 text-white">Coming Soon</Badge>
//               </div>
//               <div className="text-center mb-6">
//                 <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
//                 <p className="text-gray-600 mb-4">For large design firms</p>
//                 <div className="mb-4">
//                   <span className="text-4xl font-bold">$199</span>
//                   <span className="text-gray-500">/month</span>
//                 </div>
//               </div>
//               <ul className="space-y-3 mb-6">
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Unlimited projects
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   White-label solution
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Custom integrations
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Advanced security
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Dedicated support
//                 </li>
//                 <li className="flex items-center">
//                   <i className="fas fa-check text-gray-400 mr-3"></i>
//                   Custom onboarding
//                 </li>
//               </ul>
// <Button variant="secondary" className="w-full" onClick={() => {}}>
//                 Notify Me
//               </Button> 
//             </Card> */}
//           </div>
//         </div>
//       </section>

//       {/* Final CTA Section */}
//       {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
//             Ready to transform your interior design workflow?
//           </h2>
//           <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
//             Join interior designers who are already using Vertical Living to manage their projects more efficiently and
//             deliver exceptional results to their clients.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
//               Start with Basic Plan
//               <i className="fas fa-arrow-right ml-2"></i>
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
//             >
//               Contact Sales
//             </Button>
//           </div>
//           <p className="text-sm text-blue-100 mt-4">Get started today • No setup fees • Cancel anytime</p>
//         </div>
//       </section> */}

//       {/* Footer */}
//       <footer id="contact" className="bg-gray-900 text-white py-16">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center space-x-3 mb-4">
//                 <ImageWithBlur
//                   src={c_DETAILS.c_LOGO || NO_IMAGE}
//                   alt="Vertical Living Logo"
//                   className="w-8 h-8 rounded-lg"
//                   width={32}
//                   height={32}
//                 />
//                 <span className="text-xl font-bold">{c_DETAILS.COMPANY_NAME}</span>
//               </div>
//               <p className="text-gray-400 mb-4">
//                 Streamline your Work flow with our specialized task management platform.
//               </p>
//               <div className="flex space-x-4">

//                 <a href="https://www.linkedin.com/company/theverticalliving/" target="_blank" className="text-gray-400 hover:text-white transition-colors">
//                   <i className="fab fa-linkedin text-xl"></i>
//                 </a>
//                 <a href="https://www.instagram.com/living.vertical?igsh=MTN2Mnl0ZTRwdjg1bA==" target="_blank" className="text-gray-400 hover:text-white transition-colors">
//                   <i className="fab fa-instagram text-xl"></i>
//                 </a>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-4">Product</h3>
//               <ul className="space-y-2">
//                 <li>

//                   <a href="#features" className="text-gray-400 scroll-smooth  hover:text-white transition-colors">
//                     Features
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
//                     Pricing
//                   </a>
//                 </li>

//               </ul>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-4">Company</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                     About
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
//                     Contact
//                   </a>
//                 </li>
//               </ul>
//             </div>


//           </div>

//           <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 text-sm">
//               © {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}. All rights reserved.
//             </p>
//             <div className="flex space-x-6 mt-4 md:mt-0">
//               <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
//                 Privacy Policy
//               </a>
//               <a
//                 href="/account-deletion"
//                 className="text-gray-400 hover:text-white text-sm transition-colors"
//               >
//                 Account Deletion
//               </a>

//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }



//  second version
import React, { useState } from 'react';


import { useEffect, useRef } from 'react';
import { COMPANY_DETAILS } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';


const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Accessing auth state as per your structure
  const auth = useSelector((state: RootState) => state.authStore);


  // Handle scroll effect for a cleaner look when moving down
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#features' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 font-['Poppins'] ${isScrolled
          ? 'bg-white backdrop-blur-md py-3 shadow-sm'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto  flex justify-between items-center">

          {/* --- LEFT: Logo & Mobile Trigger --- */}
          <div className="flex items-center gap-4">
            {/* Mobile Toggle Button */}
            <button
              className="lg:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <i className="fas fa-bars-staggered text-xl"></i>
            </button>

            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-blue-200 transition-transform group-hover:scale-105">
                <img
                  src={COMPANY_DETAILS.COMPANY_LOGO}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-slate-900 ">
                {COMPANY_DETAILS.COMPANY_NAME}
              </span>
            </div>
          </div>

          {/* --- CENTER: Desktop Navigation --- */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* --- RIGHT: Auth Actions --- */}
          <div className="flex items-center gap-3">
            {!auth?.isauthenticated ? (
              <button
                onClick={() => navigate('/login/common')}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => navigate(`/organizations/${auth.organizationId}`)}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
              >
                Get Started
                <i className="fas fa-arrow-right-long text-xs"></i>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDE MENU (Left Drawer) --- */}
      <div className={`fixed inset-0 z-[110] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

        {/* Menu Content */}
        <div className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-500 ease-out p-8 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-12">
            <span className="text-xl font-bold text-slate-900 ">{COMPANY_DETAILS.COMPANY_NAME}</span>
            <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-md font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-10 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account</p>
            <button
              onClick={() => { setIsMenuOpen(false); navigate('/login/common'); }}
              className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3"
            >
              <i className="fas fa-user-circle"></i>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


export const HeroSection = () => {

  const auth = useSelector((state: RootState) => state.authStore);

  const navigate = useNavigate()
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900">

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite 1s; }
        .bg-mesh {
          background-image: radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.1) 0, transparent 50%),
                            radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.1) 0, transparent 50%),
                            radial-gradient(at 100% 100%, rgba(251, 191, 36, 0.05) 0, transparent 50%);
        }
      `}</style>

      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 bg-mesh -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative flex flex-col items-center">

        {/* --- LEFT SIDE DECORATION (Visual Fragments) --- */}
        <div className="block absolute  top-1/2 -translate-y-1/2 w-[400px] h-[500px] pointer-events-none"
        style={{ left: '50%', 
            marginLeft: '-720px' // Pushes it exactly to the left of the center text
            }}
        >
        {/* <div className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0 w-[400px] h-[500px] pointer-events-none"> */}
          {/* Main Task Card */}
          <div className="animate-float absolute top-0 left-10 w-[280px] p-6 bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-blue-900/5 z-20">
            <div className="flex items-center justify-between mb-5 px-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Site Tasks</h4>
              <div className="flex gap-1"><span className="w-1 h-1 bg-blue-400 rounded-full"></span><span className="w-1 h-1 bg-slate-200 rounded-full"></span></div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-50">
                <i className="fas fa-cut text-blue-600"></i>
                <span className="text-xs font-bold text-slate-700">Carpentry Cutlist #03</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-50 opacity-60">
                <i className="fas fa-paint-roller text-blue-400"></i>
                <span className="text-xs font-bold text-slate-700">Interior Wall...</span>
              </div>
            </div>
          </div>

          {/* Floating Sticky-Note Style Element */}
          <div className="animate-float-delayed absolute bottom-20 left-20 w-40 p-4 bg-amber-50 border border-amber-100 rounded-2xl shadow-xl -rotate-6 z-10">
            <p className="text-[10px] font-medium text-amber-700 italic leading-tight">
              "Verify material dimensions before cutting."
            </p>
            <div className="mt-2 flex justify-end"><i className="fas fa-thumbtack text-amber-300 text-[10px]"></i></div>
          </div>

          {/* Blue Checkbox Fragment (Like reference) */}
          <div className="animate-float absolute top-1/2 right-10 w-14 h-14 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center text-white z-30">
            <i className="fas fa-check"></i>
          </div>
        </div>

        {/* --- RIGHT SIDE DECORATION (Stats & Context) --- */}
        <div className="block absolute top-1/2 -translate-y-1/2 w-[400px] h-[500px] pointer-events-none"
        // style={{ right: '-5%' }}
        style={{ 
            right: '50%', 
            marginRight: '-720px' // Pushes it exactly to the right of the center text
          }}
        >
          {/* Progress Card */}
          <div className="animate-float p-8 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-blue-900/5 flex flex-col items-center text-center absolute top-10 right-10 w-[260px] z-20">
            <div className="relative w-20 h-20 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-600" strokeWidth="4" strokeDasharray="75, 100" strokeLinecap="round" />
              </svg>
              <span className="absolute text-xl font-black text-slate-900">75%</span>
            </div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Progress</div>
          </div>

          {/* Timer Icon (Like reference) */}
          <div className="animate-float-delayed absolute top-[-20px] right-40 w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-xl flex items-center justify-center text-slate-800 text-xl z-30">
            <i className="fas fa-stopwatch"></i>
          </div>

          {/* Integration Fragment */}
          <div className="animate-float absolute bottom-10 right-20 bg-white border border-slate-100 rounded-[2rem] p-5 shadow-2xl shadow-blue-900/5 flex gap-3 items-center z-10">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><i className="fas fa-calculator text-blue-600 text-xs"></i></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase">Auto-Billing</span>
          </div>

          {/* Star Icon Badge */}
          <div className="animate-float absolute top-0 left-0 w-12 h-12 bg-amber-400 border-4 border-white rounded-xl shadow-lg flex items-center justify-center text-white z-40">
            <i className="fas fa-star"></i>
          </div>
        </div>

        {/* --- CENTRAL TEXT CONTENT --- */}
        <div className="text-center max-w-4xl mx-auto relative z-10 py-16 lg:py-24">
          {/* Modern Badge */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.2em]">
              Next-Gen Construction CRM
            </span>
          </div> */}

          {/* Refined Heading */}
          <h1 className="text-4xl md:text-7xl font-semibold text-slate-900 mb-8 leading-[1.1] tracking-tighter">
            Think, plan, and <br />
            <span className="text-blue-600 relative inline-block">
              track in one place.
              <svg
                className="absolute -bottom-2 left-0 w-full h-2 text-blue-200/60"
                viewBox="0 0 318 12"
                fill="none"
              >
                <path
                  d="M3.5 9.5C68.5 3.5 242.5-3.5 314.5 9.5"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Improved Copy - Removed 'Single Dashboard' */}
          <p className="text-md lg:text-xl text-slate-500 mb-12 leading-normal font-montserrat font-medium max-w-2xl mx-auto">
            Vertical Living provides total architectural oversight through a purpose-built CRM.
            Seamlessly coordinate site operations,
            verify every material delivery, and automate your billing within a unified workspace.
          </p>

          {/* Refined Button Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => auth.isauthenticated ?  navigate(`/organizations/${auth.organizationId}`) : navigate(`/organizations-registration`)  }
              className="w-full cursor-pointer sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              Get started
              <i className="fas fa-arrow-right text-sm transition-transform group-hover:translate-x-1"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const rect = scrollRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = rect.top - windowHeight / 2;
      const total = rect.height;
      const progress = Math.max(0, Math.min(1, -start / total));
      setLineHeight(progress * 100);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    window.addEventListener('scroll', handleScroll);
    const children = scrollRef.current?.querySelectorAll('.reveal-item');
    children?.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const features = [
    { title: "Project Segregation", icon: "fa-layer-group", desc: "Architecturally index every site. Separate drawings, photos, and documents by location." },
    { title: "Multi-User Sync", icon: "fa-arrows-rotate", desc: "Real-time synchronization between site engineers and the back office." },
    { title: "Role-Based Access", icon: "fa-user-shield", desc: "Define precisely what site engineers, supervisors, and accountants can access." },
    { title: "Workflow Tracking", icon: "fa-route", desc: "Track the journey from requisition to site verification with surgical precision." }
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden font-['Poppins']">
      <div className="container mx-auto px-6" ref={scrollRef}>

        {/* --- Header --- */}
        <div className="flex flex-col items-center text-center mb-32 reveal-item opacity-0 transition-all duration-1000">
          <h2 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">The Platform</h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-tight">
            Built for the <span className="text-blue-600 font-extrabold">Precision Builder.</span>
          </h3>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-10 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>

          {/* Mobile Connector: From Header to First Icon */}
          <div className="lg:hidden w-px h-20 bg-slate-100 mt-4"></div>
        </div>

        {/* --- Central Layout --- */}
        <div className="relative max-w-6xl mx-auto">

          {/* 1. Base Gray Line (Desktop Only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 -translate-x-1/2 z-0"></div>

          {/* 2. Animated Blue Line (Desktop Only) */}
          <div
            className="absolute left-1/2 top-0 w-[2px] bg-blue-600 -translate-x-1/2 z-0 origin-top transition-transform duration-150 ease-out"
            style={{ height: `${lineHeight}%` }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-t from-blue-600 to-transparent"></div>
          </div>

          <div className="space-y-32 lg:space-y-40">
            {features.map((item, i) => {
              const isPast = (lineHeight / 100) * (features.length) > i + 0.3;

              return (
                <div key={i} className="relative flex flex-col lg:grid lg:grid-cols-12 items-center w-full">

                  {/* Text Content */}
                  <div className={`order-2 lg:order-none lg:col-span-5 reveal-item opacity-0 translate-y-10 transition-all duration-1000 mt-8 lg:mt-0 ${i % 2 === 0 ? 'lg:text-right text-center' : 'lg:col-start-8 lg:text-left text-center'
                    }`}>
                    <span className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 block">
                      Feature 0{i + 1}
                    </span>
                    <h4 className="text-xl lg:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 text-sm lg:text-base font-medium leading-relaxed max-w-sm mx-auto lg:max-w-none">
                      {item.desc}
                    </p>

                    {/* Mobile Segment Line: Only shows between features, stops before next text */}
                    {i < features.length - 1 && (
                      <div className="lg:hidden flex justify-center mt-12">
                        <div className="w-px h-20 bg-slate-100"></div>
                      </div>
                    )}
                  </div>

                  {/* The Center Point (Icon) */}
                  <div className="order-1 lg:order-none lg:col-span-2 lg:col-start-6 flex justify-center relative z-10">
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center border-4 transition-all duration-700 ${isPast || (!window.matchMedia('(min-width: 1024px)').matches) // On mobile, keep icons active or styled
                        ? 'bg-blue-600 border-blue-100 text-white scale-110 shadow-xl'
                        : 'bg-white border-slate-50 text-slate-300'
                      }`}>
                      <i className={`fas ${item.icon} text-xl`}></i>
                      {isPast && (
                        <div className="absolute inset-0 bg-blue-400 rounded-2xl -z-10 animate-ping opacity-20"></div>
                      )}
                    </div>
                  </div>

                  {/* Spacer for Desktop Balance */}
                  <div className="hidden lg:block lg:col-span-5"></div>
                </div>
              );
            })}
          </div>

          {/* Bottom Cap (Centered for both) */}
          <div className="flex justify-center mt-32">
            <div className={`w-3 h-3 rounded-full transition-all duration-1000 ${lineHeight > 98 || (!window.matchMedia('(min-width: 1024px)').matches) ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)]' : 'bg-slate-200'
              }`}></div>
          </div>
        </div>

      </div>
    </section>
  );
};



const features = [
  {
    title: "Project Management",
    subtitle: "Site Control Center",
    icon: "fa-building-columns",
    desc: "Manage complete project lifecycle from planning to execution with architectural precision.",
    tags: ["Phase Tracking", "Document Index", "Timeline Sync"],
    stat: "100% Visibility"
  },
  {
    title: "Task Assignment",
    subtitle: "Workforce Deployment",
    icon: "fa-list-check",
    desc: "Assign and monitor daily tasks for staff and workers. Stop the WhatsApp chaos.",
    tags: ["Daily Logs", "Member Tracking", "Priority Matrix"],
    stat: "Zero Missed Tasks"
  },
  {
    title: "Material Ordering",
    subtitle: "Supply Chain Sync",
    icon: "fa-truck-fast",
    desc: "Order and track materials across multiple sites. Direct integration with vendor catalogs.",
    tags: ["Vendor Portals", "Bulk PO", "Delivery ETA"],
    stat: "40% Faster Sourcing"
  },
  {
    title: "Order Verification",
    subtitle: "Material Integrity",
    icon: "fa-shield-halved",
    desc: "Verify materials received match orders and invoices. proprietary leakage control logic.",
    tags: ["QR Verify", "Gate Entry", "Discrepancy Alerts"],
    stat: "Zero Leakage"
  },
  {
    title: "Inventory Tracking",
    subtitle: "Stock Intelligence",
    icon: "fa-warehouse",
    desc: "Track stock movement and availability in real-time across central and site godowns.",
    tags: ["Batch Tracking", "Stock Aging", "Auto-Reorder"],
    stat: "Real-time Audits"
  },
  {
    title: "Billing System",
    subtitle: "Professional Accounts",
    icon: "fa-file-invoice",
    desc: "Generate professional invoices and billing documents. Automated tax and margin calculations.",
    tags: ["GST Ready", "Payment Links", "Auto-Reminders"],
    stat: "Instant Billing"
  },
  {
    title: "Retail Invoices",
    subtitle: "Client Transparency",
    icon: "fa-receipt",
    desc: "Handle client-facing billing with professional itemized retail receipting.",
    tags: ["Custom Branded", "Itemized Lists", "Digital Sign"],
    stat: "Clean Audits"
  },
  {
    title: "Cutlist Generation",
    subtitle: "Precision Carpentry",
    icon: "fa-scissors",
    desc: "Automatically generate carpentry cutlists. Reduce ply and laminate waste significantly.",
    tags: ["Optimized Layouts", "Grain Match", "Wastage Control"],
    stat: "22% Less Waste"
  },
  {
    title: "Financial Reports",
    subtitle: "Profit Intelligence",
    icon: "fa-chart-line",
    desc: "Track profits, expenses, and financial performance with deep-dive site analytics.",
    tags: ["P&L Reports", "Cashflow Sync", "Cost Analysis"],
    stat: "Surgical Margins"
  },
  {
    title: "Staff Management",
    subtitle: "Human Capital",
    icon: "fa-users",
    desc: "Manage workforce roles, tasks, and productivity. Track attendance and performance.",
    tags: ["Role Access", "KPI Tracking", "Payout Logs"],
    stat: "90% Efficiency"
  },
  {
    title: "Client Management",
    subtitle: "Stakeholder Portal",
    icon: "fa-user-tie",
    desc: "Handle client communication and approvals in a dedicated workspace.",
    tags: ["Approval Flow", "Photo Updates", "Budget Tracker"],
    stat: "High Trust"
  },
  {
    title: "Stage Workflow",
    subtitle: "Process Automation",
    icon: "fa-diagram-project",
    desc: "Track project stages and approvals seamlessly from foundation to handover.",
    tags: ["Approval Gates", "Checklists", "Milestones"],
    stat: "Linear Growth"
  }
];


const CoreFeatures: React.FC = () => {
  // Using your features constant (12 items)

  return (
    <section id="features" className="py-24 bg-white font-poppins selection:bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* --- Minimalist Section Header --- */}
        <div className="mb-16">
          <p className="text-blue-600 font-semibold uppercase tracking-[0.3em] text-[10px] mb-4">
            Core Modules
          </p>
          <h3 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight leading-snug">
            A unified ecosystem for <br />
            <span className="text-blue-600">modern construction management.</span>
          </h3>
        </div>

        {/* --- Surgical Step-Flow Layout --- */}
        <div className="max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative flex flex-col lg:flex-row lg:items-center py-12 border-b border-slate-100 last:border-0 transition-all duration-500 hover:bg-slate-50/50 px-4 lg:px-8 rounded-xl"
            >
              {/* Index Column (Thin & Elegant) */}
              <div className="lg:w-24 mb-4 lg:mb-0">
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-blue-600 transition-colors duration-300">
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </span>
              </div>

              {/* Title & Icon Column */}
              <div className="lg:w-1/3 flex items-center gap-5 mb-4 lg:mb-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                  <i className={`fas ${f.icon} text-sm`}></i>
                </div>
                <h4 className="text-lg lg:text-xl font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
                  {f.title}
                </h4>
              </div>

              {/* Description Column */}
              <div className="lg:flex-1 lg:px-10 mb-6 lg:mb-0">
                <p className="text-slate-500 text-sm leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  {f.desc}
                </p>
              </div>

              {/* Technical Data Column (The "Surgical" Detail) */}
              <div className="lg:w-1/4 flex flex-col items-start lg:items-end gap-2">
                <div className="flex flex-wrap lg:justify-end gap-2">
                  {f.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-tighter text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                  {f.stat}
                </span>
              </div>

              {/* Animated Accent Line */}
              <div className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-700 group-hover:w-full"></div>
            </div>
          ))}
        </div>

        {/* --- Bottom Summary Line --- */}
        <div className="mt-24 flex justify-center">
          <div className="px-8 py-4 rounded-full border border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End of Modules</span>
            <div className="w-12 h-px bg-slate-200"></div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">12 Total</span>
          </div>
        </div>

      </div>
    </section>
  );
};


const CTA: React.FC = () => {

  const navigate = useNavigate()
  return (
    <section className="py-32 bg-white font-['Poppins'] selection:bg-blue-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* --- Main CTA Container (Light Theme) --- */}
        <div className="relative group overflow-hidden bg-slate-50 rounded-[4rem] p-12 lg:p-24 border border-blue-50 flex flex-col items-center text-center shadow-[0_40px_80px_-30px_rgba(59,130,246,0.08)]">

          {/* Subtle Background Glows (Blue only) */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[80%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[60%] bg-blue-50 rounded-full blur-[100px]" />

          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:30px_30px] opacity-30"></div>

          <div className="relative z-10 max-w-4xl">
            {/* Tag / Badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 rounded-full mb-10 shadow-sm">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                Limited: 14-Day Full Access Trial
              </span>
            </div> */}

            <h2 className="text-4xl lg:text-7xl font-bold text-slate-900 mb-8 tracking-tighter leading-[1.1]">
              Scale your business <br />
              <span className="text-blue-600">with Vertical Living.</span>
            </h2>

            <p className="text-slate-500 text-lg lg:text-xl font-medium mb-14 leading-relaxed max-w-2xl mx-auto">
              Ready to eliminate site leakages and automate your billing? <br className="hidden lg:block" />
              Create your account today and see the difference in precision.
            </p>

            {/* --- The "Non-Ordinary" CTA Buttons --- */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => navigate('/organizations-registration')}
                className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
              >
                Create your account
                <i className="fas fa-arrow-right text-sm transition-transform group-hover/btn:translate-x-1"></i>
              </button>

             
            </div>

          
          </div>

          {/* Floating UI Decorative Elements (Blue/White only) */}
          <div className="hidden xl:block absolute -left-12 bottom-1/4 w-32 h-32 bg-white border border-blue-50 rounded-[2.5rem] shadow-xl md:flex items-center justify-center animate-float opacity-80">
            <div className={`w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl shadow-inner`}>
              <i className="fas fa-users-gear"></i>
            </div>
          </div>

          <div className="hidden xl:block absolute -right-10 top-1/4 w-28 h-28 bg-white border border-blue-50 rounded-3xl shadow-xl md:flex items-center justify-center animate-float-delayed opacity-80">
            <div className={`w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200`}>
              <i className="fas fa-file-invoice"></i>
            </div>
          </div>

        </div>
      </div>

      {/* Global CSS for subtle floating */}
      <style>{`
        @keyframes cta-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float { animation: cta-float 7s ease-in-out infinite; }
        .animate-float-delayed { animation: cta-float 9s ease-in-out infinite 1s; }
      `}</style>
    </section>
  );
};


const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-950 text-white pt-24 pb-12 font-['Poppins'] selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* --- Brand & Social Column (Span 5) --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center space-x-4 group">
              {/* Using your companyLogo variable here */}
              <div className="relative">
                <img
                  src={COMPANY_DETAILS.COMPANY_LOGO}
                  alt={`${COMPANY_DETAILS.COMPANY_NAME} Logo`}
                  className="w-12 h-12 rounded-2xl object-cover shadow-2xl shadow-blue-500/20 transition-transform group-hover:scale-110 duration-500"
                />
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-blue-500/50 transition-colors"></div>
              </div>

              <span className="text-2xl font-bold tracking-tighter">
                {COMPANY_DETAILS.COMPANY_NAME}
              </span>
            </div>

            <p className="text-slate-400 text-base leading-relaxed max-w-sm font-medium opacity-80">
              Transforming site operations with architectural precision. Vertical Living is the digital foundation for modern construction firms.
            </p>

            {/* Social Links with Modern Glass Style */}
            <div className="flex space-x-4">
              {[
                { icon: 'fa-linkedin-in', link: 'https://www.linkedin.com/company/theverticalliving/' },
                { icon: 'fa-instagram', link: 'https://www.instagram.com/living.vertical?igsh=MTN2Mnl0ZTRwdjg1bA==' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 shadow-sm"
                >
                  <i className={`fab ${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* --- Navigation Links (Span 7) --- */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
            {/* Product Column */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.25em]">Product</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.25em]">Company</h3>
              <ul className="space-y-4">
                <li><a href="#about" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">About Us</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.25em]">Legal</h3>
              <ul className="space-y-4">
                <li><a href="/privacy-policy" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Privacy Policy</a></li>
                <li><a href="/account-deletion" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Account Deletion</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Bottom Footer Bar --- */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {COMPANY_DETAILS.COMPANY_NAME}
            </p>
            <div className="hidden md:block w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
            <p className="text-slate-600 text-[10px] font-semibold italic uppercase tracking-tighter">
              Powered by Rams Tech Circle
            </p>
          </div>

          <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em]">
            <i className="fas fa-location-dot text-blue-600 text-sm"></i>
            <span>Tamil Nadu, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <About />
      <CoreFeatures />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;