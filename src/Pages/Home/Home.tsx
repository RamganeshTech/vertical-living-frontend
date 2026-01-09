import React, { useEffect, useState } from "react";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { COMPANY_DETAILS, NO_IMAGE, plans } from "../../constants/constants";

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


  const handleClose = () => {
    setIsMobileMenuOpen(false)
  }

  const phrase: Record<string, string> = {
    basic: "Perfect for small design studios",
    enterprise: "For large design firms",
    advanced: " For growing design businesses"
  }



  return (
    <div className="min-h-full w-screen bg-white ">
      {/* Header */}
      <header className="border-b px-2 sm:px-8 border-gray-300 w-full bg-white/95 backdrop-blur sticky top-0 z-50">
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
                <Button onClick={() => navigate('/login')} variant="secondary" className="hidden sm:inline-flex cursor-pointer">
                  Sign In
                </Button>
                {auth?.isauthenticated && <Button onClick={() => navigate('/')} className="cursor-pointer">Get Started</Button>}
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
            <li onClick={() => navigate('/login')} className="border-b border-gray-300 py-5">
              <Link to={'/login'} className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            </li>
            <li onClick={() => navigate('/organizations')}>
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
              <Button onClick={() => navigate('/organizations')} size="lg" className="text-lg px-8 py-3 cursor-pointer">
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
                  src={COMPANY_DETAILS.COMPANY_LOGO || NO_IMAGE}
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
                <a href="https://www.linkedin.com/company/theverticalliving/" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="https://www.instagram.com/living.vertical?igsh=MTN2Mnl0ZTRwdjg1bA==" target="_blank" className="text-gray-400 hover:text-white transition-colors">
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
              <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a
                href="/account-deletion"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Account Deletion
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



