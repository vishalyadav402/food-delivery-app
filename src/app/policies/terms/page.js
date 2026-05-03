"use client"
import ClientLayout from '@/app/ClientLayout';
import React from 'react';

const page = () => {
  return (
    <ClientLayout>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Terms and Conditions
        </h1>

        {/* Last Updated */}
        <p className="text-gray-600 text-sm mb-8">
          <strong>Last Updated:</strong> 13 April 2025
        </p>

        {/* Introduction */}
        <p className="text-gray-700 mb-6">
          Welcome to <strong>kirananeeds</strong>! These Terms and Conditions govern your use of our web portal and services. By accessing or using our platform, you agree to comply with and be bound by these terms. Please read them carefully.
        </p>

        {/* Section 1: Acceptance of Terms */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700">
            By using our web portal, you confirm that you are at least 18 years old and agree to these Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </div>

        {/* Section 2: Services Offered */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Services Offered
          </h2>
          <p className="text-gray-700">
          kirananeeds provides an online platform for ordering groceries and daily essential products. We deliver to select pincodes as specified on our web portal.
          </p>
        </div>

        {/* Section 3: Account Registration */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Account Registration
          </h2>
          <p className="text-gray-700 mb-4">
            To place orders, you may need to create an account. You agree to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Provide accurate and complete information.</li>
            <li>Keep your login credentials secure.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
          </ul>
        </div>

        {/* Section 4: Order Placement and Payment */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Order Placement and Payment
          </h2>
          <p className="text-gray-700 mb-4">
            - Orders are subject to product availability.
            <br />
            - You agree to provide accurate delivery details.
            <br />
            - Payment can be made via UPI / digital wallets, or cash on delivery (COD).
            <br />
            - We reserve the right to cancel orders in case of pricing errors, stock unavailability, or suspicious activity.
          </p>
        </div>

        {/* Section 5: Delivery */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Delivery
          </h2>
          <p className="text-gray-700 mb-4">
            - We aim to deliver orders within <strong>60-90 minutes</strong> of confirmation.
            <br />
            - Delivery times may vary based on location and order volume.
            <br />
            - You must ensure someone is available to accept the delivery at the specified address.
          </p>
        </div>

        {/* Section 6: Cancellations and Refunds */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Cancellations and Refunds
          </h2>
          <p className="text-gray-700 mb-4">
            - You may cancel orders before they are processed for delivery.
            <br />
            - Refunds are processed for cancelled orders, damaged/incorrect items, or failed deliveries.
            <br />
            - Refunds will be credited to your original payment method within <strong>5-7 business days</strong>.
          </p>
        </div>

        {/* Section 7: User Responsibilities */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. User Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            You agree not to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Use the platform for illegal or unauthorized purposes.</li>
            <li>Upload harmful or offensive content.</li>
            <li>Interfere with the platform’s functionality or security.</li>
          </ul>
        </div>

        {/* Section 8: Intellectual Property */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            8. Intellectual Property
          </h2>
          <p className="text-gray-700">
            All content on the platform (e.g., logos, text, images) is owned by kirananeeds and protected by intellectual property laws. You may not use, copy, or distribute any content without our prior written consent.
          </p>
        </div>

        {/* Section 9: Limitation of Liability */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-700">
          kirananeeds is not liable for:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Delays or failures due to circumstances beyond our control (e.g., natural disasters, strikes).</li>
            <li>Indirect, incidental, or consequential damages arising from the use of our services.</li>
          </ul>
        </div>

        {/* Section 10: Termination */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            10. Termination
          </h2>
          <p className="text-gray-700">
            We reserve the right to suspend or terminate your account and access to our services at our discretion, without prior notice, for violations of these terms.
          </p>
        </div>

        {/* Section 11: Governing Law */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            11. Governing Law
          </h2>
          <p className="text-gray-700">
            These Terms and Conditions are governed by the laws of <strong>India / Uttar Pradesh</strong>. Any disputes will be resolved in the courts of <strong> State Court</strong>.
          </p>
        </div>

        {/* Section 12: Changes to Terms */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            12. Changes to Terms
          </h2>
          <p className="text-gray-700">
            We may update these Terms and Conditions from time to time. Any changes will be posted on this page with an updated "Last Updated" date. Continued use of our services constitutes acceptance of the revised terms.
          </p>
        </div>

        {/* Section 13: Contact Us */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            13. Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about these Terms and Conditions, please contact us at:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Email:</strong> support@kirananeeds.com</li>
            <li><strong>Phone:</strong> +91-9506280968</li>
            {/* <li><strong>Address:</strong> [Insert Company Address]</li> */}
          </ul>
        </div>
      </div>
    </ClientLayout>
  );
};

export default page;