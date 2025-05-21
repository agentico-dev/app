
import { useState, useEffect } from 'react';
import { FilesIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { formatJson, isValidJson } from '@/utils/formatter';

interface ManifestCodeViewerProps {
  manifestId: bigint | null;
  isLoading: boolean;
}

export function ManifestCodeViewer({ manifestId, isLoading: initialLoading }: ManifestCodeViewerProps) {
  const [codeContent, setCodeContent] = useState('');
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [contentLanguage, setContentLanguage] = useState<'json' | 'yaml'>('json');
  const [useMonaco, setUseMonaco] = useState(true);
  
  // Fetch code content when manifestId changes
  useEffect(() => {
    const fetchManifestContent = async () => {
      if (manifestId && !codeContent) {
        setIsCodeLoading(true);
        try {
          // response format is: { content: {manifest: string}, status_code: number }
          const { data: manifestData, error } = await supabase
            .rpc('get_generated_manifest', { manifest_id: manifestId });
          
          if (error) throw error;
          
          // Detect content type and set language
          const contentStr = manifestData?.content?.manifest || '';
          detectContentLanguage(contentStr);
          
          // Set content with a small delay to ensure UI is ready
          setTimeout(() => {
            setCodeContent(contentStr);
            setIsCodeLoading(false);
          }, 100);
          
        } catch (error) {
          console.error('Error fetching manifest code:', error);
          toast.error(`Failed to load code content: ${error.message}`);
          setIsCodeLoading(false);
          setUseMonaco(false); // Fallback to textarea on error
        }
      }
    };

    fetchManifestContent();
  }, [manifestId, codeContent]);

  // Function to detect content language (JSON or YAML)
  const detectContentLanguage = (content: string) => {
    if (!content.trim()) return;
    
    if (isValidJson(content)) {
      setContentLanguage('json');
    } else {
      setContentLanguage('yaml');
    }
  };
  
  // Format content based on language
  const formatContent = () => {
    try {
      if (contentLanguage === 'json') {
        const formattedContent = formatJson(codeContent);
        setCodeContent(formattedContent);
        toast.success('Content formatted as JSON');
      } else {
        toast.success('Content formatted as YAML');
      }
    } catch (error) {
      console.error('Error formatting content:', error);
      toast.error('Failed to format content. Invalid syntax.');
    }
  };
  
  // Handle language toggle
  const toggleLanguage = () => {
    setContentLanguage(prev => prev === 'json' ? 'yaml' : 'json');
  };

  return (
    <div className="mt-6 border rounded-md overflow-hidden">
      <div className="p-2 bg-muted border-b flex items-center justify-between">
        <div className="flex items-center">
          <FilesIcon className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Server Code View</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={formatContent} 
            className="text-xs hover:underline"
          >
            Format
          </button>
          <button 
            onClick={toggleLanguage} 
            className="text-xs hover:underline mx-2"
          >
            {contentLanguage.toUpperCase()}
          </button>
        </div>
      </div>
      <div className="h-[500px]">
        {isCodeLoading || initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading code...</span>
          </div>
        ) : (
          <CodeEditor
            value={codeContent}
            onChange={(value) => setCodeContent(value)}
            language={contentLanguage}
            height="500px"
          />
        )}
      </div>
    </div>
  );
}
