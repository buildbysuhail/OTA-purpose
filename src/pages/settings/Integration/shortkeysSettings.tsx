import React, { useState, useCallback, useRef } from "react";
import DataGrid, {
  Column,
  ColumnFixing,
  Editing,
  FilterRow,
  KeyboardNavigation,
  Scrolling,
} from "devextreme-react/data-grid";

interface Shortcut {
  command: string;
  keys: string[];
  description: string;
}

interface Shortcuts {
  [key: string]: Shortcut;
}

const KeyboardShortkeys: React.FC = () => {
  const initialShortcuts: Shortcuts = {
    selectAll: {
      command: "Close all Popup",
      keys: ["ctrl", "shift", "b"],
      description: "Close all the Popups that are opened",
    },
    selectColumn: {
      command: "Close Popup",
      keys: ["ctrl", "q"],
      description: "Close the current / Active popup",
    },
    selectToEnd: {
      command: "Go to back",
      keys: ["shift", "b"],
      description: "Go to previous page from current page",
    },
    selectToRight: {
      command: "Go to next",
      keys: ["alt", "f"],
      description: "Go to next page from the current page",
    },
    selectToLeft: {
      command: "Go to home",
      keys: ["ctrl", "x"],
      description: "Go to home page from the current page",
    },
  };

  const [shortcuts, setShortcuts] = useState(initialShortcuts);
  const dataGridRef = useRef<any>(null);

  const gridData = Object.entries(shortcuts).map(([id, shortcut]) => ({
    id,
    ...shortcut,
    keys: shortcut.keys.join(" + "),
  }));

  const resetToDefault = useCallback(() => {
    setShortcuts(initialShortcuts);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      alert("Save triggered!");
    } else if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      resetToDefault();
    }
  };

  return (
    <div
      className="p-6 min-h-screen bg-gray-50"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Keyboard Shortcuts
          </h2>
        </div>

        <DataGrid
          ref={dataGridRef}
          dataSource={gridData}
          showBorders={true}
          showColumnHeaders={true}
          hoverStateEnabled={true}
          rowAlternationEnabled={true}
          className="shadow-md overflow-hidden"
        >
          <KeyboardNavigation
            editOnKeyPress={true}
            enterKeyAction={"startEdit"}
            enterKeyDirection={"row"}
          />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={false}
            allowDeleting={false}
          />
          <FilterRow visible={false} />
          <ColumnFixing enabled={true} />
          <Scrolling mode="standard" />

          <Column
            dataField="command"
            caption="Command"
            cssClass="font-medium text-gray-700 transition-all duration-300 ease-in-out"
          />

          <Column
            dataField="keys"
            caption="Keybinding"
            cssClass="font-medium text-gray-700 transition-all duration-300 ease-in-out"
          />

          <Column
            dataField="description"
            caption="Description"
            cssClass="font-medium text-gray-700 transition-all duration-300 ease-in-out"
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default KeyboardShortkeys;