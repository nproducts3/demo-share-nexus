
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Eye, EyeOff, Mail, Lock, User, Crown } from 'lucide-react';

interface LoginFormProps {
  onBackToLanding?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onBackToLanding }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as 'admin' | 'employee'
  });
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData.name, formData.email, formData.password, formData.role);
    }
    
    if (success) {
      toast({
        title: isLogin ? "Login successful!" : "Registration successful!",
        description: `Welcome ${isLogin ? 'back' : 'to Demo Tracker'}!`,
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="w-full max-w-md mx-6">
        {/* Back button */}
        {onBackToLanding && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={onBackToLanding}
              className="border-white/20 hover:bg-white/10 text-white hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        )}
        
        {/* Login Card */}
        <Card className="shadow-2xl border-white/10 bg-black/20 backdrop-blur-xl relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 rounded-lg blur opacity-50"></div>
          
          <div className="relative bg-black/40 backdrop-blur-sm rounded-lg">
            <CardHeader className="text-center pb-6 pt-8 px-8">
              {/* Logo section */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                    Demo Tracker
                  </h1>
                  <p className="text-xs text-blue-300 font-medium">Knowledge Sharing Platform</p>
                </div>
              </div>
              
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </CardTitle>
              <CardDescription className="text-center text-blue-200/80 leading-relaxed">
                {isLogin 
                  ? 'Sign in to access your demo management dashboard'
                  : 'Create your account and start managing demos'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required={!isLogin}
                        className="pl-11 h-12 border-white/20 bg-white/10 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="pl-11 h-12 border-white/20 bg-white/10 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pl-11 pr-11 h-12 border-white/20 bg-white/10 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white font-medium">Account Type</Label>
                    <div className="relative">
                      <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'employee' }))}
                        className="w-full pl-11 pr-4 py-3 h-12 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 bg-white/10 text-white transition-all duration-200"
                      >
                        <option value="employee" className="bg-slate-800 text-white">Employee (Fresher)</option>
                        <option value="admin" className="bg-slate-800 text-white">Admin (Senior Employee)</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-300 hover:text-white font-medium transition-colors duration-200 hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Create account"
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
              
              {isLogin && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-400/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                    <p className="font-semibold text-blue-200">Demo Credentials</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white/10 rounded-lg space-y-1 sm:space-y-0">
                      <span className="text-blue-200 font-medium">Admin:</span>
                      <span className="text-blue-100 font-mono break-all">admin@demo.com / admin123</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white/10 rounded-lg space-y-1 sm:space-y-0">
                      <span className="text-blue-200 font-medium">Employee:</span>
                      <span className="text-blue-100 font-mono break-all">employee@demo.com / emp123</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};
