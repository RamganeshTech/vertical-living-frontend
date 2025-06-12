"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { useRegisterWorker } from "../../apiList/workerApi" 
import { toast } from "../../utils/toast"

export default function WorkerRegister() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const invite = searchParams.get("invite")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    workerName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [inviteData, setInviteData] = useState<any>(null)

  const registerWorker = useRegisterWorker()

  useEffect(() => {
    if (!invite) {
      toast({
        title: "Invalid Invitation",
        description: "No invitation token found. Please use a valid invitation link.",
        variant: "destructive",
      })
      setTimeout(() => {
        navigate("/")
      }, 3000)
      return
    }

    // Decode the invite token to get project and role information
    try {
      const decodedInvite = JSON.parse(atob(invite))
      setInviteData(decodedInvite)
    } catch (error) {
      toast({
        title: "Invalid Invitation",
        description: "The invitation link is corrupted or invalid.",
        variant: "destructive",
      })
      setTimeout(() => {
        navigate("/")
      }, 3000)
    }
  }, [invite, navigate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.workerName.trim()) {
      newErrors.workerName = "workerName is required"
    } else if (formData.workerName.trim().length < 2) {
      newErrors.workerName = "workerName must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required"
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phoneNo.replace(/\s/g, ""))) {
      newErrors.phoneNo = "Please enter a valid phone number"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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

    if (!invite) {
      toast({
        title: "Error",
        description: "Invalid invitation token",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      await registerWorker.mutateAsync({
        invite,
        payload: {
        email: formData.email,
        password: formData.password,
        phoneNo: formData.phoneNo,
        workerName: formData.workerName,
        }
})

      toast({
        title: "Success",
        description: "Registration successful! You can now login with your credentials.",
      })

      // Redirect to worker login page
      setTimeout(() => {
        navigate("/workerlogin")
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-4">
              Please use a valid invitation link to register. Redirecting you to the home page...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-hard-hat text-white text-2xl"></i>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-900 to-red-800 bg-clip-text text-transparent">
              Join as Worker
            </CardTitle>
            <CardDescription className="text-orange-700 text-base">
              {inviteData?.specifiedRole && (
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  Role: {inviteData.specifiedRole}
                </span>
              )}
              <br />
              Complete your registration to join the project
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* workerName Field */}
              <div className="space-y-2">
                <Label htmlFor="workerName" className="text-orange-800 font-medium">
                  workerName *
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-orange-400"></i>
                  </div>
                  <Input
                    id="workerName"
                    name="workerName"
                    type="text"
                    value={formData.workerName}
                    onChange={handleChange}
                    placeholder="Enter your workerName"
                    className={`pl-10 border-2 transition-all duration-200 ${
                      errors.workerName
                        ? "border-red-300 focus:border-red-500"
                        : "border-orange-200 focus:border-orange-500"
                    } bg-white/70 backdrop-blur-sm`}
                    error={errors.workerName}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-800 font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-orange-400"></i>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`pl-10 border-2 transition-all duration-200 ${
                      errors.email ? "border-red-300 focus:border-red-500" : "border-orange-200 focus:border-orange-500"
                    } bg-white/70 backdrop-blur-sm`}
                    error={errors.email}
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNo" className="text-orange-800 font-medium">
                  Phone Number *
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-phone text-orange-400"></i>
                  </div>
                  <Input
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`pl-10 border-2 transition-all duration-200 ${
                      errors.phoneNo
                        ? "border-red-300 focus:border-red-500"
                        : "border-orange-200 focus:border-orange-500"
                    } bg-white/70 backdrop-blur-sm`}
                    error={errors.phoneNo}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-orange-800 font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-orange-400"></i>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`pl-10 pr-12 border-2 transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-orange-200 focus:border-orange-500"
                    } bg-white/70 backdrop-blur-sm`}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-400 hover:text-orange-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-orange-800 font-medium">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-orange-400"></i>
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-12 border-2 transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500"
                        : "border-orange-200 focus:border-orange-500"
                    } bg-white/70 backdrop-blur-sm`}
                    error={errors.confirmPassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-400 hover:text-orange-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-xs text-orange-600 mb-1">
                  <i className="fas fa-info-circle mr-1"></i>
                  Password Requirements:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <i
                      className={`fas fa-check mr-2 ${formData.password.length >= 6 ? "text-green-500" : "text-gray-400"}`}
                    ></i>
                    At least 6 characters long
                  </li>
                  <li className="flex items-center">
                    <i
                      className={`fas fa-check mr-2 ${formData.password === formData.confirmPassword && formData.confirmPassword ? "text-green-500" : "text-gray-400"}`}
                    ></i>
                    Passwords match
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                isLoading={registerWorker.isPending}
              >
                {registerWorker.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Registering...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-check mr-2"></i>
                    Complete Registration
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-orange-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium transition-colors"
                  onClick={() => navigate("/workerlogin")}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
