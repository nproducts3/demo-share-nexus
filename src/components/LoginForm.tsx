
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden p-4">
      {/* Background decorative elements */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="w-full max-w-md z-10 relative">
        {onBackToLanding && (
          <Button 
            variant="ghost" 
            onClick={onBackToLanding}
            className="mb-6 sm:mb-8 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        )}
        
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg relative overflow-hidden">
          {/* Premium glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg blur opacity-25"></div>
          <div className="relative bg-white rounded-lg">
            <CardHeader className="space-y-1 text-center pb-6 sm:pb-8 pt-6 sm:pt-8 px-6 sm:px-8">
              {/* Premium logo section */}
              <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg relative">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Demo Tracker
                  </h1>
                  <p className="text-xs text-blue-600 font-medium">Premium Edition</p>
                </div>
              </div>
              
              <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Join Premium'}
              </CardTitle>
              <CardDescription className="text-center text-slate-600 text-sm sm:text-base leading-relaxed">
                {isLogin 
                  ? 'Access your premium demo management dashboard'
                  : 'Unlock advanced features and insights'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium text-sm">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required={!isLogin}
                        className="pl-10 sm:pl-11 h-10 sm:h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="pl-10 sm:pl-11 h-10 sm:h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-10 sm:h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-700 font-medium text-sm">Account Type</Label>
                    <div className="relative">
                      <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'employee' }))}
                        className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 h-10 sm:h-12 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all duration-200 text-sm sm:text-base"
                      >
                        <option value="employee">Employee (Fresher)</option>
                        <option value="admin">Admin (Senior Employee)</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>{isLogin ? 'Sign In' : 'Create Premium Account'}</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Create premium account"
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
              
              {isLogin && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-blue-800">Demo Credentials</p>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
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
  );
};
