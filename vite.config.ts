import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [".agentico.dev", ".lovable.app", ".lovableproject.com"],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and core dependencies - ensure React always stays together
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/use-sync-external-store') ||
              id.includes('node_modules/@tanstack/react-query')) {
            return 'react-vendor';
          }
          
          // Router-related
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run')) {
            return 'router';
          }
          
          // UI components from Radix
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-components';
          }
          
          // Form handling libraries
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform') || 
              id.includes('node_modules/zod')) {
            return 'form-components';
          }
          
          // Data management libraries
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'react-query';
          }

          // Supabase
          if (id.includes('node_modules/@supabase/supabase-js')) {
            return 'supabase';
          }
          
          // Charting libraries
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          
          // Utils and other libraries
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/clsx') || 
              id.includes('node_modules/tailwind-merge')) {
            return 'utils';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
}));
