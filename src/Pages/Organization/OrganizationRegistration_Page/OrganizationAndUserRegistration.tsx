import React, { useState } from 'react';
import { useRegisterOrgAndOwner } from '../../../apiList/userApi';
import { toast } from '../../../utils/toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setRole } from '../../../features/authSlice';
import { setOwnerProfileData } from '../../../features/userSlices';

const OrganizationAndUserRegistration = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useRegisterOrgAndOwner();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNo: '',
    organizationName: '',
    address: '',
    organizationPhoneNo: '',
    orgEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'];
    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (currentStep === 1) {
      if (!formData.username.trim()) newErrors.username = "Full name is required";
      if (!emailRegex.test(formData.email)) newErrors.email = "Valid email required";
      if (!phoneRegex.test(formData.phoneNo)) newErrors.phoneNo = "10-digit number required";
      if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    } else {
      if (formData.organizationName.trim().length < 3) newErrors.organizationName = "Minimum 3 characters";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!phoneRegex.test(formData.organizationPhoneNo)) newErrors.organizationPhoneNo = "Valid 10-digit office phone required";
      if (!emailRegex.test(formData.orgEmail)) newErrors.orgEmail = "Valid business email required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(1)) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    try {
      // Clear previous submission errors
      setErrors({});

      // Use mutateAsync to wait for the response
      const response = await mutateAsync(formData);

      if (response?.ok) {
        const userData = response.data;

        // 1. Update Role/Auth Store
        dispatch(setRole({
          _id: userData.userId,
          role: userData.role,
          isauthenticated: true,
          userName: userData.userName,
          permission: userData.permission || {},
          isGuideRequired: userData.isGuideRequired,
          ownerId: userData.ownerId,
          organizationId: userData.organizationId
        }));

        // 2. Update Profile Store
        dispatch(setOwnerProfileData({
          userId: userData.userId,
          userName: userData.userName,
          email: userData.email,
          phoneNo: userData.phoneNo,
          role: userData.role,
          isauthenticated: true,
          isGuideRequired: userData.isGuideRequired,
          ownerId: userData.ownerId
        }));

        toast({ title: "Success", description: "Registration successful!" });

        // 3. Navigate to the specific organization page
        navigate(`/organizations/${userData.organizationId}`);
      }
    } catch (err: any) {
      // toast({
      //   title: "Registration Failed",
      //   description: err?.response?.data?.message || "Something went wrong",
      //   variant: "destructive"
      // });

      // Extract the error message safely depending on how Axios/API throws it
      const errorMessage =  err?.response?.data?.message || err?.message || "Registration failed";
      const lowerCaseMsg = errorMessage.toLowerCase();

      // Check for Step 1 Errors (User Details)
      if (lowerCaseMsg.includes("email")) {
        setStep(1);
        setErrors(prev => ({ ...prev, email: errorMessage }));
        toast({ title: "Check Details", description: "Email issue detected.", variant: "destructive" });
      } 
      else if (lowerCaseMsg.includes("phone")) {
        setStep(1);
        setErrors(prev => ({ ...prev, phoneNo: errorMessage }));
        toast({ title: "Check Details", description: "Phone number issue detected.", variant: "destructive" });
      } 
      // Check for Step 2 Errors (Organization Details)
      else if (lowerCaseMsg.includes("organization name")) {
        setStep(2);
        setErrors(prev => ({ ...prev, organizationName: errorMessage }));
        toast({ title: "Check Details", description: "Organization name issue detected.", variant: "destructive" });
      } 
      // Fallback for generic server errors
      else {
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const renderInput = (
    label: string,
    name: string,
    type: string,
    placeholder: string,
    faIcon: string,
    isPhone: boolean = false,
    showToggle: boolean = false,
    toggleState?: boolean,
    setToggle?: (val: boolean) => void
  ) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
          <i className={faIcon}></i>
        </div>
        <input
          name={name}
          type={showToggle ? (toggleState ? "text" : "password") : type}
          value={(formData as any)[name]}
          onChange={handleChange}
          onKeyDown={isPhone ? handlePhoneKeyDown : undefined}
          maxLength={isPhone ? 10 : undefined}
          className={`w-full pl-10 pr-10 py-2.5 bg-white border ${errors[name] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'} rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-sm font-poppins text-gray-800 shadow-sm`}
          placeholder={placeholder}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setToggle?.(!toggleState)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className={toggleState ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
          </button>
        )}
      </div>
      {errors[name] && <span className="text-xs text-red-500 font-medium mt-0.5">{errors[name]}</span>}
    </div>
  );

  return (
    <main className="flex w-full max-w-[900px] min-h-[550px] bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mx-auto font-poppins">

      {/* UPDATED Left Side: Soft Tinted Background for Better Contrast */}
      <section className="hidden md:flex flex-col flex-1 bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 border-r border-indigo-100/50 p-10 justify-between relative overflow-hidden">

        {/* Subtle decorative blurs to give it a premium SaaS depth without being dark */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
              <i className="fa-solid fa-layer-group text-white text-sm"></i>
            </div>
            <span className="font-semibold text-gray-800 text-lg font-montserrat">CRM Portal</span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 font-montserrat leading-snug mb-3">
            {step === 1 ? "Setup administrator account" : "Configure organization profile"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {step === 1
              ? "Create your owner credentials to manage staff, clients, and interior projects securely."
              : "Register your firm's details to initialize your customized workforce dashboard."}
          </p>
        </div>

        {/* Custom SVG Dashboard Illustration */}
        <div className="relative z-10 mt-8 w-full flex justify-center">
          <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto opacity-100 drop-shadow-xl transition-all duration-500 hover:-translate-y-1">
            {/* Background Panel - Now stands out against the tinted background */}
            <rect x="10" y="20" width="300" height="200" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
            {/* Sidebar */}
            <rect x="10" y="20" width="60" height="200" rx="8" fill="#F8FAFC" stroke="#F1F5F9" strokeWidth="1" />
            <rect x="25" y="40" width="30" height="6" rx="3" fill="#CBD5E1" />
            <rect x="25" y="60" width="30" height="6" rx="3" fill="#E2E8F0" />
            <rect x="25" y="75" width="20" height="6" rx="3" fill="#E2E8F0" />
            <rect x="25" y="90" width="25" height="6" rx="3" fill="#E2E8F0" />
            {/* Header */}
            <rect x="90" y="40" width="100" height="12" rx="4" fill="#EEF2FF" />
            <circle cx="280" cy="45" r="8" fill="#E2E8F0" />
            {/* Content Cards */}
            <rect x="90" y="70" width="95" height="60" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
            <rect x="105" y="85" width="20" height="20" rx="4" fill="#6366F1" />
            <rect x="105" y="115" width="50" height="4" rx="2" fill="#A5B4FC" />

            <rect x="195" y="70" width="95" height="60" rx="6" fill="#F8FAFC" stroke="#F1F5F9" strokeWidth="1" />
            <rect x="210" y="85" width="20" height="20" rx="4" fill="#CBD5E1" />
            <rect x="210" y="115" width="40" height="4" rx="2" fill="#E2E8F0" />
            {/* List area */}
            <rect x="90" y="145" width="200" height="40" rx="6" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
            <circle cx="110" cy="165" r="6" fill="#CBD5E1" />
            <rect x="130" y="163" width="80" height="4" rx="2" fill="#E2E8F0" />

            <rect x="90" y="195" width="200" height="25" rx="6" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1.5" />
          </svg>
        </div>
      </section>

      {/* Right Side: Professional Form */}
      <section className="flex-[1.2] p-8 md:p-10 flex flex-col justify-center bg-white relative z-20">

        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <span className="text-lg font-semibold text-gray-800 font-montserrat">
            {step === 1 ? "Owner Details" : "Firm Details"}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Step {step} of 2
          </span>
        </div>

        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              {renderInput("Full Name", "username", "text", "e.g. Prabhu Kumar", "fa-solid fa-user")}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInput("Email Address", "email", "email", "name@example.com", "fa-regular fa-envelope")}
                {renderInput("Mobile Number", "phoneNo", "text", "10-digit number", "fa-solid fa-mobile-screen", true)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInput("Password", "password", "password", "••••••••", "fa-solid fa-lock", false, true, showPassword, setShowPassword)}
                {renderInput("Confirm Password", "confirmPassword", "password", "••••••••", "fa-solid fa-lock", false, true, showConfirmPassword, setShowConfirmPassword)}
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm">
                  Continue to Firm Details <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              {renderInput("Organization Name", "organizationName", "text", "e.g. Rams Tech Circle", "fa-regular fa-building")}
              {renderInput("Office Address", "address", "text", "Full office location", "fa-solid fa-map-pin")}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInput("Office Phone", "organizationPhoneNo", "text", "10-digit number", "fa-solid fa-phone", true)}
                {renderInput("Official Email", "orgEmail", "email", "contact@firm.com", "fa-regular fa-envelope")}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer text-sm">
                  <i className="fa-solid fa-arrow-left text-xs"></i> Back
                </button>
                <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-400 flex items-center justify-center cursor-pointer text-sm">
                  {isPending ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : null}
                  {isPending ? "Creating Account..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </main>
  );
};

export default OrganizationAndUserRegistration;