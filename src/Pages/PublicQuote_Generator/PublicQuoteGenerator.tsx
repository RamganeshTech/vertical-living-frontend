
import React, { useState, useMemo } from 'react';
import { COMPANY_DETAILS } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';



// --- PROFESSIONAL ESTIMATION CONSTANTS ---
const ESTIMATION_CONFIG = {
    LABOUR_DAILY_SALARY: 2000,
    PROFIT_MARGIN: 1.30, // 30% Markup
    LABOUR_DAYS_PER_SQFT: 0.125, // Industrial average: 1 day of work for every 8 sqft
    MATERIAL_BASE_RATES: {
        'Standard': 950,
        'Premium': 1400,
        'Luxury': 2100
    },
    COMPLEXITY_MULTIPLIERS: {
        '1 BHK': 1.0,
        '2 BHK': 1.15,
        '3 BHK': 1.25,
        'Villa': 1.45,
        // 'Low': 0.85,
        // 'Medium': 1.0,
        // 'High': 1.30
    }
};

const PublicQuoteGenerator: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        carpetArea: '',
        homeType: '2 BHK',
        // storage: 'Medium',
        finish: 'Premium'
    });
    const [clientInfo, setClientInfo] = useState({
        name: '',
        phone: '',
        email: '',
        location: ''

    });


    const navigate = useNavigate()

    const [errors, setErrors] = useState<Record<string, string>>({});



    // Validation Helper
    // const validate = () => {
    //     const newErrors: Record<string, boolean> = {};

    //     if (clientInfo.name.trim().length < 3) newErrors.name = true;
    //     if (!/^\d{10}$/.test(clientInfo.phone)) newErrors.phone = true;
    //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)) newErrors.email = true;
    //     if (clientInfo.location.trim().length < 2) newErrors.location = true;

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (clientInfo.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }
        if (!/^\d{10}$/.test(clientInfo.phone)) {
            newErrors.phone = "Enter a valid 10-digit mobile number";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientInfo.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (clientInfo.location.trim().length < 2) {
            newErrors.location = "Please enter your city/location";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Submit and Save to Google Sheets
    const handleAccessValuation = async () => {
        if (!validate()) return;

        const dataToSave = {
            name: clientInfo.name,
            phone: clientInfo.phone,
            email: clientInfo.email,
            location: clientInfo.location,
            carpetArea: formData.carpetArea,
            homeType: formData.homeType,
            finish: formData.finish,
            estimate: estimate // The calculated amount
        };

        try {
            // Replace with your Google Apps Script Web App URL
            // mode: 'no-cors' is mandatory for Google Apps Script redirects
            await fetch('https://script.google.com/macros/s/AKfycby1za3iClzVCPFUxBfakDkhv19fLuM_KfiKFX_ZmSzvbLJ25Ml91NNRm4lT5OXmDdyJ/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave),
            });
            setStep(3);
        } catch (err) {
            console.error("Sheet save failed", err);
            setStep(3); // Move forward anyway so user isn't stuck
        }
    };

    const estimate = useMemo(() => {
        const area = Number(formData.carpetArea) || 0;

        // 1. Calculate Material Component
        const materialBase = ESTIMATION_CONFIG.MATERIAL_BASE_RATES[formData.finish as keyof typeof ESTIMATION_CONFIG.MATERIAL_BASE_RATES];

        // 2. Calculate Labour Component (Total Area * Days required * Salary)
        const totalLabourCost = area * ESTIMATION_CONFIG.LABOUR_DAYS_PER_SQFT * ESTIMATION_CONFIG.LABOUR_DAILY_SALARY;

        // 3. Apply Multipliers for configuration and storage density
        const configMult = ESTIMATION_CONFIG.COMPLEXITY_MULTIPLIERS[formData.homeType as keyof typeof ESTIMATION_CONFIG.COMPLEXITY_MULTIPLIERS];
        // const storageMult = ESTIMATION_CONFIG.COMPLEXITY_MULTIPLIERS[formData.storage as keyof typeof ESTIMATION_CONFIG.COMPLEXITY_MULTIPLIERS];

        // const subTotal = (area * materialBase + totalLabourCost) * configMult * storageMult;
        const subTotal = (area * materialBase + totalLabourCost) * configMult;

        // 4. Add 30% Corporate Profit
        return Math.round(subTotal * ESTIMATION_CONFIG.PROFIT_MARGIN);
    }, [formData]);

    const SelectionButton = ({ label, value, stateKey }: { label: string, value: string, stateKey: string }) => (
        <button
            onClick={() => setFormData({ ...formData, [stateKey]: value })}
            className={`flex-1 py-4 px-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${formData[stateKey as keyof typeof formData] === value
                ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-105 z-10"
                : "bg-slate-50 border-transparent text-slate-500 hover:border-blue-200 hover:bg-white"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen max-w-screen bg-white flex flex-col font-sans text-slate-900 overflow-x-hidden">

            {/* Header */}
            <nav className="w-full px-8 py-5 flex justify-between items-center border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
                <div onClick={()=> navigate('/home')} className=" cursor-pointer flex items-center gap-4">
                    <img src={COMPANY_DETAILS.COMPANY_LOGO} alt="Logo" className="w-12 h-12 rounded-2xl shadow-blue-100 shadow-xl" />
                    <div className="flex flex-col">
                        <span className="font-black text-blue-900 tracking-tighter text-2xl uppercase leading-none">{COMPANY_DETAILS.COMPANY_NAME}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Cost Calculator</span>
                    </div>
                </div>
                <div className="hidden md:flex gap-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1.5 w-16 rounded-full transition-all duration-700 ${step >= s ? "bg-blue-600" : "bg-slate-100"}`} />
                    ))}
                </div>
            </nav>

            <main className="flex-1 flex flex-col lg:flex-row">
                {/* Left Visual Summary Sidebar */}
                <section className="hidden lg:flex lg:w-5/12 bg-[#0a192f] p-16 flex-col justify-center text-white relative overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]"></div>

                    <div className="relative z-10">
                        <Badge label="Instant Estimation Engine" />
                        <h2 className="text-5xl font-black leading-[1.1] mt-8 mb-6">Precision Pricing For Your Space.</h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md">Our algorithm utilizes live market material rates and calibrated labour costs to provide an accurate technical audit of your interior budget.</p>

                        <div className="mt-12 bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2.5rem]">
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Specification Summary</p>
                            <div className="grid grid-cols-2 gap-y-8">
                                <SummaryItem label="Net Area" value={`${formData.carpetArea || '0'} SQFT`} />
                                <SummaryItem label="Configuration" value={formData.homeType} />
                                <SummaryItem label="Grade" value={formData.finish} />
                                {/* <SummaryItem label="Storage" value={formData.storage} /> */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Interaction Zone */}
                <section className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                    <div className="w-full max-w-xl">

                        {step === 1 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-12 duration-700">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Define Project</h3>
                                    <p className="text-slate-500 mt-2">Enter your dimensions to initiate the audit.</p>
                                </div>

                                <div className="space-y-10">
                                    {/* Carpet Area */}
                                    <div className="relative group">
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block ml-1">Usable Carpet Area</label>
                                        <input
                                            type="number"
                                            placeholder="Enter Area"
                                            value={formData.carpetArea}
                                            onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] py-8 px-10 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-4xl font-black placeholder:text-slate-200"
                                        />
                                        <span className="absolute right-10 top-[60%] -translate-y-1/2 text-slate-300 font-black text-xl">SQFT</span>
                                    </div>

                                    {/* Configuration */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Space Configuration</label>
                                        <div className="flex gap-3">
                                            {['1 BHK', '2 BHK', '3 BHK', 'Villa'].map(type => (
                                                <SelectionButton key={type} label={type} value={type} stateKey="homeType" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Finish Tiers */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Finishing Grade</label>
                                        <div className="space-y-3">
                                            {[
                                                { id: 'Standard', title: 'Standard Execution', sub: 'Standard grade durability and essential aesthetics.' },
                                                { id: 'Premium', title: 'Premium Execution', sub: 'Enhanced material lifespan with superior tactile finishes.' },
                                                { id: 'Luxury', title: 'Luxury Execution', sub: 'Elite-tier craftsmanship and customized architectural finishes.' }
                                            ].map((opt) => (
                                                <div
                                                    key={opt.id}
                                                    onClick={() => setFormData({ ...formData, finish: opt.id })}
                                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${formData.finish === opt.id ? "bg-blue-50 border-blue-600 shadow-2xl shadow-blue-100" : "bg-white border-slate-100 hover:border-blue-200"
                                                        }`}
                                                >
                                                    <div>
                                                        <p className={`font-black text-lg ${formData.finish === opt.id ? "text-blue-900" : "text-slate-700"}`}>{opt.title}</p>
                                                        <p className="text-xs text-slate-400 font-medium mt-1">{opt.sub}</p>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${formData.finish === opt.id ? "bg-blue-600 border-blue-600" : "border-slate-200 group-hover:border-blue-300"}`}>
                                                        {formData.finish === opt.id && <i className="fas fa-check text-xs text-white"></i>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={!formData.carpetArea}
                                        onClick={() => setStep(2)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all uppercase tracking-[0.2em] active:scale-[0.98] text-xl disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        Generate Audit Report
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Steps 2 and 3 logic remains similar but with updated typography and components */}
                        {step === 2 && (

                            <div className="animate-in zoom-in-95 duration-500 text-center max-w-sm mx-auto">
                                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Identity Verify</h3>
                                <p className="text-slate-400 mb-8 text-sm font-medium">Provide details to unlock the technical audit.</p>

                                <div className="space-y-4 text-left"> {/* text-left for error alignment */}
                                    {/* Name Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="text" placeholder="Full Name"
                                            className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-8 focus:outline-none transition-all font-bold text-lg ${errors.name ? 'border-red-500' : 'border-slate-100 focus:border-blue-600'}`}
                                            value={clientInfo.name} onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                                        />
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4">{errors.name}</p>}
                                    </div>

                                    {/* Phone Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="tel" placeholder="Mobile Number"
                                            className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-8 focus:outline-none transition-all font-bold text-lg ${errors.phone ? 'border-red-500' : 'border-slate-100 focus:border-blue-600'}`}
                                            value={clientInfo.phone} onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                                        />
                                        {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4">{errors.phone}</p>}
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="email" placeholder="Email Address"
                                            className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-8 focus:outline-none transition-all font-bold text-lg ${errors.email ? 'border-red-500' : 'border-slate-100 focus:border-blue-600'}`}
                                            value={clientInfo.email} onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                                        />
                                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4">{errors.email}</p>}
                                    </div>

                                    {/* Location Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="text" placeholder="Project Location"
                                            className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-8 focus:outline-none transition-all font-bold text-lg ${errors.location ? 'border-red-500' : 'border-slate-100 focus:border-blue-600'}`}
                                            value={clientInfo.location} onChange={(e) => setClientInfo({ ...clientInfo, location: e.target.value })}
                                        />
                                        {errors.location && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4">{errors.location}</p>}
                                    </div>

                                    <button
                                        onClick={handleAccessValuation}
                                        className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all uppercase tracking-widest mt-4 text-lg active:scale-95"
                                    >
                                        Access Valuation
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 text-center">
                                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-600 text-[10px] px-5 py-2 rounded-full font-black uppercase tracking-widest mb-10">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Valuation Certified
                                </div>
                                <h2 className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Total Estimated Valuation</h2>
                                <div className="text-[5rem] font-black text-blue-900 tracking-tighter mb-4 leading-none">
                                    ₹{estimate.toLocaleString('en-IN')}
                                </div>
                                {/* <p className="text-slate-400 text-sm mb-16 font-medium italic opacity-60">*Calibrated with 30% industrial service margins</p> */}

                                <div className="grid grid-cols-2 gap-6 mb-12">
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-left">
                                        <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mb-2">Project Volume</p>
                                        <p className="text-2xl font-black text-slate-800 tracking-tight">{formData.carpetArea} SQFT</p>
                                    </div>
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-left">
                                        <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mb-2">Execution Quality</p>
                                        <p className="text-2xl font-black text-blue-600 tracking-tight">{formData.finish}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {/* <button className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-xl transition-all uppercase tracking-widest flex items-center justify-center gap-4 group active:scale-95">
                                        <i className="fab fa-whatsapp text-2xl text-green-400 group-hover:scale-110 transition-transform"></i>
                                        Retrieve Technical BOQ
                                    </button> */}
                                    <button onClick={() => window.location.reload()} className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] py-4">Re-calibrate Audit</button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

// Internal Helper Components
const SummaryItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-white/40 text-[9px] uppercase font-black tracking-[0.2em] mb-1">{label}</p>
        <p className="text-lg font-bold tracking-tight">{value}</p>
    </div>
);

const Badge = ({ label }: { label: string }) => (
    <span className="bg-blue-600/20 text-blue-400 text-[10px] px-6 py-2 rounded-full font-black uppercase tracking-widest border border-blue-400/20 whitespace-nowrap">
        {label}
    </span>
);

export default PublicQuoteGenerator;





// To store your leads in Google Sheets without a backend, you'll use a Google Apps Script as a bridge. This script acts as a mini-server that receives your data and writes it to the sheet.

// Here is the step-by-step process:

// Step 1: Prepare the Google Sheet
// Create a new Google Sheet.

// Give it a name (e.g., Vertical_Living_Leads).

// On the first row, create these headers:

// A1: Date

// B1: Name

// C1: Phone

// D1: Email

// E1: Location

// F1: Carpet Area

// G1: Home Type

// H1: Finish Grade

// I1: Estimated Amount

// Step 2: Create the Apps Script
// In your Google Sheet, go to Extensions > Apps Script.

// Delete any existing code and paste this:

// JavaScript
// function doPost(e) {
//   try {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     var data = JSON.parse(e.postData.contents);
    
//     // Append a new row with the data sent from your React app
//     sheet.appendRow([
//       new Date(),       // Timestamp
//       data.name, 
//       "'" + data.phone, // Adding ' ensures phone numbers don't lose leading zeros
//       data.email, 
//       data.location, 
//       data.carpetArea, 
//       data.homeType, 
//       data.finish, 
//       data.estimate
//     ]);
    
//     // Return a success message
//     return ContentService.createTextOutput("Success")
//       .setMimeType(ContentService.MimeType.TEXT);
      
//   } catch (err) {
//     return ContentService.createTextOutput("Error: " + err)
//       .setMimeType(ContentService.MimeType.TEXT);
//   }
// }


//  change the untitled to give some name

//  and then save the changs


// Step 3: Deploy as a Web App
// This is the most important part to make it work with your React code:

// Click the blue Deploy button > New deployment.

// Click the Select type (gear icon) and choose Web app.

// Description: Lead Capture API.

// Execute as: Me (your email).

// Who has access: Anyone (This allows the React app to send data even if the user isn't logged into Google).

// Click Deploy.

// Google will ask for permissions—click Authorize Access and select your account.

// Copy the Web App URL (It will look like https://script.google.com/macros/s/.../exec).



// Pro-Tip for the Google Sheet
// Even with the script, Google Sheets sometimes tries to "guess" the date format. To be 100% safe:

// Select Column A in your Google Sheet.

// Go to Format > Number > Custom date and time.

// Choose or type Day/Month/Year.







//  not for google script

//  THIS IS EXAMPLE OF HOW THE QUOTE IS GETTING CALCUALTED

// 1. The INPUTS

// Area ($A$): 1000 
// sqftMaterial Rate ($R_m$): ₹950 (Standard Grade)
// Labour Salary ($S$): ₹2,000 per day
// Labour Density ($D$): 0.125 days per sqft (This means 1000 sqft requires 125 man-days)
// Complexity Multiplier ($C$): 1.15 (for 2 BHK)
// Profit Margin ($P$): 1.30 (30% added)



// Step-by-Step Calculation

// Step A: Calculate Material Base Cost
// 1000 SQft X ₹950 = ₹9,50,000

// Step B: Calculate Total Labour CostFirst, we find the total days needed (1000 x 0.125 = 125days), then multiply by the salary: 
// 125 X ₹2,000 = ₹2,50,000

// Step C: Subtotal (Materials + Labour)
//  ₹9,50,000 + ₹2,50,000 = ₹12,00,000

// Step D: Apply Complexity (2 BHK Factor) Since it's a 2 BHK, the complexity is 15% higher than a basic 1 BHK 
// ₹12,00,000 x 1.15 = ₹13,80,000

// Step E: Final Estimate (Add 30% Profit)This is where the company's service fee and profit are added
// ₹13,80,000 x 1.30 = ₹17,94,000