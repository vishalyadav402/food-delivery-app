"use client"
import ClientLayout from '@/app/ClientLayout';
import React from 'react';

const page = () => {
  return (
    <ClientLayout>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        {/* FAQ Section */}
        <div className="space-y-6">
          {/* Question 1 to 4 already added above */}
          {/* Question 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              1. What is kirananeeds?
            </h2>
            <p className="text-gray-600">
            kirananeeds is a fast and convenient way to order groceries and daily essential products online. We deliver your orders within a short time frame, ensuring you get what you need without delay.
            </p>
          </div>

          {/* Question 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              2. Which areas do you currently serve?
            </h2>
            <p className="text-gray-600">
              As of now, we are operational in select locations. Please check delivery locations on our web portal to check if we deliver to your location.
            </p>
          </div>

          {/* Question 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              3. How do I place an order?
            </h2>
            <div className="text-gray-600">
              <p>To place an order:</p>
              <ol className="list-decimal list-inside mt-2 text-gray-600">
                <li>Visit our web portal.</li>
                <li>Browse through the categories or use the search bar to find products.</li>
                <li>Add items to your cart.</li>
                <li>Proceed to checkout, enter your delivery address, and select a payment method.</li>
                <li>Confirm your order.</li>
              </ol>
            </div>
          </div>

          {/* Add more questions similarly */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              4. What payment methods do you accept?
            </h2>
            <div className="text-gray-600">
              <p>We accept various payment methods, including:</p>
              <ul className="list-disc list-inside mt-2">
                <li>UPI / Digital Wallets (e.g., Paytm, PhonePe, etc.)</li>
                <li>Cash on Delivery (COD) - <em>Subject to availability</em></li>
              </ul>
            </div>
          </div>
          {/* Question 5 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              5. How long does delivery take?
            </h2>
            <p className="text-gray-600">
              We aim to deliver your order within <strong>60-90 minutes</strong> from the time of order confirmation. Delivery times may vary depending on your location and order volume.
            </p>
          </div>

          {/* Question 6 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              6. Is there a minimum order value?
            </h2>
            <p className="text-gray-600">
              Yes, there is a minimum order value of <strong>₹199</strong> for all orders. This helps us maintain efficiency and provide quick delivery services.
            </p>
          </div>

          {/* Question 7 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              7. Can I schedule a delivery for later?
            </h2>
            <p className="text-gray-600">
              Currently, we only offer instant delivery services. You can place your order, and we’ll deliver it as quickly as possible.
            </p>
          </div>

          {/* Question 8 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              8. What if I receive a damaged or incorrect item?
            </h2>
            <p className="text-gray-600">
              If you receive a damaged or incorrect item, please contact our customer support team within <strong>Business hours (8 AM - 6 PM)</strong> of delivery. We will either replace the item or issue a refund, depending on the situation.
            </p>
          </div>

          {/* Question 9 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              9. Can I cancel my order?
            </h2>
            <p className="text-gray-600">
              You can cancel your order before it has been processed for delivery. Once the order is out for delivery, cancellations may not be possible. Please contact customer support for assistance.
            </p>
          </div>

          {/* Question 10 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              10. Do you offer refunds?
            </h2>
            <div className="text-gray-600">
              <p>Refunds are processed in case of:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Cancelled orders</li>
                <li>Damaged or incorrect items</li>
                <li>Failed deliveries</li>
              </ul>
              Refunds will be credited to your original payment method within <strong>5-7 business days</strong>.
            </div>
          </div>

          {/* Question 11 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              11. How can I track my order?
            </h2>
            <p className="text-gray-600">
              Once your order is confirmed, you can log in to your account on the web portal to track your order in real-time.
            </p>
          </div>

          {/* Question 12 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              12. Are there any delivery charges?
            </h2>
            <p className="text-gray-600">
              Delivery charges may apply depending on your order value and location. However, we often run promotions with free delivery for orders above a certain amount. Check the web portal for current offers.
            </p>
          </div>

          {/* Question 13 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              13. Can I return products?
            </h2>
            <p className="text-gray-600">
              We accept returns for damaged, defective, or incorrect items. Please contact customer support within <strong>Business hours (8 AM - 6 PM)</strong> of delivery to initiate a return.
            </p>
          </div>

          {/* Question 14 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              14. How do I contact customer support?
            </h2>
            <div className="text-gray-600">
              <p>You can reach our customer support team via:</p>
              <ul className="list-disc list-inside mt-2">
                <li><strong>Email:</strong> support@kirananeeds.com</li>
                <li><strong>Whatsapp Chat:</strong> +91-9506280968</li>
                {/* <li><strong>Live Chat:</strong> Available on the web portal during business hours (8 AM - 6 PM).</li> */}
              </ul>
            </div>
          </div>

          {/* Question 15 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              15. Do you offer discounts or promotions?
            </h2>
            <p className="text-gray-600">
              Yes, we regularly offer discounts and promotions on our web portal. Keep an eye on the <strong>"Offers"</strong> section or subscribe to our newsletter to stay updated.
            </p>
          </div>

          {/* Question 16 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              16. Can I create an account?
            </h2>
            <p className="text-gray-600">
              Yes, you can create an account on our web portal to save your delivery addresses, track orders, and enjoy a faster checkout experience.
            </p>
          </div>

          {/* Question 17 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              17. Is my personal information secure?
            </h2>
            <p className="text-gray-600">
              We take your privacy seriously. All personal and payment information is encrypted and securely stored. We do not share your data with third parties without your consent.
            </p>
          </div>

          {/* Question 18 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              18. Do you sell organic or specialty products?
            </h2>
            <p className="text-gray-600">
              Yes, we offer a range of organic and specialty products. Use the filters on the web portal to browse these categories.
            </p>
          </div>

          {/* Question 19 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              19. Can I order in bulk?
            </h2>
            <p className="text-gray-600">
              For bulk orders, please contact our customer support team. We may be able to offer special pricing and delivery arrangements.
            </p>
          </div>

          {/* Question 20 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              20. What are your operating hours?
            </h2>
            <p className="text-gray-600">
              Our web portal is available <strong>24/7</strong> for placing orders. However, deliveries are made between <strong>(8 AM - 6 PM)</strong> daily.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            For any other queries, feel free to reach out to us. We’re here to make your shopping experience quick, easy, and enjoyable! 🛒🚀
          </p>
          <div className="mt-4">
            <a
              href="mailto:support@quickcommerce.com"
              className="text-blue-600 hover:underline"
            >
              support@kirananeeds.com
            </a>
            <span className="mx-2 text-gray-400">|</span>
            <a
              href="tel:+919506280968"
              className="text-blue-600 hover:underline"
            >
              +91-9506280968
            </a>
          </div>
        </div>
      </div>
    </div>
    </ClientLayout>
  );
};

export default page;