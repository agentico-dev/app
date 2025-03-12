import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
  // Some chunks are larger than 500 kB after minification, 
  // below to fix the chunk size issues by implementing code-splitting and dynamic imports
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          'form-components': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
          'data-management': [
            '@tanstack/react-query',
            '@supabase/supabase-js',
          ],
          'charts': ['recharts'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
}));
