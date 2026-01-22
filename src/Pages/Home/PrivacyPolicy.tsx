
import { COMPANY_DETAILS } from '../../constants/constants';

const PrivacyPolicy = () => {
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
            href="/home"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        <article className="max-w-7xl mx-auto">

          {/* Page Title */}
          <div className="mb-10 border-b-2 border-blue-50 pb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-2">
              Privacy Policy
            </h1>
          </div>

          {/* Introduction */}
          <div className="space-y-6 text-base md:text-lg leading-relaxed text-slate-700">
            <p>
              <strong>{COMPANY_DETAILS.COMPANY_NAME}</strong> ("we", "our", "us") is an interior design and construction services company operating in India. We are committed to protecting the privacy and personal data of our clients, website visitors, app users, and leads generated through advertising platforms including Meta (Facebook & Instagram).
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, store, and protect personal information in compliance with applicable Indian laws, including the <strong>Information Technology Act, 2000</strong>, <strong>IT Rules, 2011</strong>, and the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, and aligns with standard global privacy practices.
            </p>

            <p>
              published by <strong>RAMS TECH CIRCLE OPC PVT LTD</strong>
            </p>

            <p>
              This Privacy Policy applies to the <strong>{COMPANY_DETAILS.COMPANY_NAME}</strong> mobile application, our website <strong>houseofram.in</strong>
            </p>


            {/* 1. Scope */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">1. Scope of This Policy</h2>
              <p className="mb-4">This Privacy Policy applies to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Our website</li>
                <li>Our mobile application (if applicable)</li>
                <li>Lead forms, including Meta Ads lead forms</li>
                <li>Customer communications (calls, WhatsApp, email, SMS)</li>
                <li>Offline data collected during site visits or consultations</li>
              </ul>
              <p className="mt-4">
                By accessing or using our services, you consent to the terms of this Privacy Policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">2. Information We Collect</h2>
              <p className="mb-4">We may collect the following categories of personal data:</p>

              <div className="space-y-6">
                <div>
                  <strong className="block text-slate-900 mb-2">a) Personal Identification Information</strong>
                  <ul className="list-disc pl-6 space-y-1 marker:text-blue-500">
                    <li>Name</li>
                    <li>Phone number</li>
                    <li>Email address</li>
                    <li>City / location</li>
                  </ul>
                </div>

                <div>
                  <strong className="block text-slate-900 mb-2">b) Service-Related Information</strong>
                  <ul className="list-disc pl-6 space-y-1 marker:text-blue-500">
                    <li>Property details shared for design or construction purposes</li>
                    <li>Budget preferences</li>
                    <li>Design requirements</li>
                  </ul>
                </div>

                <div>
                  <strong className="block text-slate-900 mb-2">c) Technical & Usage Information</strong>
                  <ul className="list-disc pl-6 space-y-1 marker:text-blue-500">
                    <li>IP address</li>
                    <li>Device information</li>
                    <li>Browser type</li>
                    <li>Cookies and tracking pixels (including Meta Pixel)</li>
                  </ul>
                </div>

                <div>
                  <strong className="block text-slate-900 mb-2">d) Marketing & Lead Information</strong>
                  <ul className="list-disc pl-6 space-y-1 marker:text-blue-500">
                    <li>Information submitted via Meta Ads, Google Ads, website forms, or app forms</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
              </div>

              <p className="mt-6">
                We do not knowingly collect sensitive personal data such as biometric data, financial passwords, or government-issued IDs unless legally required.
              </p>
            </section>

            {/* 3. Purpose */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">3. Purpose of Data Collection</h2>
              <p className="mb-4">We collect and process personal data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>To contact you regarding interior design and related services</li>
                <li>To provide quotations, designs, and consultations</li>
                <li>To manage customer relationships and service delivery</li>
                <li>To improve our website, app, and services</li>
                <li>To run and optimize advertising campaigns</li>
                <li>To comply with legal and regulatory obligations</li>
              </ul>
            </section>

            {/* 4. Legal Basis */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">4. Legal Basis for Processing</h2>
              <p className="mb-4">We process personal data based on:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Your consent (explicit or implied)</li>
                <li>Performance of a contract or service request</li>
                <li>Legitimate business interests</li>
                <li>Legal compliance under applicable laws</li>
              </ul>
            </section>

            {/* 5. Data Sharing */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">5. Data Sharing & Disclosure</h2>
              <p className="mb-4">We do not sell personal data. We may share information only with:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Advertising platforms (e.g., Meta, Google) for lead generation and analytics</li>
                <li>Service providers (CRM tools, cloud storage, marketing agencies)</li>
                <li>Legal or regulatory authorities if required by law</li>
              </ul>
              <p className="mt-4">
                All third parties are contractually obligated to maintain data confidentiality and security.
              </p>
            </section>

            {/* 6. Cookies */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">6. Cookies & Tracking Technologies</h2>
              <p className="mb-4">We use cookies, pixels, and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Analyze website traffic</li>
                <li>Measure ad performance</li>
                <li>Improve user experience</li>
              </ul>
              <p className="mt-4">
                You may control cookies through your browser settings.
              </p>
            </section>

            {/* 7. Data Retention */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">7. Data Retention</h2>
              <p className="mb-4">We retain personal data only for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Fulfill the purpose for which it was collected</li>
                <li>Comply with legal, accounting, or regulatory requirements</li>
              </ul>
              <p className="mt-4">
                When data is no longer required, it is securely deleted or anonymized.
              </p>
            </section>

            {/* 8. Data Security */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">8. Data Security</h2>
              <p className="mb-4">
                We implement reasonable administrative, technical, and physical safeguards to protect personal data against:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Unauthorized access</li>
                <li>Loss</li>
                <li>Misuse</li>
                <li>Alteration or disclosure</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            {/* 9. User Rights */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">9. User Rights (DPDP Act, 2023)</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li>Access your personal data</li>
                <li>Request correction or updating of data</li>
                <li>Withdraw consent</li>
                <li>Request deletion of data (subject to legal requirements)</li>
                <li>Raise grievances regarding data processing</li>
              </ul>
              <p className="mt-4">
                Requests can be made using the contact details below.
              </p>
            </section>

            {/* 10. Children */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">10. Children’s Privacy</h2>
              <p>
                Our services are not directed at individuals under 18 years of age. We do not knowingly collect personal data from minors.
              </p>
            </section>

            {/* 11. Third Party Links */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">11. Third-Party Links</h2>
              <p>
                Our website or app may contain links to third-party websites. We are not responsible for their privacy practices.
              </p>
            </section>

            {/* 12. Updates */}
            <section className="pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">12. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date.
              </p>
            </section>


            <section className="pt-12 mt-4 border-t border-blue-50">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                13. Account & Data Deletion
              </h2>

              <p className="mb-4">
                Users have the right to request deletion of their account and associated personal data from the {COMPANY_DETAILS.COMPANY_NAME} platform.
              </p>

              <p className="mb-4">
                Account deletion requests are reviewed and processed by an administrator to prevent unauthorized or accidental deletion.
              </p>

              <p className="mb-4">
                To request account deletion, users must send an email from their registered email address to:
              </p>

              <a href="mailto:ramstechcircle@gmail.com" className="mb-4 block font-semibold text-blue-700 hover:text-blue-800">
                ramstechcircle@gmail.com
              </a>

              <p className="mb-4">
                Please include your registered name, email address, and phone number in the request for verification purposes.
              </p>

              <p className="mb-4">
                Upon successful verification, personal data including account information, will be permanently deleted within <strong>7 working days</strong>
              </p>

              <p className="text-sm text-slate-600">
                For more details, users may visit our
                <a
                  href="/account-deletion"
                  className="text-blue-600 underline ml-1"
                >
                  Account Deletion page
                </a>.
              </p>
            </section>

            {/* 14. Contact Information */}
            <section className="pt-12 mt-4 border-t border-blue-50">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">14. Contact Information</h2>
              <div className="text-lg">
                <p className="font-bold text-slate-900 mb-2">{COMPANY_DETAILS.COMPANY_NAME}</p>
                {/* <p className="mb-2">No-22, 13th Main Road, Anna Nagar West, Chennai-600040</p> */}
                <p className="mb-2">13th, Main Road,anna Nagar West, Anna Nagar (chennai), <br /> Chennai, Egmore Nungambakkam, Tamil Nadu, India, 600040.</p>
                <p className="mb-2">
                  <span className="font-semibold">Email: </span>
                  <a href="mailto:ramstechcircle@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                    ramstechcircle@gmail.com
                  </a>
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Phone: </span>
                  <a href="tel:+919363993814" className="text-blue-600 hover:text-blue-800 underline">
                    +91 93639 93814
                  </a>
                </p>
                <p className="text-slate-500 text-base">
                  For privacy-related concerns or data requests, please contact us at the above details.
                </p>
              </div>
            </section>



          </div>
        </article>
      </main>

    </div>
  )
}

export default PrivacyPolicy;