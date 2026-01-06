import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPButton from "./erp-button";
import { checkVersionInfo, checkLiveUpdate, restartApp, VersionInfo } from "../../utilities/liveUpdate";
import { Capacitor } from "@capacitor/core";

interface UpdateAvailableCardProps {
  onUpdateComplete?: () => void;
}

const UpdateAvailableCard: FC<UpdateAvailableCardProps> = ({ onUpdateComplete }) => {
  const { t } = useTranslation("main");
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestartAlert, setShowRestartAlert] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      checkVersionInfo().then(setVersionInfo).catch(console.error);
    }
  }, []);

  const handleManualUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      // Pass forceUpdate=true to bypass auto-update setting for manual updates
      const result = await checkLiveUpdate(undefined, true);
      if (result.downloaded) {
        setUpdateComplete(true);
        setShowRestartAlert(true);
        onUpdateComplete?.();
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRestartApp = async () => {
    await restartApp();
  };

  // Don't show if not native platform or no update available
  if (!Capacitor.isNativePlatform() || !versionInfo?.updateAvailable) {
    return null;
  }

  return (
    <div className="box custom-box border-primary/20 bg-primary/5">
      <div className="box-header justify-between">
        <div className="box-title text-primary">
          {t("update_available") || "Update Available"}
        </div>
      </div>
      <div className="box-body">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              {t("current_version") || "Current Version"}:
            </span>
            <span className="font-semibold">
              {versionInfo.effectiveVersion || "0.0.0"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              {t("new_version") || "New Version"}:
            </span>
            <span className="font-semibold text-primary">
              {versionInfo.serverVersion || "N/A"}
            </span>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {t("update_error") || "Error"}: {error}
            </div>
          )}

          {updateComplete ? (
            <div className="mt-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 text-sm mb-3">
                {t("update_restart_message") || "The app must be closed and reopened for the update to take effect."}
              </div>
              <ERPButton
                title={t("ok") || "OK"}
                variant="primary"
                onClick={handleRestartApp}
                className="w-full"
              />
            </div>
          ) : (
            <ERPButton
              title={isUpdating ? (t("updating") || "Updating...") : (t("update_now") || "Update Now")}
              variant="primary"
              onClick={handleManualUpdate}
              loading={isUpdating}
              disabled={isUpdating}
              className="mt-3 w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateAvailableCard;
