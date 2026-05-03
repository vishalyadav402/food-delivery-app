"use client"
import ClientLayout from '@/app/ClientLayout';
import React from 'react';

const page = () => {
  return (
    <ClientLayout>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Disclaimer
        </h1>

        {/* Last Updated */}
        <p className="text-gray-600 text-sm mb-8">
          <strong>Last Updated:</strong> 13 April 2025
        </p>

        {/* Introduction */}
        <p className="text-gray-700 mb-6">
          The information provided on the <strong>kirananeeds</strong> web portal is for general informational purposes only. While we strive to ensure the accuracy and reliability of the information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the products, services, or related information.
        </p>

        {/* Section 1: Product Availability */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Product Availability
          </h2>
          <p className="text-gray-700">
            - Product availability is subject to change without notice.
            <br />
            - We are not responsible for any out-of-stock items or delays caused by suppliers.
          </p>
        </div>

        {/* Section 2: Pricing and Errors */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Pricing and Errors
          </h2>
          <p className="text-gray-700">
            - Prices are subject to change without notice.
            <br />
            - In the event of a pricing error, we reserve the right to cancel or refuse orders.
          </p>
        </div>

        {/* Section 3: Third-Party Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Third-Party Links
          </h2>
          <p className="text-gray-700">
            Our platform may contain links to third-party websites. We do not endorse or assume responsibility for the content or practices of these websites.
          </p>
        </div>

        {/* Section 4: Limitation of Liability */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Limitation of Liability
          </h2>
          <p className="text-gray-700">
          kirananeeds shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services or inability to use our services.
          </p>
        </div>

        {/* Section 5: External Factors */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. External Factors
          </h2>
          <p className="text-gray-700">
            We are not responsible for delays or failures caused by factors beyond our control, such as natural disasters, strikes, or technical issues.
          </p>
        </div>

        {/* Conclusion */}
        <p className="text-gray-700">
          By using our platform, you acknowledge and agree to this disclaimer. If you do not agree, please refrain from using our services.
        </p>
      </div>
    </ClientLayout>
  );
};

export default page;