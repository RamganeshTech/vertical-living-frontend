import { COMPANY_DETAILS } from "../../constants/constants"

const WebDeletionInfo = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      
      {/* --- HEADER / NAVIGATION --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            aria-label="Back to Home"
          >
            <img 
              src={COMPANY_DETAILS.COMPANY_LOGO} 
              alt={`${COMPANY_DETAILS.COMPANY_NAME} Logo`} 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-blue-900 tracking-tight group-hover:text-blue-700 transition-colors">
              {COMPANY_DETAILS.COMPANY_NAME}
            </span>
          </a>
          
          <a 
            href="/" 
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        <article className="max-w-full mx-auto">
          
          {/* Page Title */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-4">
              Account & Data Deletion Request
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We respect your privacy. If you wish to delete your account and associated data from the {COMPANY_DETAILS.COMPANY_NAME} platform, please follow the instructions below.
            </p>
            This page applies to users of the <strong>{COMPANY_DETAILS.COMPANY_NAME}</strong> mobile application.
          </div>

          {/* INSTRUCTION CARD */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-10 mb-12">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">How to Request Deletion</h2>
            
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                To process your data deletion request efficiently and securely, please send an email to our support team.
              </p>
              
              <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</span>
                    <div>
                      <strong className="block text-slate-900">Email To</strong>
                      <span>Send an email to </span>
                      <a href={`mailto:ramstechcircle@gmail.com`} className="text-blue-600 font-semibold underline">
                        ramstechcircle@gmail.com
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</span>
                    <div>
                      <strong className="block text-slate-900">Subject Line</strong>
                      <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm text-slate-600">Request for Account Deletion</span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">3</span>
                    <div>
                      <strong className="block text-slate-900">Include Details</strong>
                      <p>Please include the following details in your email body so we can identify your account:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600">
                        <li>Registered Phone Number</li>
                        <li>Registered Email Address</li>
                        <li>Full Name</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="text-sm text-slate-500 bg-blue-100/50 p-4 rounded-lg">
                <strong>Note:</strong> We may contact you to verify your identity before deleting your account to prevent accidental deletion.
              </div>
            </div>
          </div>

          {/* FAQ / DETAILS SECTION */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* What Happens */}
            <section>
              <h3 className="text-xl font-bold text-blue-900 mb-3">What data will be deleted?</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Upon verification, the following data will be permanently removed from our active databases:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 marker:text-blue-500">
                <li>Your personal profile information (Name, Email, Phone).</li>
                <li>Saved addresses and preferences.</li>
                {/* <li>App usage history and logs.</li>
                <li>Marketing preferences and subscriptions.</li> */}
              </ul>
            </section>

            {/* What is Retained */}
            {/* <section>
              <h3 className="text-xl font-bold text-blue-900 mb-3">What data is retained?</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Certain data may be retained for a specific period to comply with legal obligations, such as:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 marker:text-blue-500">
                <li><strong>Transaction Records:</strong> Invoices and payment history for tax and accounting purposes.</li>
                <li><strong>Project History:</strong> Details of completed construction/design projects for warranty and service records.</li>
                <li><strong>Legal Compliance:</strong> Data required by Indian law (IT Act, etc.).</li>
              </ul>
            </section> */}

          </div>

          <hr className="border-blue-50 my-8" />

          {/* Timeline */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Processing Timeline</h3>
            <p className="text-slate-700 leading-relaxed">
              {/* Once we receive your request, our team will acknowledge receipt within <strong>7 days</strong>. The complete deletion process generally takes between <strong>14 to 30 days</strong>, depending on the complexity of your account data and any active services. */}
              Once we receive your request, our team will complete the deletion process within <strong>7 days</strong>.
            </p>
          </section>

          {/* Active Services Warning */}
          {/* <section className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠ Active Projects</h3>
            <p className="text-yellow-800/80">
              If you have an ongoing interior design or construction project with {COMPANY_DETAILS.COMPANY_NAME}, we cannot delete your account until the project is officially closed or transferred. Please contact your project manager before requesting deletion.
            </p>
          </section> */}

        </article>
      </main>

    </div>
  )
}

export default WebDeletionInfo