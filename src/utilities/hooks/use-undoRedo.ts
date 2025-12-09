import { useCallback, useEffect, useRef, useState } from "react";
import { TemplateState } from "../../pages/InvoiceDesigner/Designer/interfaces";

interface HistoryState {
  templateData: TemplateState<unknown>;
  timestamp: number;
  action: string; // For debugging/logging
}


interface UseUndoRedoReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  resetHistory: (newInitial: TemplateState<unknown>) => void;
  pushState: (newState: TemplateState<unknown>, action: string) => void;
  history: HistoryState[];
  historyIndex: number;
}

const MAX_HISTORY_DEPTH = 50; // Standard for most design tools (Figma, Adobe XD use 50-100)

export const useUndoRedo = (
  initialState: TemplateState<unknown>
): UseUndoRedoReturn => {
  const [history, setHistory] = useState<HistoryState[]>([
    {
      templateData: JSON.parse(JSON.stringify(initialState)), // Deep copy initial state,
      timestamp: Date.now(),
      action: 'Initial State',
    },
  ]);
const [historyIndex, setHistoryIndex] = useState(0);
const historyIndexRef = useRef(0); // Keep ref in sync
    // Update ref when historyIndex changes
  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  // Push new state to history
  const pushState = useCallback(
    (newState: TemplateState<unknown>, action: string,) => {
      setHistory((prevHistory) => {
        // Remove any "future" history if user makes a change after undo
         const currentIndex = historyIndexRef.current;
        const newHistory = prevHistory.slice(0, currentIndex  + 1);

       // Don't add duplicate states
        if (
          newHistory.length > 0 &&
          JSON.stringify(newHistory[newHistory.length - 1].templateData) ===
            JSON.stringify(newState)
        ) {
          return prevHistory;
        }
        // Add new state
        newHistory.push({
          templateData: JSON.parse(JSON.stringify(newState)), // Deep copy
          timestamp: Date.now(),
          action,
        });

        // Keep only MAX_HISTORY_DEPTH items
        if (newHistory.length > MAX_HISTORY_DEPTH) {
          newHistory.shift();
        }

        return newHistory;
      });

 
       setHistoryIndex((prev) => {
        const newIndex = Math.min(prev + 1, MAX_HISTORY_DEPTH - 1);
        historyIndexRef.current = newIndex;
        return newIndex;
      });
    },
    []
  );
const resetHistory = useCallback((newInitial: TemplateState<unknown>) => {
  const base: HistoryState = {
    templateData: JSON.parse(JSON.stringify(newInitial)),
    timestamp: Date.now(),
    action: "Reset Initial",
  };

  // Replace history with single base entry and reset index
  setHistory([base]);
  historyIndexRef.current = 0;
  setHistoryIndex(0);
}, []);

  // Undo action
  const undo = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      const newIndex = Math.max(0, prevIndex - 1);
      historyIndexRef.current = newIndex;
      return newIndex;
    });
  }, []);

  // Redo action
  const redo = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, history.length - 1);
      historyIndexRef.current = newIndex;
      return newIndex;
    });
  }, [history.length]);

  // Clear history
  const clearHistory = useCallback(() => {
    if (history[historyIndex]) {
      setHistory([
        {
          templateData: JSON.parse(JSON.stringify(history[historyIndex].templateData)),
          timestamp: Date.now(),
          action: "History Cleared",
        },
      ]);
      setHistoryIndex(0);
      historyIndexRef.current = 0;
    }
  }, [history, historyIndex]);

  return {
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    clearHistory,
    resetHistory,
    pushState,
    history,
    historyIndex,
  };
};

