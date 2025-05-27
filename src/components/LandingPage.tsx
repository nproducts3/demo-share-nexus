
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, BarChart3, Shield, Zap, Star, Check, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Demo Tracker
                </h1>
                <p className="text-xs text-slate-500 font-medium">Knowledge Sharing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button variant="outline" onClick={onLoginClick} className="hidden sm:inline-flex">
                Sign In
              </Button>
              <Button onClick={onLoginClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 leading-tight">
              Transform Your Demo Experience
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Empower your team with intelligent demo scheduling, advanced analytics, and seamless knowledge sharing. 
              The all-in-one platform for modern demo management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={onLoginClick}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
              >
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Premium Features</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Discover the powerful features that make Demo Tracker the preferred choice for enterprise teams worldwide.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-200/60 hover:shadow-lg transition-all duration-300 group h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your team's needs.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-xl h-full ${
                plan.highlighted 
                  ? 'border-blue-500 shadow-lg lg:scale-105' 
                  : 'border-slate-200/60 hover:border-blue-300'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-slate-900">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center mt-4">
                    <span className="text-3xl sm:text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : ''
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={onLoginClick}
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
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Demo Process?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Join thousands of teams who have already streamlined their demo workflows with Demo Tracker.
          </p>
          <Button 
            size="lg" 
            onClick={onLoginClick}
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
          >
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Demo Tracker</span>
          </div>
          <div className="text-center">
            <p>&copy; 2024 Demo Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
