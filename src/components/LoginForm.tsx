import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-x-hidden">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Responsive Back button */}
        {onBackToLanding && (
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="outline" 
              onClick={onBackToLanding}
              className="w-full sm:w-auto border-2 border-blue-400/50 bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/30 text-white hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:border-blue-300 font-semibold px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Back to Home
            </Button>
          </div>
        )}
        
        {/* Responsive Login Card */}
        <Card className="shadow-2xl border-2 border-blue-400/30 bg-black/40 backdrop-blur-xl relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-indigo-500/50 rounded-lg blur-sm opacity-75"></div>
          
          <div className="relative bg-black/60 backdrop-blur-sm rounded-lg">
            <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
              {/* Responsive Logo section */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-2xl">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                    Demo Tracker
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-300 font-medium">Knowledge Sharing Platform</p>
                </div>
              </div>
              
              <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </CardTitle>
              <CardDescription className="text-center text-blue-200/90 leading-relaxed text-sm sm:text-base">
                {isLogin 
                  ? 'Sign in to access your demo management dashboard'
                  : 'Create your account and start managing demos'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-semibold text-sm">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required={!isLogin}
                        className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-white/20 bg-white/10 text-white placeholder:text-blue-200/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 font-medium text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-semibold text-sm">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-white/20 bg-white/10 text-white placeholder:text-blue-200/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 font-medium text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-semibold text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 border-2 border-white/20 bg-white/10 text-white placeholder:text-blue-200/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 font-medium text-sm sm:text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white font-semibold text-sm">Account Type</Label>
                    <div className="relative">
                      <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'employee' }))}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 h-10 sm:h-12 border-2 border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 bg-white/10 text-white transition-all duration-200 font-medium text-sm sm:text-base"
                      >
                        <option value="employee" className="bg-slate-800 text-white">Employee (Fresher)</option>
                        <option value="admin" className="bg-slate-800 text-white">Admin (Senior Employee)</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {/* Responsive Sign In button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-base sm:text-lg rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-blue-400/30 hover:border-blue-300/50 mt-4 sm:mt-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 sm:mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-300 hover:text-white font-semibold transition-colors duration-200 hover:underline text-sm sm:text-base"
                >
                  {isLogin 
                    ? "Don't have an account? Create account"
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
              
              {isLogin && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg border-2 border-blue-400/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <p className="font-bold text-blue-200 text-sm sm:text-base">Demo Credentials</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col p-2 sm:p-3 bg-white/10 rounded-md space-y-1">
                      <span className="text-blue-200 font-semibold text-xs sm:text-sm">Admin:</span>
                      <span className="text-blue-100 font-mono text-xs break-all">admin@demo.com / admin123</span>
                    </div>
                    <div className="flex flex-col p-2 sm:p-3 bg-white/10 rounded-md space-y-1">
                      <span className="text-blue-200 font-semibold text-xs sm:text-sm">Employee:</span>
                      <span className="text-blue-100 font-mono text-xs break-all">employee@demo.com / emp123</span>
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
