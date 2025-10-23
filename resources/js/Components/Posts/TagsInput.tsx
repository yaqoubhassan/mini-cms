import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ tags, onChange }: Props) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      onChange([...tags, trimmedInput]);
      setInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="rounded-full transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="button"
          onClick={addTag}
          disabled={!input.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Press Enter or click Add to add tags. Press Backspace to remove the last tag.
      </p>
    </div>
  );
}