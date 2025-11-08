import { Keyboard, RefreshCw, AlertTriangle, Edit2, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getStorageString, setStorageString } from "../../../utilities/storage-utils";
import { useTranslation } from "react-i18next";

interface ShortcutConfig {
  event: string;
  key: string;
  description: string;
  action: () => void;
}

interface EditableShortcut {
  event: string;
  key: string;
  description: string;
}

interface ShortcutSettingsProps {
  defaultShortcuts: ShortcutConfig[];
  onShortcutsChange?: (shortcuts: ShortcutConfig[]) => void;
}

const ShortcutSettings: React.FC<ShortcutSettingsProps> = ({
  defaultShortcuts,
  onShortcutsChange,
}) => {

  const [shortcuts, setShortcuts] = useState<EditableShortcut[]>(() =>
    defaultShortcuts.map(({ event, key, description }) => ({
      event,
      key,
      description,
    }))
  );

  useEffect(() => {
    const fetchShortcuts = async () => {
      const savedShortcuts = await getStorageString("keyboard-shortcuts");
      if (savedShortcuts) {
        try {
          const parsed = JSON.parse(savedShortcuts);
          if (
            Array.isArray(parsed) &&
            parsed.every(
              (s) =>
                typeof s.event === "string" &&
                typeof s.key === "string" &&
                typeof s.description === "string"
            )
          ) {
            setShortcuts(parsed);
          }
        } catch (err) {
          console.error("Failed to parse shortcuts:", err);
        }
      }
    };

    fetchShortcuts();
  }, []);


  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation("main");
  const [serialNumbers, setSerialNumbers] = useState<number[]>(() =>
    shortcuts.map((_, index) => index + 1)
  );

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    shortcutIndex: number
  ) => {
    event.preventDefault();

    const keys: string[] = [];
    if (event.ctrlKey) keys.push("ctrl");
    if (event.shiftKey) keys.push("shift");
    if (event.altKey) keys.push("alt");

    const key = event.key.toLowerCase();
    if (!["control", "shift", "alt"].includes(key)) {
      keys.push(key);
    }

    if (keys.length === 0) return;

    const newShortcut = keys.join("+");

    const isDuplicate = shortcuts.some(
      (s, idx) => idx !== shortcutIndex && s.key === newShortcut
    );

    if (isDuplicate) {
      setError("This shortcut is already in use");
      setSuccess(null);
      return;
    }

    setError(null);
    const newShortcuts = [...shortcuts];
    newShortcuts[shortcutIndex] = {
      ...newShortcuts[shortcutIndex],
      key: newShortcut,
    };
    // Update serial numbers based on change
    const newSerialNumbers = [...serialNumbers];
    const previousKey = shortcuts[shortcutIndex].key;
    const newKey = newShortcut;

    if (newKey.split("+").length > previousKey.split("+").length) {
      // Shortcut became more complex
      newSerialNumbers[shortcutIndex] += 1;
    } else if (newKey.split("+").length < previousKey.split("+").length) {
      // Shortcut became less complex
      newSerialNumbers[shortcutIndex] -= 1;
    }

    setShortcuts(newShortcuts);
    setSerialNumbers(newSerialNumbers);
  };


  useEffect(() => {
    const saveShortcuts = async () => {
      try {
        if (error) return;

        await setStorageString("keyboard-shortcuts", JSON.stringify(shortcuts));

        window.dispatchEvent(
          new CustomEvent("shortcuts-updated", {
            detail: { shortcuts },
          })
        );

        onShortcutsChange?.(
          defaultShortcuts.map((shortcut) => {
            const updatedShortcut = shortcuts.find(
              (s) => s.event === shortcut.event
            );
            return updatedShortcut
              ? { ...shortcut, key: updatedShortcut.key }
              : shortcut;
          })
        );

        setSuccess("Shortcuts updated successfully");
        setIsVisible(true);

        const showTimer = setTimeout(() => {
          setIsVisible(false);
        }, 2000);

        const removeTimer = setTimeout(() => {
          setSuccess(null);
        }, 2300);

        return () => {
          clearTimeout(showTimer);
          clearTimeout(removeTimer);
        };
      } catch (err) {
        console.error("Failed to save shortcuts:", err);
      }
    };

    saveShortcuts();
  }, [shortcuts, defaultShortcuts, onShortcutsChange, error]);


  const resetToDefaults = () => {
    setShortcuts(
      defaultShortcuts.map(({ event, key, description }) => ({
        event,
        key,
        description,
      }))
    );
    setSerialNumbers(shortcuts.map((_, index) => index + 1));
    setError(null);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 dark:bg-dark-bg bg-white relative">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold dark:text-dark-label text-gray-800 flex items-center gap-2 sm:gap-3">
          <Keyboard className="dark:text-dark-text text-black" size={24} />
          Keyboard Shortcuts
        </h1>
        {/* <button
          onClick={resetToDefaults}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-300"
        >
          <RefreshCw size={16} />
          Reset to Defaults
        </button> */}
      </div>

      <div className="h-10 mb-4 fixed top-[15%] left-2 right-2 sm:left-0 sm:right-0 z-50">
        {error && (
          <div className="flex items-center justify-center w-full sm:w-fit mx-auto gap-2 sm:gap-3 bg-[#fef2f2] text-[#b91c1c] p-2 sm:p-3 rounded-md border border-[#fecaca] animate-pulse text-sm sm:text-base">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div
            className={`flex items-center justify-center w-full sm:w-fit mx-auto gap-2 sm:gap-3 bg-[#f0fdf4] text-[#166534] p-2 sm:p-3 rounded-md border border-[#bbf7d0] transition-all duration-300 text-sm sm:text-base
              ${isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
              }
            `}
          >
            <CheckCircle size={20} />
            {success}
          </div>
        )}
      </div>

      <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md min-w-[640px]">
          <thead>
            <tr className="dark:bg-dark-bg-header bg-[#eff6ff] dark:text-dark-label text-gray-700">
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-b border-gray-200">
                SI.NO
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-b border-gray-200">
                Description
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-b border-gray-200">
                Event
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-b border-gray-200">
                Shortcut
              </th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map((shortcut, index) => (
              <tr
                key={shortcut.event}
                className="hover:dark:bg-dark-bg-header hover:bg-[#eff6ff] transition-colors duration-200"
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3 dark:text-dark-text text-gray-900 border-b border-gray-200 font-bold text-xs sm:text-base">
                  {serialNumbers[index]}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-base dark:text-dark-text">
                  {t(shortcut.description)}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-base dark:text-dark-text">
                  {t(shortcut.event)}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-right">
                  <div className="w-32 sm:w-40 h-8 sm:h-10 relative">
                    {editingKey === shortcut.event ? (
                      <input
                        type="text"
                        value={shortcut.key}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onBlur={() => setEditingKey(null)}
                        autoFocus
                        className="absolute inset-0 w-full h-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base text-center border dark:bg-dark-bg-header dark:text-dark-text border-[#93c5fd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300"
                        placeholder="Press keys..."
                        readOnly
                      />
                    ) : (
                      <button
                        onClick={() => setEditingKey(shortcut.event)}
                        className="absolute inset-0 w-full h-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base dark:bg-dark-bg-header bg-white dark:text-dark-text text-gray-700 border border-gray-300 rounded-md hover:shadow-md transition-all duration-300 ease-in-out"
                      >
                        <Edit2 size={14} className="text-gray-500" />
                        {shortcut.key}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShortcutSettings;