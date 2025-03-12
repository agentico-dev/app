
import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  
  const features = [
    {
      title: 'Quick MCP Server Setup',
      description: 'Spin up an MCP-compliant server in minutes, not days.',
      icon: <ServerCrash className="h-10 w-10 text-primary" />
    },
    {
      title: 'Standardized Implementation',
      description: 'Ensure compatibility between servers and tools with our framework.',
      icon: <Code className="h-10 w-10 text-primary" />
    },
    {
      title: 'Simplified Complexity',
      description: 'Eliminate unnecessary backend complexity to focus on building AI applications.',
      icon: <Layers className="h-10 w-10 text-primary" />
    },
    {
      title: 'Developer-First Approach',
      description: 'Built by developers, for developers, keeping humans in control.',
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/90 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-24 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Standardizing MCP for the Future of AI
            </h1>
            <p className="text-xl mb-8">
              Agentico provides a structured, reusable approach to MCP implementation, making integration seamless across your AI projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
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
          </div>
        </div>
      </header>

      {/* Problem Statement */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">The Problem with MCP Today</h2>
            <p className="text-lg mb-6">
              The Model Context Protocol (MCP) is reshaping AI integrations, but its server-side implementation lacks standardization, making adoption difficult and time-consuming.
            </p>
            <p className="text-lg">
              Developers need a clear, structured approach to simplify implementation and ensure scalability and maintainability. Without standards, we're creating chaos instead of innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Agentico Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  hoveredFeature === index ? 'bg-primary/5 scale-105' : 'bg-card'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">
              Let's Build Developer-First AI Together
            </h2>
            <p className="text-xl mb-8">
              Join us in building an ecosystem where AI serves developers effectively—where humans stay in control!
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-primary font-bold">
                Start Building with Agentico <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/favicon-32x32.png" alt="Agentico Logo" className="h-8 w-8 mr-2" />
              <span className="font-semibold text-lg">Agentico</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Agentico. Building the future of standardized MCP.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
