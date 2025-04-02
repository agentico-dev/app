
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Layers,
  Code,
  ServerCrash,
  Wrench,
  Users,
  PlugZap,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: 'Quick MCP Server Setup',
      description: 'Spin up an MCP-compliant server based on Intent and Context.',
      icon: <ServerCrash className="h-10 w-10 text-primary" />
    },
    {
      title: 'Standardized Implementation',
      description: 'Ensure compatibility across different Server and Tool implementations, no matter the vendor/ISV.',
      icon: <Code className="h-10 w-10 text-primary" />
    },
    {
      title: 'Simplified Complexity',
      description: 'Eliminate scaffolding and unnecessary complexity to focus on building the AI applications logic.',
      icon: <Layers className="h-10 w-10 text-primary" />
    },
    {
      title: 'Developer-First Approach',
      description: 'Built by developers, for developers, keeping humans in control with standardized tools.',
      icon: <Users className="h-10 w-10 text-primary" />
    },
    {
      title: 'Tool Compatibility',
      description: 'Seamlessly integrate with existing and future AI tools.',
      icon: <Wrench className="h-10 w-10 text-primary" />
    },
    {
      title: 'Collaborative Workflows',
      description: 'Work together effectively with standardized approaches.',
      icon: <PlugZap className="h-10 w-10 text-primary" />
    }
  ];
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
      {/* Floating background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 15, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div 
        className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-700 z-0" />
        <div 
          className="absolute inset-0 opacity-20 z-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        
        <div className="container mx-auto px-4 py-24 flex flex-col lg:flex-row items-center relative z-10">
          <motion.div 
            className="lg:w-1/2 lg:pr-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white"
              variants={fadeInUp}
            >
              Standardizing MCP for the Future of AI
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-white/90"
              variants={fadeInUp}
            >
              Agentico provides a structured, reusable approach to MCP implementation, making integration seamless across your AI projects.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:shadow-lg group"
                >
                  Try Agentico for Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 mt-10 lg:mt-0"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.2,
              ease: [0.215, 0.61, 0.355, 1] 
            }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-purple-600 rounded-lg blur opacity-75"></div>
              <div className="relative bg-background rounded-lg shadow-xl p-6">
                <div className="border border-border rounded-md bg-card p-4 font-mono text-sm overflow-hidden">
                  <pre className="text-primary-foreground">
                    <code>{`// Initialize Agentico MCP server
import { AgenticoServer } from 'agentico';

const server = new AgenticoServer({
  tools: standardTools,
  contextProviders: myContextProviders,
});

// Start serving MCP requests
server.listen(3000);

// That's it! MCP-compliant and ready to go.`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Problem Statement */}
      <motion.section 
        className="py-24 bg-muted/30 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'radial-gradient(circle at 10% 20%, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.02) 90%)',
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              The Problem with MCP Today
            </motion.h2>
            <motion.p 
              className="text-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The Model Context Protocol (MCP) is reshaping AI integrations, but the MCP-servers implementation lacks standardization, making adoption cumbersome and time-consuming.
            </motion.p>
            <motion.p 
              className="text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Developers need a clear, structured approach to simplify implementation and ensure scalability and maintainability. Without standards, we're creating chaos instead of innovation.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-24 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-background to-background/50 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The Agentico Solution
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  hoveredFeature === index 
                    ? 'bg-gradient-to-br from-primary/5 to-accent/5 shadow-xl scale-105' 
                    : 'bg-card shadow-md'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="mb-4"
                  whileHover={{ 
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-700 z-0" />
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0l30 30-30 30L0 30 30 0zm0 6.5L6.5 30 30 53.5 53.5 30 30 6.5z" fill="%23ffffff" fill-opacity="1" fill-rule="nonzero"/%3E%3C/svg%3E%0A")',
            backgroundSize: '30px 30px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '30px 30px'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ 
                rotate: [0, 5, -5, 0],
                transition: { duration: 1, repeat: Infinity }
              }}
            >
              <Sparkles className="h-12 w-12 mx-auto mb-6 text-white" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Let's Build Developer-First AI Together
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join us in building an ecosystem where AI serves developers effectively—where humans stay in control!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-primary font-bold group hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Start Building with Agentico 
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center mb-4 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/favicon-32x32.png" alt="Agentico Logo" className="h-8 w-8 mr-2" />
              <span className="font-semibold text-lg">Agentico</span>
            </motion.div>
            <motion.div 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              &copy; {new Date().getFullYear()} Agentico by <a href='https://rebelion.la' className="hover:text-primary transition-colors">La Rebelion Labs</a>. Building the future of standardized AI.
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
