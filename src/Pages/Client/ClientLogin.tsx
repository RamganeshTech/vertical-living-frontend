
import type React from "react"

import { useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { toast } from "../../utils/toast"
import { useLoginClient } from "../../apiList/clientApi"
import { setClientProfileData } from "../../features/clientSlice"
import { useDispatch } from "react-redux"
import { setRole } from "../../features/authSlice"

export default function ClientLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isMobile, openMobileSidebar } = useOutletContext<any>()

  const loginClient = useLoginClient()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const data = await loginClient.mutateAsync(formData)

      const clientData = data;

      dispatch(setRole({
        role: clientData.role,
        isauthenticated: true,
        _id: clientData.clientId, // or _id
        userName: clientData?.clientName,
        permission: clientData?.permission || {},
        isGuideRequired: clientData.isGuideRequired
      }));

      dispatch(setClientProfileData({
        clientId: clientData.clientId,
        clientName: clientData.clientName,
        email: clientData.email,
        phoneNo: clientData.phoneNo,
        role: clientData.role,
        isauthenticated: true,
        permission: clientData?.permission || {},
        isGuideRequired: clientData.isGuideRequired


      }));


      toast({
        title: "Success",
        description: "Login successful! Welcome back.",
      })
      navigate("/organizations")
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">

      {/* <Button variant="primary" onClick={() => navigate(-1)} className="!absolute top-[2%] right-[5%] sm:right-[10%]">
        Go Back
      </Button> */}


      <div className="absolute top-2 left-2">
        {isMobile && (
          <button
            onClick={openMobileSidebar}
            className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
            title="Open Menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        )}
      </div>

      <div className="relative w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-user-tie text-white text-2xl"></i>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Client Login
            </CardTitle>
            <CardDescription className="text-blue-600 text-base">
              Sign in to access your project Dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-800 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-blue-400"></i>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`pl-10 border-2 transition-all duration-200 ${errors.email ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                      } bg-white/70 backdrop-blur-sm`}
                    error={errors.email}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-800 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-blue-400"></i>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`pl-10 pr-12 border-2 transition-all duration-200 ${errors.password ? "border-red-300 focus:border-red-500" : "border-blue-200 focus:border-blue-500"
                      } bg-white/70 backdrop-blur-sm`}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>





              <div className="text-right">
                <Link to="/forgotpassword/client" className="text-blue-600 text-sm font-medium ">forgot Password</Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                isLoading={loginClient.isPending}
              >
                {loginClient.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-blue-100">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <span className="text-blue-600 font-medium">Contact your admin for an invitation</span>
              </p>
            </div>

            {/* Help Section */}
            {/* <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 mb-2">
                <i className="fas fa-info-circle mr-1"></i>
                Need help?
              </p>
              <p className="text-xs text-gray-600">
                Contact your organization administrator or IT support for assistance with your login credentials.
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
