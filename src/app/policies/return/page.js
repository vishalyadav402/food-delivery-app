"use client"
import ClientLayout from '@/app/ClientLayout';
import React from 'react';

const PolicyPage = () => {
  return (
    <ClientLayout>
     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Pricing, Delivery, Return & Refund Policy</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Pricing</h2>
        <p>All prices are in INR and include applicable taxes. Prices are subject to change without notice.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Delivery</h2>
        <ul className="list-disc pl-5">
          <li>We offer FREE home delivery within a 5 km radius from our store.</li>
          <li>Delivery is typically completed within 30 minutes, subject to order volume and traffic conditions.</li>
          <li>Orders outside this radius are not accepted.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Return</h2>
        <p>Returns are accepted for damaged or incorrect items within 24 hours of delivery. The item must be in its original condition.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Refund</h2>
        <p>Upon approval of your return, refunds will be processed to your original payment method within 7 business days. No refunds for perishable goods unless they are damaged or incorrect.</p>
      </section>
    </div>
    </ClientLayout>
  );
};

export default PolicyPage;