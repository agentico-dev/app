
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy, FileJson, FileText } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'json' | 'yaml';
  className?: string;
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, language = 'json', className, readOnly = false }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Update local state when the parent value changes
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  const handleCopy = () => {
    navigator.clipboard.writeText(localValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const formatCode = () => {
    if (readOnly) return;
    
    try {
      if (language === 'json') {
        const formatted = JSON.stringify(JSON.parse(localValue || '{}'), null, 2);
        setLocalValue(formatted);
        onChange(formatted);
      }
      // For YAML we would need to use a library like js-yaml which requires installation
    } catch (error) {
      console.error("Failed to format code:", error);
    }
  };

  return (
    <div className={cn("relative border rounded-md", className, readOnly ? "opacity-75" : "")}>
      <div className="flex items-center justify-between p-2 bg-muted border-b">
        <div className="flex items-center space-x-2">
          {language === 'json' ? (
            <FileJson className="h-4 w-4 text-muted-foreground" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-xs font-medium">{language.toUpperCase()}</span>
          {readOnly && <span className="text-xs text-muted-foreground ml-2">(Read Only)</span>}
        </div>
        <div className="flex items-center space-x-2">
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={formatCode}
              title="Format code"
              type="button" // Important to avoid submitting the form
              disabled={readOnly}
            >
              Format
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy to clipboard"}
            type="button" // Important to avoid submitting the form
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      <textarea
        value={localValue}
        onChange={handleChange}
        className={cn(
          "font-mono text-sm p-3 w-full min-h-[200px] outline-none focus:ring-0 resize-y",
          readOnly && "bg-muted cursor-not-allowed"
        )}
        spellCheck="false"
        data-gramm="false"
        readOnly={readOnly}
      />
    </div>
  );
}

export default CodeEditor;
