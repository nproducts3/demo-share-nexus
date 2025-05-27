
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-x-hidden">
      {/* Responsive Header */}
      <header className="border-b-2 border-blue-400/30 bg-black/40 backdrop-blur-xl sticky top-0 z-50 shadow-2xl w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-2xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Demo Tracker
                </h1>
                <p className="text-xs text-blue-300 font-medium hidden sm:block">Knowledge Sharing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button 
                variant="outline" 
                onClick={onLoginClick} 
                className="hidden md:inline-flex border-2 border-blue-400/50 bg-blue-500/20 text-white hover:bg-blue-500/30 hover:border-blue-300 transition-all duration-200 shadow-xl font-semibold px-4 lg:px-6 py-2 lg:py-3 h-10 lg:h-12 text-sm lg:text-base"
              >
                Sign In
              </Button>
              <Button 
                onClick={onLoginClick} 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-200 font-bold px-4 sm:px-6 lg:px-8 py-2 lg:py-3 h-10 lg:h-12 border-2 border-blue-400/30 hover:border-blue-300/50 text-sm lg:text-base"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight mb-4 sm:mb-6">
              Transform Your Demo Experience
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100/90 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-4">
              Empower your team with intelligent demo scheduling, advanced analytics, and seamless knowledge sharing. 
              The all-in-one platform for modern demo management.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                onClick={onLoginClick}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg sm:text-xl px-8 sm:px-12 py-3 sm:py-4 h-12 sm:h-14 lg:h-16 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 font-bold border-2 border-blue-400/30 hover:border-blue-300/50"
              >
                Start Free Trial <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleWatchDemo}
                disabled
                className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-12 py-3 sm:py-4 h-12 sm:h-14 lg:h-16 border-2 border-white/20 text-white/40 cursor-not-allowed opacity-40 bg-white/5"
              >
                <Play className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                Watch Demo (Coming Soon)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-black/50 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Premium Features</h2>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-4xl mx-auto px-4">
              Discover the powerful features that make Demo Tracker the preferred choice for enterprise teams worldwide.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-blue-400/30 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group h-full shadow-xl hover:shadow-2xl">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-white mt-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-100/80 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Pricing Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Choose Your Plan</h2>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-4xl mx-auto px-4">
              Flexible pricing options designed to scale with your team's needs.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-2xl h-full backdrop-blur-sm ${
                plan.highlighted 
                  ? 'border-blue-400 bg-white/15 lg:scale-105 shadow-2xl' 
                  : 'border-blue-400/30 bg-white/10 hover:border-blue-400/50'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full font-bold shadow-xl text-sm sm:text-base">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-xl sm:text-2xl text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center mt-3">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200 ml-2 text-base sm:text-lg">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3 text-blue-100/80 text-sm sm:text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-100/90 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-4 shadow-xl hover:shadow-2xl transition-all duration-200 font-bold py-2 sm:py-3 h-10 sm:h-12 text-sm sm:text-base ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-2 border-blue-400/30 hover:border-blue-300/50' 
                        : 'border-2 border-blue-400/50 bg-blue-500/20 text-white hover:bg-blue-500/30 hover:border-blue-300'
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

      {/* Responsive CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Transform Your Demo Process?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
            Join thousands of teams who have already streamlined their demo workflows with Demo Tracker.
          </p>
          <Button 
            size="lg" 
            onClick={onLoginClick}
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-lg sm:text-xl px-8 sm:px-12 py-3 sm:py-4 h-12 sm:h-14 lg:h-16 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 font-bold"
          >
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="bg-black/60 backdrop-blur-sm text-blue-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-blue-400/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-md sm:rounded-lg flex items-center justify-center shadow-xl">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">Demo Tracker</span>
          </div>
          <div className="text-center mt-3 sm:mt-4">
            <p className="text-sm sm:text-base">&copy; 2024 Demo Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
