
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
import { motion, useScroll, useTransform } from 'framer-motion';
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

  // Parallax effect variables
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
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
  
  const pulseAnimation = {
    initial: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
      {/* Animated gradient background */}
      <motion.div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(239,108,0,0.8) 0%, rgba(249,120,33,0.7) 30%, rgba(201,0,82,0.6) 70%, rgba(40,5,100,0.5) 100%)',
          y: backgroundY,
        }}
      />
      
      <div className="absolute inset-0 w-full h-full bg-black/20 backdrop-blur-[2px] z-0" />
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl z-0"
        animate={{
          x: [0, 15, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div 
        className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-accent/20 blur-3xl z-0"
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Hero Section */}
      <motion.header className="relative pt-24 pb-32 overflow-hidden z-10" style={{ opacity: heroOpacity }}>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 lg:pr-10 z-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 mb-6 rounded-full"
              variants={fadeInUp}
            >
              <span className="text-sm font-medium text-white">Introducing Agentico</span>
            </motion.div>

            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white"
              variants={fadeInUp}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Where AI<br />Meets Standards
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl mb-8 text-white/90 max-w-lg"
              variants={fadeInUp}
            >
              Agentico provides a structured, reusable approach to MCP implementation, making integration seamless across your AI projects.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-accent to-accent/80 text-primary hover:from-accent/90 hover:to-accent/70 shadow-lg hover:shadow-accent/25 transition-all duration-300 hover:translate-y-[-2px] font-medium"
                  >
                    Try Agentico for Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 font-medium"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 mt-16 lg:mt-0 z-10"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.2,
              ease: [0.215, 0.61, 0.355, 1] 
            }}
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              initial="initial"
              animate="pulse"
              variants={pulseAnimation}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 mix-blend-overlay" />
              <img 
                src="/lovable-uploads/087344af-bf48-481d-acab-ffef1a303c98.png" 
                alt="AI Robot Assistant" 
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Problem Statement */}
      <motion.section 
        className="py-24 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-2">The Challenge</span>
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
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
        className="py-24 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-card/50 backdrop-blur-sm z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent mb-2">Our Solution</span>
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              The Agentico Advantage
            </motion.h2>
          </motion.div>
          
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
                className={`p-6 rounded-xl transition-all duration-300 ${
                  hoveredFeature === index 
                    ? 'bg-gradient-to-br from-primary/10 to-accent/5 shadow-xl backdrop-blur-sm border border-white/10' 
                    : 'bg-card/80 shadow-md backdrop-blur-sm border border-white/5'
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

      {/* Code Block Section */}
      <motion.section 
        className="py-16 relative z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-accent/50 to-purple-600/50 rounded-lg blur-lg opacity-75"></div>
              <div className="relative bg-background/90 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs font-medium text-gray-400">server.js</div>
                </div>
                <div className="border border-border rounded-md bg-card/70 p-4 font-mono text-sm overflow-hidden backdrop-blur-sm">
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
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 relative z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-700 to-primary z-0" />
        <motion.div 
          className="absolute inset-0 opacity-20"
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
              className="inline-block"
            >
              <Sparkles className="h-12 w-12 mx-auto mb-6 text-white" />
            </motion.div>
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6 text-white"
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="bg-white text-primary font-bold shadow-xl shadow-primary/20 hover:shadow-lg transition-all duration-300"
                  >
                    Start Building with Agentico 
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 relative z-10 bg-card/90 backdrop-blur-md border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center mb-4 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src="/favicon-32x32.png" alt="Agentico Logo" className="h-8 w-8 mr-2" />
              <span className="font-semibold text-lg">Agentico</span>
            </motion.div>
            <motion.div 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
