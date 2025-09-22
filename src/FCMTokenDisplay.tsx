import React, { useState, useEffect } from 'react';
  import { NotificationService } from './NotificationService';

  const FCMTokenDisplay: React.FC = () => {
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initStatus, setInitStatus] = useState('Starting...');

    const initializeFCM = async () => {
      setLoading(true);
      setError(null);
      try {
        setInitStatus('Initializing FCM...');
        console.log('🚀 Starting FCM initialization...');
        const token = await NotificationService.init();
        setFcmToken(token);
        if (token) {
          setInitStatus('✅ FCM Ready');
          setError(null);
        } else {
          setInitStatus('❌ FCM Failed');
          const isLocalhost = window.location.hostname === 'localhost';
          setError(
            isLocalhost 
              ? 'FCM token not available on localhost. Try production build or use test notifications.'
              : 'Failed to get FCM token. Check console for details.'
          );
        }
      } catch (err) {
        console.error('FCM initialization error:', err);
        setInitStatus('❌ Error');
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      initializeFCM();
    }, []);

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        console.log('✅ Token copied to clipboard');
      } catch (err) {
        console.error('❌ Failed to copy token:', err);
        setError('Failed to copy token to clipboard');
      }
    };

    const sendTestNotification = () => {
      NotificationService.notify('🧪 Test Notification', 'This is a test message!');
    };

    if (loading) {
      return (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🔄 {initStatus}</h2>
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Setting up Firebase Cloud Messaging...
          </p>
        </div>
      );
    }

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">🔥 Firebase Cloud Messaging</h2>
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800">📊 Status: {initStatus}</h4>
          <p className="text-blue-600 text-sm">
            Environment: {window.location.hostname === 'localhost' ? 'Development (localhost)' : 'Production'}
          </p>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-yellow-800 font-medium">⚠️ Notice</h3>
            <p className="text-yellow-700 text-sm mt-1">{error}</p>
            <button
              onClick={initializeFCM}
              className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        )}
        {fcmToken ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎫 FCM Token:
              </label>
              <div className="relative">
                <textarea
                  value={fcmToken}
                  readOnly
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-md font-mono resize-none"
                  rows={4}
                />
                <button
                  onClick={() => copyToClipboard(fcmToken)}
                  className={`absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={sendTestNotification}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                🔔 Test Notification
              </button>
              <button
                onClick={() => copyToClipboard(fcmToken)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {copied ? '✅ Copied!' : '📋 Copy Token'}
              </button>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-800">🎯 Send Push Notification</h4>
              <p className="text-green-700 text-sm mt-1">
                Token ready! Use Firebase Console → Cloud Messaging → Send test message
              </p>
              <p className="text-green-600 text-xs mt-2">
                Token length: {fcmToken.length} characters
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={sendTestNotification}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                🔔 Test Local Notification
              </button>
              <button
                onClick={initializeFCM}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                🔄 Retry FCM Setup
              </button>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-gray-800">💡 Tips</h4>
              <ul className="text-gray-600 text-sm mt-1 space-y-1">
                <li>• FCM tokens may not work on localhost in development</li>
                <li>• Try building for production: <code className="bg-gray-200 px-1 rounded">npm run build</code></li>
                <li>• Test notifications should still work locally</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default FCMTokenDisplay;