import React from "react";
import { useTranslation } from "react-i18next";

interface PosKeyboardProps {
  formState: any;
  dispatch: any;
  onKeyPress: (key: string) => void;
}

const PosKeyBoard: React.FC<PosKeyboardProps> = ({
  formState,
  dispatch,
  onKeyPress,
}) => {
  const { t } = useTranslation("transaction");
  const MAX_COLUMNS = 11;
  const keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*"],
    ["!", "@", "#", "$", "%", "^", "&", "(", ")", "\\", "/"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "?"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", " :"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "Enter"],
    ["Small", "Space", "Back", "Clear", "]"],
  ];

  const wideKeys = ["Small", "Back", "Clear", "Enter"];
  const extraWideKeys: Record<string, number> = { Space: 4 };

  const handleKeyClick = (key: string) => {
    onKeyPress(key);
  };

  const getColSpan = (key: string): number => {
    if (key in extraWideKeys) {
      return extraWideKeys[key];
    }
    if (wideKeys.includes(key)) {
      return 2;
    }
    return 1;
  };

  //   Use This or check if libraries for keyboard instead
  return (
    <div className="fixed top-1/2 left-1/2 z-[999999] -translate-x-1/2 -translate-y-1/2">
      <div className="bg-gray-200 p-4 shadow-lg space-y-2">
        {keys.map((row, rIndex) => (
          <div
            key={rIndex}
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${MAX_COLUMNS}, 1fr)` }}
          >
            {row.map((k) => (
              <button
                key={k}
                style={{ gridColumn: `span ${getColSpan(k)}` }}
                className={`
                  px-4 py-3 text-lg font-semibold border border-gray-600 rounded-sm hover:bg-gray-200 active:scale-95
                `}
                onClick={() => handleKeyClick(k)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosKeyBoard;


