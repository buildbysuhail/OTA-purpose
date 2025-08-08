import React, { useState, useRef, useEffect } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered, Link, Image, Code,
  Heading1, Heading2, Heading3, Quote, AlignLeft, AlignCenter, AlignRight,
  Palette, Type, Undo, Redo, Eye, FileCode, Table, Strikethrough,
  Subscript, Superscript, IndentDecrease, IndentIncrease, RemoveFormatting,
  Minus, Hash, Download, Upload, Search, Replace, Maximize2, Minimize2,
  Moon, Sun, Keyboard, CheckCircle, AlertCircle, Settings, Columns,
  ZoomIn, ZoomOut, Save, Clock, FileText, Sparkles, Play, X, ChevronDown, ChevronRight
} from "lucide-react";

type HtmlEditorProps = {
  value?: string;
  onchange?: (value: string) => void;
};

interface ToolButtonProps {
  onClick: () => void;
  icon: React.ComponentType<any>;
  title: string;
  active?: boolean;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ onchange, value = "<h1>Welcome to HTML Editor Pro</h1><p>Start creating amazing content with our modern, feature-rich editor!</p><ul><li>Rich text editing</li><li>Live preview</li><li>Code view</li></ul>" }) => {
  const [mode, setMode] = useState<"design" | "code" | "split">("design");
  const [htmlContent, setHtmlContent] = useState<string>(value);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<string>("3");
  const [fontFamily, setFontFamily] = useState<string>("Inter");
  const [showFind, setShowFind] = useState<boolean>(false);
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");
  const [zoom, setZoom] = useState<number>(100);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [recentColors, setRecentColors] = useState<string[]>(["#3B82F6", "#EF4444", "#10B981", "#F59E0B"]);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    formatting: true,
    font: false,
    headings: false,
    lists: false,
    insert: false,
    colors: false,
    actions: false,
    tools: false
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    const text = htmlContent.replace(/<[^>]*>/g, "").trim();
    setCharCount(text.length);
    setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length);
  }, [htmlContent]);

  useEffect(() => {
    setHtmlContent(value);
  }, [value]);

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        console.log("Auto-saving content...");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [htmlContent, autoSave]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            executeCommand("bold");
            break;
          case "i":
            e.preventDefault();
            executeCommand("italic");
            break;
          case "u":
            e.preventDefault();
            executeCommand("underline");
            break;
          case "s":
            e.preventDefault();
            saveDocument();
            break;
          case "z":
            e.preventDefault();
            undo();
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "f":
            e.preventDefault();
            setShowFind(!showFind);
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFind]);

  const executeCommand = (command: string, value: string | null = null) => {
    if (mode === "design" || mode === "split") {
      document.execCommand(command, false, value ?? "");
      updateHtmlContent();
    }
  };

  const updateHtmlContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      onchange && onchange(newContent);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const insertTable = () => {
    const rows = prompt("Number of rows:", "3");
    const cols = prompt("Number of columns:", "3");
    if (rows && cols) {
      let table = '<table style="width:100%; border-collapse: collapse; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += "<tr>";
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="border: 1px solid #ddd; padding: 8px;">Cell</td>';
        }
        table += "</tr>";
      }
      table += "</table>";
      executeCommand("insertHTML", table);
    }
  };

  const insertSpecialChar = () => {
    const chars = ['©', '®', '™', '€', '£', '¥', '§', '¶', '•', '°', '±', '×', '÷', '≠', '≤', '≥'];
    const char = prompt('Special characters:\n' + chars.join(' '), '©');
    if (char) {
      executeCommand('insertHTML', char);
    }
  };

  const changeTextColor = (color: string) => {
    executeCommand("foreColor", color);
    if (!recentColors.includes(color)) {
      setRecentColors([color, ...recentColors.slice(0, 3)]);
    }
  };

  const exportHTML = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importHTML = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setHtmlContent(result);
          onchange && onchange(result);
          if (editorRef.current) {
            editorRef.current.innerHTML = result;
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const validateHTML = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const errors: string[] = [];
    if (!doc.querySelector("h1") && !doc.querySelector("h2")) {
      errors.push("Missing heading tags");
    }
    if (doc.querySelectorAll("img:not([alt])").length > 0) {
      errors.push("Images missing alt attributes");
    }
    setValidationErrors(errors);
  };

  const beautifyCode = () => {
    let beautified = htmlContent
      .replace(/></g, ">\n<")
      .replace(/(\r\n|\n|\r)/gm, "\n");
    const lines = beautified.split("\n");
    let level = 0;
    beautified = lines
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("</")) level--;
        const indented = "  ".repeat(Math.max(0, level)) + trimmed;
        if (
          trimmed.startsWith("<") &&
          !trimmed.startsWith("</") &&
          !trimmed.endsWith("/>")
        ) {
          level++;
        }
        return indented;
      })
      .join("\n");
    setHtmlContent(beautified);
    onchange && onchange(beautified);
    if (codeEditorRef.current) {
      codeEditorRef.current.value = beautified;
    }
  };

  const findAndReplace = () => {
    if (findText) {
      const newContent = htmlContent.replace(
        new RegExp(findText, "g"),
        replaceText
      );
      setHtmlContent(newContent);
      onchange && onchange(newContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = newContent;
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousContent = history[historyIndex - 1];
      setHtmlContent(previousContent);
      onchange && onchange(previousContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent;
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextContent = history[historyIndex + 1];
      setHtmlContent(nextContent);
      onchange && onchange(nextContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
      }
    }
  };

  const saveDocument = () => {
    alert("Document saved successfully!");
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const ToolButton: React.FC<ToolButtonProps> = ({ onClick, icon: Icon, title, active = false }) => (
    <button
      onClick={onClick}
      className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-200 group relative   ${active ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
      title={title}>
      <Icon size={16} />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[51] pointer-events-none">
        {title}
      </div>
    </button>
  );

  const SidebarSection: React.FC<{
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, sectionKey, children }) => (
    <div className="mb-3">
      <button
        onClick={() => toggleSection(sectionKey)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${darkMode ? "text-slate-200 hover:bg-slate-700" : "text-gray-800 hover:bg-gray-100"}`}>
        <span>{title}</span>
        {expandedSections[sectionKey] ? (<ChevronDown size={16} />) : (<ChevronRight size={16} />)}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-2 space-y-1 pl-2">{children}</div>
      )}
    </div>
  );

  const shortcuts = [
    { key: "Ctrl+B", action: "Bold" },
    { key: "Ctrl+I", action: "Italic" },
    { key: "Ctrl+U", action: "Underline" },
    { key: "Ctrl+S", action: "Save" },
    { key: "Ctrl+Z", action: "Undo" },
    { key: "Ctrl+Y", action: "Redo" },
    { key: "Ctrl+F", action: "Find & Replace" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900" style={{ zoom: `${zoom}%` }}>
      {/* Main Editor Area */}
      <div className={`flex-1 flex flex-col ${fullScreen ? "fixed inset-0 z-50" : ""} ${darkMode ? "bg-slate-900" : "bg-white"} border ${darkMode ? "border-slate-800" : "border-gray-200"} overflow-hidden mr-80`}>
        {/* Find & Replace Bar */}
        {showFind && (
          <div className={`border-b ${darkMode ? "border-slate-800 bg-slate-800/50" : "border-gray-200 bg-blue-50/50"} px-6 py-3 flex-shrink-0`}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className={`flex-1 h-9 px-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
              />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className={`flex-1 h-9 px-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
              />
              <button onClick={findAndReplace} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                Replace All
              </button>
              <button
                onClick={() => setShowFind(false)}
                className={`h-9 w-9 flex items-center justify-center rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="border-b border-red-200 bg-red-50 px-6 py-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
              <span className="font-medium text-red-700">Validation Issues:</span>
              <div className="flex flex-wrap gap-2">
                {validationErrors.map((error, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                    {error}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex flex-1 overflow-hidden min-h-[400px]">
          {mode === "split" ? (
            <>
              <div className="w-1/2 p-4 flex flex-col min-h-[400px]">
                <div className="flex-1 min-h-0">
                  <div
                    ref={editorRef}
                    contentEditable
                    className={`w-full h-full min-h-[400px] max-h-[690px] p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-300 text-gray-900"}`}
                    onInput={updateHtmlContent}
                    style={{ fontFamily: fontFamily }}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
              <div className="w-1/2 p-4 border-l border-gray-200 dark:border-slate-700 flex flex-col min-h-0">
                <div className="flex-1 min-h-0">
                  <textarea
                    ref={codeEditorRef}
                    value={htmlContent}
                    onChange={(e) => {
                      setHtmlContent(e.target.value);
                      onchange && onchange(e.target.value);
                      if (editorRef.current) {
                        editorRef.current.innerHTML = e.target.value;
                      }
                    }}
                    className={`w-full h-full min-h-[400px] p-4 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${darkMode ? "bg-slate-800 border-slate-700 text-green-400" : "bg-white border-gray-300 text-gray-900"}`}
                    spellCheck="false"
                  />
                </div>
              </div>
            </>
          ) : mode === "design" ? (
            <div className="w-full p-4 flex flex-col min-h-[400px]">
              <div className="flex-1 min-h-0">
                <div
                  ref={editorRef}
                  contentEditable
                  className={`w-full h-full min-h-[400px] p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-300 text-gray-900"}`}
                  onInput={updateHtmlContent}
                  style={{ fontFamily: fontFamily }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full p-4 flex flex-col min-h-[400px]">
              <div className="flex-1 min-h-0">
                <textarea
                  ref={codeEditorRef}
                  value={htmlContent}
                  onChange={(e) => {
                    setHtmlContent(e.target.value);
                    onchange && onchange(e.target.value);
                  }}
                  className={`w-full h-full min-h-[300px] max-h-[300px] p-4 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${darkMode ? "bg-slate-800 border-slate-700 text-green-400" : "bg-white border-gray-300 text-gray-900"}`}
                  spellCheck="false"
                />
              </div>
              {/* Live Preview Panel */}
              <div className={`border-t ${darkMode ? "border-slate-800" : "border-gray-200"} p-4 flex-shrink-0`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-base font-semibold flex items-center gap-2 ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                    <Play size={18} className="text-blue-500" />
                    Live Preview
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`flex items-center gap-1 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                      Words:{" "}
                      <span className="font-semibold text-blue-500">
                        {wordCount}
                      </span>
                    </span>
                    <span className={`flex items-center gap-1 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                      Characters:{" "}
                      <span className="font-semibold text-blue-500">
                        {charCount}
                      </span>
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border min-h-[130px] max-h-[300px] overflow-y-auto ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-gray-50/50 border-gray-200"}`}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  style={{ zoom: `${zoom}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className={`border-t ${darkMode ? "border-slate-800 bg-slate-800/30" : "border-gray-200 bg-gray-50/30"} px-6 py-3 flex-shrink-0`}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                <FileText size={16} className="text-blue-500" />
                Mode:{" "}
                <span className={`px-2 py-1 rounded font-medium ${darkMode ? "bg-slate-700 text-slate-200" : "bg-gray-200 text-gray-700"}`}>
                  {mode === "split" ? "Split View" : mode === "design" ? "Visual Design" : "Code Editor"}
                </span>
              </span>
              <span className={`px-2 py-1 rounded text-xs ${darkMode ? "bg-green-900/20 text-green-400" : "bg-green-100 text-green-700"}`}>
                Ready
              </span>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500 focus:ring-1"
                />
                <span className={`flex items-center gap-1 text-sm ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                  <Clock size={14} className="text-blue-500" />
                  Auto-save
                </span>
              </label>
              {autoSave && (
                <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                  <CheckCircle size={14} />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-[40px] bottom-[47px] h-[-webkit-fill-available] w-[347px] ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} border-l flex flex-col overflow-hidden z-40`}>
        {/* Sidebar Header */}
        <div className={`border-b ${darkMode ? "border-slate-700" : "border-gray-200"} p-2`}>
          {/* View Mode Selector */}
          <div className="space-y-2">
            <button
              onClick={() => setMode("design")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${mode === "design" ? "bg-blue-500 text-white shadow-md" : darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-gray-100 text-gray-700"}`}>
              <Eye size={16} />
              <span className="font-medium">Design View</span>
            </button>
            <button
              onClick={() => setMode("code")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${mode === "code" ? "bg-blue-500 text-white shadow-md" : darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-gray-100 text-gray-700"}`}>
              <FileCode size={16} />
              <span className="font-medium">Code View</span>
            </button>
            <button
              onClick={() => setMode("split")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${mode === "split" ? "bg-blue-500 text-white shadow-md" : darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-gray-100 text-gray-700"}`}>
              <Columns size={16} />
              <span className="font-medium">Split View</span>
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-2 space-y-1">
          <div className="flex items-center gap-1">
            <ToolButton onClick={() => executeCommand('bold')} icon={Bold} title="Bold (Ctrl+B)" />
            <ToolButton onClick={() => executeCommand('italic')} icon={Italic} title="Italic (Ctrl+I)" />
            <ToolButton onClick={() => executeCommand('underline')} icon={Underline} title="Underline (Ctrl+U)" />
            <ToolButton onClick={() => executeCommand('strikeThrough')} icon={Strikethrough} title="Strikethrough" />
            <ToolButton onClick={() => executeCommand('subscript')} icon={Subscript} title="Subscript" />
            <ToolButton onClick={() => executeCommand('superscript')} icon={Superscript} title="Superscript" />
            <div className={`w-px h-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
            {/* Headings */}
            <ToolButton onClick={() => executeCommand('formatBlock', 'h1')} icon={Heading1} title="Heading 1" />
            <ToolButton onClick={() => executeCommand('formatBlock', 'h2')} icon={Heading2} title="Heading 2" />
            <ToolButton onClick={() => executeCommand('formatBlock', 'h3')} icon={Heading3} title="Heading 3" />
            <ToolButton onClick={() => executeCommand('formatBlock', 'p')} icon={Type} title="Paragraph" />
          </div>

          {/* Insert Tools */}
          <div className="flex items-center gap-1">
            <ToolButton onClick={() => { const url = prompt('Enter URL:'); if (url) executeCommand('createLink', url); }} icon={Link} title="Insert Link" />
            <ToolButton onClick={() => { const url = prompt('Enter image URL:'); if (url) executeCommand('insertImage', url); }} icon={Image} title="Insert Image" />
            <ToolButton onClick={insertTable} icon={Table} title="Insert Table" />
            <ToolButton onClick={() => executeCommand('insertHorizontalRule')} icon={Minus} title="Horizontal Line" />
            <ToolButton onClick={insertSpecialChar} icon={Hash} title="Special Character" />
            <ToolButton onClick={() => executeCommand('formatBlock', 'pre')} icon={Code} title="Code Block" />
            <ToolButton onClick={() => executeCommand('formatBlock', 'blockquote')} icon={Quote} title="Quote" />
            <div className={`w-px h-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
            {/* Actions */}
            <ToolButton onClick={undo} icon={Undo} title="Undo (Ctrl+Z)" />
            <ToolButton onClick={redo} icon={Redo} title="Redo (Ctrl+Y)" />
            <ToolButton onClick={() => executeCommand('removeFormat')} icon={RemoveFormatting} title="Clear Formatting" />
            <ToolButton onClick={saveDocument} icon={Save} title="Save (Ctrl+S)" />
          </div>

          {/* Lists & Alignment */}
          <div className="flex items-center gap-1">
            <ToolButton onClick={() => executeCommand('insertUnorderedList')} icon={List} title="Bullet List" />
            <ToolButton onClick={() => executeCommand('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
            <ToolButton onClick={() => executeCommand('outdent')} icon={IndentDecrease} title="Decrease Indent" />
            <ToolButton onClick={() => executeCommand('indent')} icon={IndentIncrease} title="Increase Indent" />
            <div className={`w-px h-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`} />
            {/* alignment */}
            <ToolButton onClick={() => executeCommand('justifyLeft')} icon={AlignLeft} title="Align Left" />
            <ToolButton onClick={() => executeCommand('justifyCenter')} icon={AlignCenter} title="Align Center" />
            <ToolButton onClick={() => executeCommand('justifyRight')} icon={AlignRight} title="Align Right" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-full">
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  executeCommand("fontName", e.target.value);
                }}
                className={`w-full h-9 px-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-300 text-gray-900"}`}>
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
            <div className="w-full">
              <label className={`block text-xs font-medium mb-1 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                Font Size
              </label>
              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  executeCommand("fontSize", e.target.value);
                }}
                className={`w-full h-9 px-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-300 text-gray-900"}`}>
                <option value="1">10px</option>
                <option value="2">13px</option>
                <option value="3">16px</option>
                <option value="4">18px</option>
                <option value="5">24px</option>
                <option value="6">32px</option>
                <option value="7">48px</option>
              </select>
            </div>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            {recentColors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => changeTextColor(color)}
                className="w-7 h-7 rounded-md border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title="Recent color"
              />
            ))}
            <div className="relative">
              <input
                type="color"
                onChange={(e) => changeTextColor(e.target.value)}
                className="absolute opacity-0 w-8 h-8 cursor-pointer"
                title="Text Color"
              />
              <div className="p-2 rounded hover:bg-gray-200 transition-colors pointer-events-none">
                <Type size={18} />
              </div>
            </div>
            <div className="relative">
              <input
                type="color"
                onChange={(e) => executeCommand('hiliteColor', e.target.value)}
                className="absolute opacity-0 w-8 h-8 cursor-pointer"
                title="Background Color"
              />
              <div className="p-2 rounded hover:bg-gray-200 transition-colors pointer-events-none">
                <Palette size={18} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="grid grid-cols-8 gap-1">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}
                title="Toggle theme">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setFullScreen(!fullScreen)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}
                title="Toggle fullscreen">
                {fullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}
                title="Keyboard shortcuts">
                <Keyboard size={18} />
              </button>

              <button
                title="Find & Replace"
                onClick={() => setShowFind(!showFind)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
                <Search size={14} />
              </button>

              <button
                title="Validate"
                onClick={validateHTML}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
                <CheckCircle size={14} />
              </button>

              <button
                title="Beautify"
                onClick={beautifyCode}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
                <Sparkles size={14} />
              </button>

              <button
                title="Export"
                onClick={exportHTML}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`} >
                <Upload size={14} />
              </button>

              <label className={`h-9 w-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
                <Download size={14} />
                <input type="file" accept=".html" onChange={importHTML} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2">
            <button
              title="Zoom Out"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
              <ZoomOut size={14} />
            </button>

            <span className={`text-sm font-mono px-2 py-1 rounded ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>{zoom}%</span>

            <button
              title="Zoom In"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Word Count */}
        <div className={`p-3 ${darkMode ? "bg-slate-700/50" : "bg-gray-100"}`}>
          <h4 className={`text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
            Document Stats
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={darkMode ? "text-slate-400" : "text-gray-600"}>Words:</span>
              <span className="font-semibold text-blue-500">{wordCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={darkMode ? "text-slate-400" : "text-gray-600"}>Characters:</span>
              <span className="font-semibold text-blue-500">{charCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowShortcuts(false)}>
          <div
            className={`p-6 rounded-xl max-w-md w-full ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} shadow-2xl transform scale-100 transition-all duration-200`}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                <Keyboard className="text-blue-500" size={24} />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className={`p-1 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-600"}`}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`font-mono text-sm px-3 py-1.5 rounded-lg ${darkMode ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-700"}`}>
                    {shortcut.key}
                  </span>
                  <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                    {shortcut.action}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowShortcuts(false)} className="mt-6 w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HtmlEditor;
