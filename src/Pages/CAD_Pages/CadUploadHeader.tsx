import React from 'react'


type props = {
    step: number
    localExtractionData:any,
    handleStep:(step:1 | 2)=> void
}
const CadUploadHeader: React.FC<props> = ({ step, handleStep, localExtractionData }) => {
    return (
        <div>
            <header className="w-full flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center tracking-tight">
                        <i className="fas fa-wand-magic-sparkles mr-3 text-blue-600"></i>
                        Project <span className="ml-2 text-blue-600">Estimator</span>
                    </h1>

                    {/* Breadcrumbs replacing the P tag */}
                    <nav className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                        {/* Step 1: Clickable if we have data or are already on step 1 */}
                        <span
                            onClick={() => handleStep(1)}
                            className={`flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-all ${step === 1 ? "text-blue-600" : "text-emerald-500"
                                }`}
                        >
                            <i className={`fa-solid ${step > 1 ? "fa-circle-check" : "fa-circle-1"}`}></i>
                            <span>Upload PDF</span>
                        </span>

                        <i className="fa-solid fa-chevron-right text-gray-300 text-[8px]"></i>

                        {/* Step 2: Clickable only if localExtractionData exists */}
                        <span
                            onClick={() => {
                                if (localExtractionData) handleStep(2);
                            }}
                            className={`flex items-center gap-1.5 transition-all ${localExtractionData ? "cursor-pointer hover:text-blue-500" : "cursor-not-allowed opacity-50"
                                } ${step === 2 ? "text-blue-600" : "text-gray-300"}`}
                        >
                            <i className="fa-solid fa-circle-2"></i>
                            <span>Calculation Engine</span>
                        </span>
                    </nav>
                </div>

                {/* Actions - Clean transparent buttons */}
                <div className="flex gap-3">
                    {step === 2 && (
                        <button
                            onClick={() => handleStep(1)}
                            className="text-gray-500 hover:text-blue-600 text-xs font-bold transition-all flex items-center gap-2 px-2"
                        >
                            <i className="fa-solid fa-arrow-rotate-left"></i>
                            <span>Change Source</span>
                        </button>
                    )}

                    {step === 1 && localExtractionData && (
                        <button
                            onClick={() => handleStep(2)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
                        >
                            <span>Continue to Results</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    )}
                </div>
            </header>
        </div>
    )
}

export default CadUploadHeader