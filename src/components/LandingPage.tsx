
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, BarChart3, Shield, Zap, Star, Check, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Demo Scheduling",
      description: "AI-powered scheduling that optimizes demo sessions for maximum impact and engagement."
    },
    {
      icon: Users,
      title: "Advanced User Management",
      description: "Comprehensive user roles, permissions, and team collaboration tools for enterprise teams."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Deep insights into demo performance, user engagement, and conversion metrics."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with SSO, SAML, and advanced compliance features."
    },
    {
      icon: Zap,
      title: "Automation Workflows",
      description: "Automated follow-ups, personalized content delivery, and smart notifications."
    },
    {
      icon: Star,
      title: "Premium Support",
      description: "24/7 dedicated support with priority handling and custom onboarding."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 team members",
        "Basic demo scheduling",
        "Standard analytics",
        "Email support"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Advanced features for growing teams",
      features: [
        "Up to 25 team members",
        "Advanced scheduling & automation",
        "Real-time analytics dashboard",
        "Priority support",
        "Custom integrations",
        "Advanced user management"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations",
      features: [
        "Unlimited team members",
        "Enterprise security & compliance",
        "Dedicated account manager",
        "Custom workflows",
        "API access",
        "On-premise deployment options"
      ],
      highlighted: false
    }
  ];

  const handleWatchDemo = () => {
    // Demo video functionality disabled
  };

  const handleContactSales = () => {
    window.open('mailto:sales@demotracker.com?subject=Enterprise Inquiry', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Demo Tracker
                </h1>
                <p className="text-xs text-blue-300 font-medium">Knowledge Sharing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={onLoginClick} 
                className="hidden sm:inline-flex border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 shadow-lg"
              >
                Sign In
              </Button>
              <Button 
                onClick={onLoginClick} 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
              Transform Your Demo Experience
            </h1>
            <p className="text-lg text-blue-100/90 mt-4 leading-relaxed max-w-3xl mx-auto">
              Empower your team with intelligent demo scheduling, advanced analytics, and seamless knowledge sharing. 
              The all-in-one platform for modern demo management.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
              <Button 
                size="lg" 
                onClick={onLoginClick}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg px-8 py-3 h-12 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
              >
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleWatchDemo}
                disabled
                className="w-full sm:w-auto text-lg px-8 py-3 h-12 border-white/20 text-white/40 cursor-not-allowed opacity-40 bg-white/5"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-black/40 backdrop-blur-sm px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Premium Features</h2>
            <p className="text-lg text-blue-100/90 max-w-3xl mx-auto mt-3">
              Discover the powerful features that make Demo Tracker the preferred choice for enterprise teams worldwide.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group h-full">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-5 w-5 text-blue-300" />
                  </div>
                  <CardTitle className="text-lg text-white mt-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-100/80 leading-relaxed text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-lg text-blue-100/90 max-w-3xl mx-auto mt-3">
              Flexible pricing options designed to scale with your team's needs.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-2xl h-full backdrop-blur-sm ${
                plan.highlighted 
                  ? 'border-blue-400 bg-white/15 lg:scale-105 shadow-xl' 
                  : 'border-white/20 bg-white/10 hover:border-blue-400/50'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center mt-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2 text-blue-100/80">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-1 flex flex-col">
                  <ul className="space-y-1 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-100/90 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-3 shadow-lg hover:shadow-xl transition-all duration-200 ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white' 
                        : 'border-white/30 text-white hover:bg-white/20 hover:border-white/50'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={plan.name === 'Enterprise' ? handleContactSales : onLoginClick}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Transform Your Demo Process?
          </h2>
          <p className="text-lg text-blue-100 mt-3">
            Join thousands of teams who have already streamlined their demo workflows with Demo Tracker.
          </p>
          <Button 
            size="lg" 
            onClick={onLoginClick}
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 h-12 mt-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm text-blue-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-md flex items-center justify-center">
              <Calendar className="h-3 w-3 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Demo Tracker</span>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm">&copy; 2024 Demo Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
