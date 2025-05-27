
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
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Demo Tracker
                </h1>
                <p className="text-xs text-blue-300 font-medium">Knowledge Sharing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onLoginClick} className="hidden sm:inline-flex border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button onClick={onLoginClick} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
              Transform Your Demo Experience
            </h1>
            <p className="text-xl text-blue-100/80 mt-6 leading-relaxed max-w-3xl mx-auto">
              Empower your team with intelligent demo scheduling, advanced analytics, and seamless knowledge sharing. 
              The all-in-one platform for modern demo management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
              <Button 
                size="lg" 
                onClick={onLoginClick}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg px-10 py-4 h-14 shadow-2xl"
              >
                Start Free Trial <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleWatchDemo}
                disabled
                className="w-full sm:w-auto text-lg px-10 py-4 h-14 border-white/20 text-white/50 cursor-not-allowed opacity-50"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/30 backdrop-blur-sm px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Premium Features</h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto mt-4">
              Discover the powerful features that make Demo Tracker the preferred choice for enterprise teams worldwide.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group h-full">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-blue-300" />
                  </div>
                  <CardTitle className="text-xl text-white mt-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-100/70 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto mt-4">
              Flexible pricing options designed to scale with your team's needs.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-2xl h-full backdrop-blur-sm ${
                plan.highlighted 
                  ? 'border-blue-400 bg-white/10 lg:scale-105 shadow-xl' 
                  : 'border-white/10 bg-white/5 hover:border-blue-400/50'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center mt-3">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3 text-blue-100/70">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-100/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-4 ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white' 
                        : 'border-white/20 text-white hover:bg-white/10'
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
      <section className="py-16 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-sm px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to Transform Your Demo Process?
          </h2>
          <p className="text-xl text-blue-100 mt-4">
            Join thousands of teams who have already streamlined their demo workflows with Demo Tracker.
          </p>
          <Button 
            size="lg" 
            onClick={onLoginClick}
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-4 h-14 mt-8 shadow-xl"
          >
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm text-blue-100 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Demo Tracker</span>
          </div>
          <div className="text-center mt-4">
            <p>&copy; 2024 Demo Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
