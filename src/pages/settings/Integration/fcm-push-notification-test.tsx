import React from "react";
import FCMTokenDisplay from "../../../FCMTokenDisplay";

/**
 * fcm-push-notification-test
 * Test page for Firebase Cloud Messaging integration
 */
const FcmPushNotificationTest: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <section className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
          🚀 Wails + React + FCM Push Notification Test
        </h1>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <FCMTokenDisplay />
        </div>
      </section>
    </main>
  );
};

export default FcmPushNotificationTest;
