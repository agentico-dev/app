
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy, FileJson, FileText } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'json' | 'yaml';
  className?: string;
}

export function CodeEditor({ value, onChange, language = 'json', className }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCode = () => {
    try {
      if (language === 'json') {
        const formatted = JSON.stringify(JSON.parse(value || '{}'), null, 2);
        onChange(formatted);
      }
      // For YAML we would typically use a library, but for now we'll skip auto-formatting
    } catch (error) {
      console.error("Failed to format code:", error);
    }
  };

  return (
    <div className={cn("relative border rounded-md", className)}>
      <div className="flex items-center justify-between p-2 bg-muted border-b">
        <div className="flex items-center space-x-2">
          {language === 'json' ? (
            <FileJson className="h-4 w-4 text-muted-foreground" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-xs font-medium">{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={formatCode}
            title="Format code"
          >
            Format
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy to clipboard"}
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm p-3 w-full min-h-[200px] outline-none focus:ring-0 resize-y"
        spellCheck="false"
        data-gramm="false"
      />
    </div>
  );
}

export default CodeEditor;
