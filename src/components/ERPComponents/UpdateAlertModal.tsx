import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { checkVersionInfo, checkLiveUpdate, restartApp, isAutoUpdateEnabled, VersionInfo } from "../../utilities/liveUpdate";
import { Capacitor } from "@capacitor/core";

interface UpdateAlertModalProps {
  onClose?: () => void;
}

const UpdateAlertModal: FC<UpdateAlertModalProps> = ({ onClose }) => {
  const { t } = useTranslation("main");
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Check if auto-update is enabled first
      // If enabled, don't show modal - updates happen automatically in background
      // If disabled, show modal so user can manually trigger update
      const checkForUpdates = async () => {
        try {
          const autoUpdateEnabled = await isAutoUpdateEnabled();
          console.log('[UpdateAlertModal] Auto-update enabled:', autoUpdateEnabled);

          // Only show modal if auto-update is DISABLED
          if (autoUpdateEnabled) {
            console.log('[UpdateAlertModal] Auto-update enabled, not showing modal');
            return;
          }

          // Auto-update disabled, check for updates and show modal if available
          const info = await checkVersionInfo();
          console.log('[UpdateAlertModal] Version info:', info);
          setVersionInfo(info);
          if (info.updateAvailable) {
            console.log('[UpdateAlertModal] Update available, showing modal');
            setIsVisible(true);
          }
        } catch (err) {
          console.error('[UpdateAlertModal] Error:', err);
        }
      };

      checkForUpdates();
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleUpdateNow = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      // Pass forceUpdate=true to bypass auto-update setting for manual updates
      const result = await checkLiveUpdate(undefined, true);
      if (result.downloaded) {
        setUpdateComplete(true);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isVisible || !versionInfo?.updateAvailable) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-4 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={!isUpdating ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("update_available") || "Update Available"}
            </h3>
          </div>
          {!isUpdating && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {updateComplete ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("update_restart_message") || "The app must be closed and reopened for the update to take effect."}
              </p>
              <button
                onClick={restartApp}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("ok") || "OK"}
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("new_version_available_message") || "A new version of the app is available."}
              </p>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("current_version") || "Current"}:
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {versionInfo.effectiveVersion || "0.0.0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("new_version") || "New"}:
                  </span>
                  <span className="font-medium text-primary">
                    {versionInfo.serverVersion || "N/A"}
                  </span>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {t("close") || "Close"}
                </button>
                <button
                  onClick={handleUpdateNow}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isUpdating ? (t("updating") || "Updating...") : (t("update_now") || "Update Now")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UpdateAlertModal;
