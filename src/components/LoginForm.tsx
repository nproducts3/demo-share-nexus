
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background decorative elements matching homepage */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Container with consistent max-width and padding like homepage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md relative z-10">
          {/* Back button with consistent styling */}
          {onBackToLanding && (
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={onBackToLanding}
                className="border-slate-200/60 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          )}
          
          {/* Login Card with consistent design */}
          <Card className="shadow-xl border-slate-200/60 bg-white/95 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-lg blur opacity-30"></div>
            
            <div className="relative bg-white rounded-lg">
              <CardHeader className="space-y-1 text-center pb-8 pt-8 px-8">
                {/* Logo section with consistent branding */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                      Demo Tracker
                    </h1>
                    <p className="text-xs text-blue-600 font-medium">Knowledge Sharing Platform</p>
                  </div>
                </div>
                
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </CardTitle>
                <CardDescription className="text-center text-slate-600 leading-relaxed">
                  {isLogin 
                    ? 'Sign in to access your demo management dashboard'
                    : 'Create your account and start managing demos'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required={!isLogin}
                          className="pl-11 h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="pl-11 h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="pl-11 pr-11 h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-slate-700 font-medium">Account Type</Label>
                      <div className="relative">
                        <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <select
                          id="role"
                          value={formData.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'employee' }))}
                          className="w-full pl-11 pr-4 py-3 h-12 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all duration-200"
                        >
                          <option value="employee">Employee (Fresher)</option>
                          <option value="admin">Admin (Senior Employee)</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
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
                
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
                  >
                    {isLogin 
                      ? "Don't have an account? Create account"
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
                
                {isLogin && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                      <p className="font-semibold text-blue-800">Demo Credentials</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white/60 rounded-lg space-y-1 sm:space-y-0">
                        <span className="text-blue-700 font-medium">Admin:</span>
                        <span className="text-blue-600 font-mono break-all">admin@demo.com / admin123</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white/60 rounded-lg space-y-1 sm:space-y-0">
                        <span className="text-blue-700 font-medium">Employee:</span>
                        <span className="text-blue-600 font-mono break-all">employee@demo.com / emp123</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
