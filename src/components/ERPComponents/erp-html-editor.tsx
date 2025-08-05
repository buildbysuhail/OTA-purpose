import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link, Image, Code,
  Heading1, Heading2, Heading3, Quote, AlignLeft, AlignCenter, AlignRight,
  Palette, Type, Undo, Redo, Eye, FileCode, Table, Strikethrough,
  Subscript, Superscript, IndentDecrease, IndentIncrease, RemoveFormatting,
  Minus, Hash, Download, Upload, Search, Replace, Maximize2, Minimize2,
  Moon, Sun, Keyboard, CheckCircle, AlertCircle, Settings, Columns,
  ZoomIn, ZoomOut, Save, Clock, FileText, Sparkles
} from 'lucide-react';

type HtmlEditorProps = {
  value: string;
};

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value }) => {

  const [mode, setMode] = useState('design'); // 'design', 'code', or 'split'
  const [htmlContent, setHtmlContent] = useState(value);
  const [selectedText, setSelectedText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [zoom, setZoom] = useState(100);
  const [autoSave, setAutoSave] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [recentColors, setRecentColors] = useState(['#000000', '#FF0000', '#00FF00', '#0000FF']);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-save effect
  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem('htmlEditorContent', htmlContent);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [htmlContent, autoSave]);

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem('htmlEditorContent');
    if (saved) {
      setHtmlContent(saved);
    }
  }, []);

  // Update word and character count
  useEffect(() => {
    const text = htmlContent.replace(/<[^>]*>/g, '').trim();
    setCharCount(text.length);
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
  }, [htmlContent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'b': e.preventDefault(); executeCommand('bold'); break;
          case 'i': e.preventDefault(); executeCommand('italic'); break;
          case 'u': e.preventDefault(); executeCommand('underline'); break;
          case 's': e.preventDefault(); saveDocument(); break;
          case 'z': e.preventDefault(); undo(); break;
          case 'y': e.preventDefault(); redo(); break;
          case 'f': e.preventDefault(); setShowFind(!showFind); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFind]);

  const executeCommand = (command: any, value = null) => {
    if (mode === 'design' || mode === 'split') {
      document.execCommand(command, false, value??"");
      updateHtmlContent();
    }
  };

  const updateHtmlContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      
      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newContent as never);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      executeCommand('insertHTML', table);
    }
  };

  const insertSpecialChar = () => {
    const chars = ['©', '®', '™', '€', '£', '¥', '§', '¶', '•', '°', '±', '×', '÷', '≠', '≤', '≥'];
    const char = prompt('Special characters:\n' + chars.join(' '), '©');
    if (char) {
      executeCommand('insertHTML', char);
    }
  };

  const changeTextColor = (color: any) => {
    executeCommand('foreColor', color);
    if (!recentColors.includes(color)) {
      setRecentColors([color, ...recentColors.slice(0, 3)]);
    }
  };

  const exportHTML = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
  };

  const importHTML = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHtmlContent(e.target.result);
        if (editorRef.current) {
          editorRef.current.innerHTML = e.target.result;
        }
      };
      reader.readAsText(file);
    }
  };

  const validateHTML = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const errors = [];
    
    // Check for basic issues
    if (!doc.querySelector('h1') && !doc.querySelector('h2')) {
      errors.push('Missing heading tags');
    }
    if (doc.querySelectorAll('img:not([alt])').length > 0) {
      errors.push('Images missing alt attributes');
    }
    
    setValidationErrors(errors);
  };

  const beautifyCode = () => {
    // Simple beautification
    let beautified = htmlContent
      .replace(/></g, '>\n<')
      .replace(/(\r\n|\n|\r)/gm, '\n');
    
    // Add indentation
    const lines = beautified.split('\n');
    let level = 0;
    beautified = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) level--;
      const indented = '  '.repeat(Math.max(0, level)) + trimmed;
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        level++;
      }
      return indented;
    }).join('\n');
    
    setHtmlContent(beautified);
  };

  const findAndReplace = () => {
    if (findText) {
      const newContent = htmlContent.replace(new RegExp(findText, 'g'), replaceText);
      setHtmlContent(newContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = newContent;
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setHtmlContent(history[historyIndex - 1]);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[historyIndex - 1];
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setHtmlContent(history[historyIndex + 1]);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[historyIndex + 1];
      }
    }
  };

  const saveDocument = () => {
    localStorage.setItem('htmlEditorContent', htmlContent);
    alert('Document saved!');
  };

  const ToolButton = ({ onClick, icon: Icon, title, active = false }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded transition-all duration-200 ${
        darkMode 
          ? active ? 'bg-gray-600' : 'hover:bg-gray-700' 
          : active ? 'bg-gray-300' : 'hover:bg-gray-200'
      }`}
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  const shortcuts = [
    { key: 'Ctrl+B', action: 'Bold' },
    { key: 'Ctrl+I', action: 'Italic' },
    { key: 'Ctrl+U', action: 'Underline' },
    { key: 'Ctrl+S', action: 'Save' },
    { key: 'Ctrl+Z', action: 'Undo' },
    { key: 'Ctrl+Y', action: 'Redo' },
    { key: 'Ctrl+F', action: 'Find & Replace' },
  ];

  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50' : 'w-full max-w-7xl mx-auto'} 
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-lg shadow-xl transition-all duration-300`}
      style={{ zoom: `${zoom}%` }}>
      
      {/* Header */}
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-blue-500" />
            Advanced HTML Editor
          </h2>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMode('design')}
              className={`px-4 py-2 rounded-md transition-all ${
                mode === 'design' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Eye className="inline mr-2" size={16} />
              Design
            </button>
            <button
              onClick={() => setMode('code')}
              className={`px-4 py-2 rounded-md transition-all ${
                mode === 'code' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FileCode className="inline mr-2" size={16} />
              Code
            </button>
            <button
              onClick={() => setMode('split')}
              className={`px-4 py-2 rounded-md transition-all ${
                mode === 'split' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Columns className="inline mr-2" size={16} />
              Split
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-md transition-all ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setFullScreen(!fullScreen)}
              className={`p-2 rounded-md transition-all ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Toggle fullscreen"
            >
              {fullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className={`p-2 rounded-md transition-all ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Keyboard shortcuts"
            >
              <Keyboard size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {(mode === 'design' || mode === 'split') && (
        <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-3`}>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Text formatting */}
            <div className="flex gap-1 pr-3 border-r border-gray-400">
              <ToolButton onClick={() => executeCommand('bold')} icon={Bold} title="Bold (Ctrl+B)" />
              <ToolButton onClick={() => executeCommand('italic')} icon={Italic} title="Italic (Ctrl+I)" />
              <ToolButton onClick={() => executeCommand('underline')} icon={Underline} title="Underline (Ctrl+U)" />
              <ToolButton onClick={() => executeCommand('strikeThrough')} icon={Strikethrough} title="Strikethrough" />
              <ToolButton onClick={() => executeCommand('subscript')} icon={Subscript} title="Subscript" />
              <ToolButton onClick={() => executeCommand('superscript')} icon={Superscript} title="Superscript" />
            </div>

            {/* Font options */}
            <div className="flex gap-2 pr-3 border-r border-gray-400">
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  executeCommand('fontName', e.target.value);
                }}
                className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-white border'}`}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  executeCommand('fontSize', e.target.value);
                }}
                className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-white border'}`}
              >
                <option value="1">8pt</option>
                <option value="2">10pt</option>
                <option value="3">12pt</option>
                <option value="4">14pt</option>
                <option value="5">18pt</option>
                <option value="6">24pt</option>
                <option value="7">36pt</option>
              </select>
            </div>

            {/* Headings */}
            <div className="flex gap-1 pr-3 border-r border-gray-400">
              <ToolButton onClick={() => executeCommand('formatBlock', 'h1')} icon={Heading1} title="Heading 1" />
              <ToolButton onClick={() => executeCommand('formatBlock', 'h2')} icon={Heading2} title="Heading 2" />
              <ToolButton onClick={() => executeCommand('formatBlock', 'h3')} icon={Heading3} title="Heading 3" />
              <ToolButton onClick={() => executeCommand('formatBlock', 'p')} icon={Type} title="Paragraph" />
            </div>

            {/* Lists and indentation */}
            <div className="flex gap-1 pr-3 border-r border-gray-400">
              <ToolButton onClick={() => executeCommand('insertUnorderedList')} icon={List} title="Bullet List" />
              <ToolButton onClick={() => executeCommand('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
              <ToolButton onClick={() => executeCommand('outdent')} icon={IndentDecrease} title="Decrease Indent" />
              <ToolButton onClick={() => executeCommand('indent')} icon={IndentIncrease} title="Increase Indent" />
            </div>

            {/* Alignment */}
            <div className="flex gap-1 pr-3 border-r border-gray-400">
              <ToolButton onClick={() => executeCommand('justifyLeft')} icon={AlignLeft} title="Align Left" />
              <ToolButton onClick={() => executeCommand('justifyCenter')} icon={AlignCenter} title="Align Center" />
              <ToolButton onClick={() => executeCommand('justifyRight')} icon={AlignRight} title="Align Right" />
            </div>

            {/* Insert */}
            <div className="flex gap-1 pr-3 border-r border-gray-400">
              <ToolButton onClick={() => {
                const url = prompt('Enter URL:');
                if (url) executeCommand('createLink', url);
              }} icon={Link} title="Insert Link" />
              <ToolButton onClick={() => {
                const url = prompt('Enter image URL:');
                if (url) executeCommand('insertImage', url);
              }} icon={Image} title="Insert Image" />
              <ToolButton onClick={insertTable} icon={Table} title="Insert Table" />
              <ToolButton onClick={() => executeCommand('insertHorizontalRule')} icon={Minus} title="Horizontal Line" />
              <ToolButton onClick={insertSpecialChar} icon={Hash} title="Special Character" />
              <ToolButton onClick={() => executeCommand('formatBlock', 'pre')} icon={Code} title="Code Block" />
              <ToolButton onClick={() => executeCommand('formatBlock', 'blockquote')} icon={Quote} title="Quote" />
            </div>

            {/* Colors */}
            <div className="flex gap-2 pr-3 border-r border-gray-400">
              <div className="flex gap-1">
                {recentColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeTextColor(color)}
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                    title="Recent color"
                  />
                ))}
              </div>
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

            {/* Actions */}
            <div className="flex gap-1">
              <ToolButton onClick={() => executeCommand('removeFormat')} icon={RemoveFormatting} title="Clear Formatting" />
              <ToolButton onClick={undo} icon={Undo} title="Undo (Ctrl+Z)" />
              <ToolButton onClick={redo} icon={Redo} title="Redo (Ctrl+Y)" />
              <ToolButton onClick={saveDocument} icon={Save} title="Save (Ctrl+S)" />
            </div>
          </div>

          {/* Second toolbar row */}
          <div className="flex gap-3 mt-3 items-center justify-between">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowFind(!showFind)}
                className={`px-3 py-1 rounded flex items-center gap-2 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Search size={16} />
                Find & Replace
              </button>
              <button
                onClick={validateHTML}
                className={`px-3 py-1 rounded flex items-center gap-2 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <CheckCircle size={16} />
                Validate
              </button>
              <button
                onClick={beautifyCode}
                className={`px-3 py-1 rounded flex items-center gap-2 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Sparkles size={16} />
                Beautify
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm">Zoom:</span>
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1">
                <ZoomOut size={16} />
              </button>
              <span className="text-sm font-mono">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1">
                <ZoomIn size={16} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportHTML}
                className={`px-3 py-1 rounded flex items-center gap-2 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Download size={16} />
                Export
              </button>
              <label className={`px-3 py-1 rounded flex items-center gap-2 cursor-pointer ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}>
                <Upload size={16} />
                Import
                <input type="file" accept=".html" onChange={importHTML} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Find & Replace Bar */}
      {showFind && (
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Find..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className={`px-3 py-1 rounded flex-1 ${darkMode ? 'bg-gray-700' : 'bg-white border'}`}
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className={`px-3 py-1 rounded flex-1 ${darkMode ? 'bg-gray-700' : 'bg-white border'}`}
            />
            <button
              onClick={findAndReplace}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Replace All
            </button>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-red-900' : 'border-gray-200 bg-red-100'}`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="font-semibold">Validation Issues:</span>
            {validationErrors.map((error, idx) => (
              <span key={idx} className="text-sm">{error}</span>
            ))}
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden" style={{ height: fullScreen ? 'calc(100vh - 300px)' : '500px' }}>
        {mode === 'split' ? (
          <>
            {/* Design Editor */}
            <div className="w-1/2 p-4 overflow-auto">
              <div
                ref={editorRef}
                contentEditable
                className={`min-h-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}
                onInput={updateHtmlContent}
                style={{ fontFamily: fontFamily }}
              />
            </div>
            {/* Code Editor */}
            <div className="w-1/2 p-4 overflow-auto border-l">
              <textarea
                ref={codeEditorRef}
                value={htmlContent}
                onChange={(e) => {
                  setHtmlContent(e.target.value);
                  if (editorRef.current) {
                    editorRef.current.innerHTML = e.target.value;
                  }
                }}
                className={`w-full h-full p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-800 border-gray-600 text-green-400' : 'bg-white border-gray-300'
                }`}
                spellCheck="false"
              />
            </div>
          </>
        ) : mode === 'design' ? (
          <div className="w-full p-4 overflow-auto">
            <div
              ref={editorRef}
              contentEditable
              className={`min-h-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
              onInput={updateHtmlContent}
              style={{ fontFamily: fontFamily }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        ) : (
          <div className="w-full p-4 overflow-auto">
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className={`w-full h-full p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-600 text-green-400' : 'bg-white border-gray-300'
              }`}
              spellCheck="false"
            />
          </div>
        )}
      </div>

      {/* Preview Panel */}
      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Eye size={20} />
          Live Preview
        </h3>
        <div 
          className={`p-4 border rounded-md min-h-[150px] ${
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
          }`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{ zoom: `${zoom}%` }}
        />
      </div>

      {/* Status Bar */}
      <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-3`}>
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <FileText size={16} />
              Mode: {mode === 'split' ? 'Split View' : mode === 'design' ? 'Visual Design' : 'Code Editor'}
            </span>
            <span>Words: {wordCount}</span>
            <span>Characters: {charCount}</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              <span className="flex items-center gap-1">
                <Clock size={16} />
                Auto-save
              </span>
            </label>
            {autoSave && <span className="text-green-500">✓ Saved</span>}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className={`p-6 rounded-lg max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {shortcut.key}
                  </span>
                  <span>{shortcut.action}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HtmlEditor;