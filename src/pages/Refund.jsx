import React from 'react';

const Refund = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">Refund and Cancellation Policy</h1>
      <div className="space-y-4 text-gray-300">
        <p>Last updated: April 2026</p>
        <h2 className="text-xl font-semibold text-white mt-6">1. Cancellations</h2>
        <p>You can cancel your subscription at any time. Please note that you must cancel your subscription before it renews for a subsequent month in order to avoid being charged for the next month's subscription fee.</p>
        <h2 className="text-xl font-semibold text-white mt-6">2. Refunds</h2>
        <p>Payments are nonrefundable and there are no refunds or credits for partially used billing periods. Following any cancellation, however, you will continue to have access to the service through the end of your current billing period.</p>
        <h2 className="text-xl font-semibold text-white mt-6">3. Exceptions</h2>
        <p>At any time, and for any reason, we may provide a refund, discount, or other consideration to some or all of our members ("credits"). The amount and form of such credits, and the decision to provide them, are at our sole and absolute discretion.</p>
      </div>
    </div>
  );
};

export default Refund;
