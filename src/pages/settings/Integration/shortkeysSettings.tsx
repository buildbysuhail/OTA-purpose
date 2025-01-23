import {
  Keyboard,
  RefreshCw,
  AlertTriangle,
  Edit2,
  CheckCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

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
  const [shortcuts, setShortcuts] = useState<EditableShortcut[]>(() => {
    const savedShortcuts = localStorage.getItem("keyboard-shortcuts");
    if (savedShortcuts) {
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
        return parsed;
      }
    }
    return defaultShortcuts.map(({ event, key, description }) => ({
      event,
      key,
      description,
    }));
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
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
    try {
      if (error) return;

      localStorage.setItem("keyboard-shortcuts", JSON.stringify(shortcuts));
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
    } catch (error) {
      console.error("Failed to save shortcuts:", error);
    }
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
    <div className="p-6 bg-white relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Keyboard className="text-black" size={28} />
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

      <div className="h-10 mb-4 fixed top-[15%] left-0 right-0">
        {error && (
          <div className="flex items-center justify-center w-fit mx-auto gap-3 bg-[#fef2f2] text-[#b91c1c] p-3 rounded-md border border-[#fecaca] animate-pulse">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div
            className={`flex items-center justify-center w-fit mx-auto gap-3 bg-[#f0fdf4] text-[#166534] p-3 rounded-md border border-[#bbf7d0] transition-all duration-300 
              ${
                isVisible
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

      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-[#eff6ff] text-gray-700">
            <th className="px-4 py-3 text-left font-semibold border-b border-gray-200">
              SI.NO
            </th>
            <th className="px-4 py-3 text-left font-semibold border-b border-gray-200">
              Description
            </th>
            <th className="px-4 py-3 text-left font-semibold border-b border-gray-200">
              Event
            </th>
            <th className="px-4 py-3 text-left font-semibold border-b border-gray-200">
              Shortcut
            </th>
          </tr>
        </thead>
        <tbody>
          {shortcuts.map((shortcut, index) => (
            <tr
              key={shortcut.event}
              className="hover:bg-[#eff6ff] transition-colors duration-200"
            >
              <td className="px-4 py-3 border-b border-gray-200 font-bold">
                {serialNumbers[index]}
              </td>
              <td className="px-4 py-3 border-b border-gray-200">
                {shortcut.description}
              </td>
              <td className="px-4 py-3 border-b border-gray-200">
                {shortcut.event}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 text-right">
                <div className="w-40 h-10 relative">
                  {editingKey === shortcut.event ? (
                    <input
                      type="text"
                      value={shortcut.key}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onBlur={() => setEditingKey(null)}
                      autoFocus
                      className="absolute inset-0 w-full h-full px-3 py-2 text-center border border-[#93c5fd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300"
                      placeholder="Press keys..."
                      readOnly
                    />
                  ) : (
                    <button
                      onClick={() => setEditingKey(shortcut.event)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:shadow-md transition-all duration-300 ease-in-out"
                    >
                      <Edit2 size={16} className="text-gray-500" />
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
  );
};

export default ShortcutSettings;
