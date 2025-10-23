import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

interface HistoryState {
  content: string;
  cursorPosition: number;
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<HistoryState[]>([{ content, cursorPosition: 0 }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    strikethrough: false,
    heading1: false,
    heading2: false,
    heading3: false,
    bulletList: false,
    numberedList: false,
    quote: false,
    code: false,
  });

  // Detect active formatting at cursor position
  useEffect(() => {
    const detectFormatting = () => {
      const textarea = editorRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = content;

      // Get the selected text or text around cursor
      const selectedText = text.substring(start, end);

      // Check line start for heading, list, quote
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = text.indexOf('\n', start);
      const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);

      setActiveFormats({
        bold: /\*\*([^*]+)\*\*/.test(selectedText) || isWithinPattern(text, start, end, '**', '**'),
        italic: /\*([^*]+)\*/.test(selectedText) || isWithinPattern(text, start, end, '*', '*'),
        strikethrough: /~~([^~]+)~~/.test(selectedText) || isWithinPattern(text, start, end, '~~', '~~'),
        heading1: currentLine.trimStart().startsWith('# '),
        heading2: currentLine.trimStart().startsWith('## '),
        heading3: currentLine.trimStart().startsWith('### '),
        bulletList: currentLine.trimStart().startsWith('- '),
        numberedList: /^\d+\.\s/.test(currentLine.trimStart()),
        quote: currentLine.trimStart().startsWith('> '),
        code: /`([^`]+)`/.test(selectedText) || isWithinPattern(text, start, end, '`', '`'),
      });
    };

    detectFormatting();
  }, [content, editorRef.current?.selectionStart, editorRef.current?.selectionEnd]);

  // Helper function to check if cursor is within a pattern
  const isWithinPattern = (text: string, start: number, end: number, openPattern: string, closePattern: string): boolean => {
    // Look backwards for opening pattern
    let openIndex = -1;
    for (let i = start - 1; i >= 0; i--) {
      if (text.substring(i, i + openPattern.length) === openPattern) {
        openIndex = i;
        break;
      }
      // Stop if we hit a newline
      if (text[i] === '\n') break;
    }

    // Look forwards for closing pattern
    let closeIndex = -1;
    for (let i = end; i < text.length; i++) {
      if (text.substring(i, i + closePattern.length) === closePattern) {
        closeIndex = i;
        break;
      }
      // Stop if we hit a newline
      if (text[i] === '\n') break;
    }

    return openIndex !== -1 && closeIndex !== -1 && openIndex < start && closeIndex >= end;
  };

  // Add to history when content changes
  const addToHistory = (newContent: string, cursorPosition: number) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ content: newContent, cursorPosition });

    // Limit history to 50 items
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  // Handle content change
  const handleContentChange = (newContent: string) => {
    onChange(newContent);
    const cursorPosition = editorRef.current?.selectionStart || 0;
    addToHistory(newContent, cursorPosition);
  };

  // Undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(previousState.content);

      // Restore cursor position
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = previousState.cursorPosition;
          editorRef.current.selectionEnd = previousState.cursorPosition;
          editorRef.current.focus();
        }
      }, 0);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(nextState.content);

      // Restore cursor position
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = nextState.cursorPosition;
          editorRef.current.selectionEnd = nextState.cursorPosition;
          editorRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
    if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Trigger formatting detection on selection change
    setTimeout(() => {
      const textarea = editorRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        // Force re-render to update active formats
        setActiveFormats(prev => ({ ...prev }));
      }
    }, 0);
  };

  // Simple toolbar actions
  const insertFormat = (before: string, after: string = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    handleContentChange(newText);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  // Button class helper
  const getButtonClass = (isActive: boolean) => {
    return `rounded p-2 transition-colors ${isActive
      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
      }`;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-800">
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={historyIndex === 0}
          className={`rounded p-2 transition-colors ${historyIndex === 0
            ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
            }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={historyIndex === history.length - 1}
          className={`rounded p-2 transition-colors ${historyIndex === history.length - 1
            ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
            }`}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => insertFormat('# ', '\n')}
          className={getButtonClass(activeFormats.heading1)}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('## ', '\n')}
          className={getButtonClass(activeFormats.heading2)}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('### ', '\n')}
          className={getButtonClass(activeFormats.heading3)}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => insertFormat('**', '**')}
          className={getButtonClass(activeFormats.bold)}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('*', '*')}
          className={getButtonClass(activeFormats.italic)}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('~~', '~~')}
          className={getButtonClass(activeFormats.strikethrough)}
          title="Strikethrough"
        >
          <Underline className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Lists and quotes */}
        <button
          type="button"
          onClick={() => insertFormat('- ', '\n')}
          className={getButtonClass(activeFormats.bulletList)}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('1. ', '\n')}
          className={getButtonClass(activeFormats.numberedList)}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('> ', '\n')}
          className={getButtonClass(activeFormats.quote)}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('`', '`')}
          className={getButtonClass(activeFormats.code)}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Links and images */}
        <button
          type="button"
          onClick={() => insertFormat('[', '](url)')}
          className={getButtonClass(false)}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('![alt](', ')')}
          className={getButtonClass(false)}
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Editor */}
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onMouseUp={() => {
          // Update active formats when selection changes via mouse
          setTimeout(() => setActiveFormats(prev => ({ ...prev })), 0);
        }}
        className="w-full min-h-[400px] resize-y border-0 bg-white p-4 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white font-mono text-sm"
        placeholder="Write your content here... (Markdown supported)"
        required
      />

      {/* Footer with stats and shortcuts */}
      <div className="flex items-center justify-between border-t border-gray-300 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {content.length} characters
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="hidden sm:inline">Ctrl+Z: Undo</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Ctrl+Shift+Z: Redo</span>
        </div>
      </div>
    </div>
  );
}