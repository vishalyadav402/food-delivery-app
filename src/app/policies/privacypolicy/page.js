"use client"
import ClientLayout from '@/app/ClientLayout';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <ClientLayout>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Privacy Policy
        </h1>

        {/* Last Updated */}
        <p className="text-gray-600 text-sm mb-8">
          <strong>Last Updated:</strong> 13 April 2025
        </p>

        {/* Introduction */}
        <p className="text-gray-700 mb-6">
          Welcome to <strong>kirananeeds</strong>! We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our web portal and services.
        </p>

        {/* Section 1: Information We Collect */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We may collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, delivery address, and payment details.</li>
            <li><strong>Order Information:</strong> Products purchased, order history, preferences, and feedback.</li>
            <li><strong>Technical Information:</strong> IP address, browser type, device information, cookies, and usage data.</li>
          </ul>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To process and deliver your orders.</li>
            <li>To communicate with you about your orders, account, or inquiries.</li>
            <li>To improve our services, website, and user experience.</li>
            <li>To send you promotional offers, discounts, and updates (if you have opted in).</li>
            <li>To comply with legal obligations and prevent fraudulent activities.</li>
          </ul>
        </div>

        {/* Section 3: How We Share Your Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. How We Share Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell or rent your personal information to third parties. However, we may share your information with:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Service Providers:</strong> Third-party vendors who assist us in delivering our services (e.g., payment processors, delivery partners).</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</li>
          </ul>
        </div>

        {/* Section 4: Data Security */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            We take data security seriously and implement appropriate measures to protect your information, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Encryption of sensitive data (e.g., payment information).</li>
            <li>Secure servers and firewalls.</li>
            <li>Regular security audits and updates.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </p>
        </div>

        {/* Section 5: Cookies and Tracking Technologies */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Enhance your browsing experience.</li>
            <li>Analyze website traffic and usage patterns.</li>
            <li>Remember your preferences and settings.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            You can manage or disable cookies through your browser settings. However, this may affect your ability to use certain features of our website.
          </p>
        </div>

        {/* Section 6: Your Rights */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Your Rights
          </h2>
          <p className="text-gray-700 mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Access:</strong> Request a copy of the information we hold about you.</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
            <li><strong>Deletion:</strong> Request deletion of your information, subject to legal obligations.</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us at <strong>support@kirananeeds.com</strong>.
          </p>
        </div>

        {/* Section 7: Third-Party Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. Third-Party Links
          </h2>
          <p className="text-gray-700">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. Please review their privacy policies before providing any personal information.
          </p>
        </div>

        {/* Section 8: Children’s Privacy */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            8. Children’s Privacy
          </h2>
          <p className="text-gray-700">
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware of such data, we will take steps to delete it.
          </p>
        </div>

        {/* Section 9: Changes to This Privacy Policy */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated 15 Feb 2025. We encourage you to review this policy periodically.
          </p>
        </div>

        {/* Section 10: Contact Us */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            10. Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Email:</strong> support@kirananeeds.com</li>
            <li><strong>Phone:</strong> +919506280968</li>
            {/* <li><strong>Address:</strong> </li> */}
          </ul>
        </div>
      </div>
    </ClientLayout>
  );
};

export default PrivacyPolicy;

// seo dynamic meta for Privacy Policy
// export const metadata = {
//   title: "Privacy Policy | VegaCart – Your Trustworthy Daily Essentials Delivery App",
//   other: {
//     title: [
//       "VegaCart – Data Privacy & Security Policy | Your Information is Safe With Us"
//     ]
//   },
//   description:
//     "At VegaCart, your privacy is our top priority. Learn how we collect, use, and protect your personal data when you shop for daily essentials through our quick delivery service in Jaunpur City.",
//   keywords: [
//     "VegaCart privacy policy",
//     "Data protection policy",
//     "User data safety",
//     "Personal information security",
//     "Privacy in grocery delivery app",
//     "Online delivery data use",
//     "VegaCart customer data protection",
//     "Grocery app privacy guidelines",
//     "Secure online shopping",
//     "Privacy policy Jaunpur grocery app"
//   ],
// };

