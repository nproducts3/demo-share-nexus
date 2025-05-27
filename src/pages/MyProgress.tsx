
import React, { useState } from 'react';
import { TrendingUp, Award, Target, Calendar, BarChart3, Users, Clock, Star, BookOpen, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Layout } from '../components/Layout';

const MyProgress = () => {
  const [timeRange, setTimeRange] = useState('6months');

  // Mock data for charts
  const progressData = [
    { month: 'Jul', sessions: 2, rating: 4.2, attendees: 15 },
    { month: 'Aug', sessions: 3, rating: 4.4, attendees: 24 },
    { month: 'Sep', sessions: 4, rating: 4.6, attendees: 32 },
    { month: 'Oct', sessions: 5, rating: 4.7, attendees: 41 },
    { month: 'Nov', sessions: 6, rating: 4.8, attendees: 48 },
    { month: 'Dec', sessions: 8, rating: 4.9, attendees: 56 },
  ];

  const technologyData = [
    { name: 'React', sessions: 12, color: '#3B82F6' },
    { name: 'JavaScript', sessions: 8, color: '#10B981' },
    { name: 'TypeScript', sessions: 6, color: '#8B5CF6' },
    { name: 'Node.js', sessions: 4, color: '#F59E0B' },
    { name: 'Python', sessions: 3, color: '#EF4444' },
  ];

  const skillLevels = [
    { skill: 'React Development', level: 85, sessions: 12, hours: 24 },
    { skill: 'JavaScript ES6+', level: 90, sessions: 8, hours: 18 },
    { skill: 'TypeScript', level: 75, sessions: 6, hours: 15 },
    { skill: 'API Development', level: 70, sessions: 4, hours: 12 },
    { skill: 'Database Design', level: 65, sessions: 3, hours: 9 },
  ];

  const achievements = [
    { title: 'First Demo', description: 'Completed your first demo session', earned: true, date: '2024-07-15' },
    { title: 'Tech Expert', description: 'Delivered 10+ sessions in React', earned: true, date: '2024-10-20' },
    { title: 'Crowd Favorite', description: 'Achieved 4.8+ average rating', earned: true, date: '2024-11-15' },
    { title: 'Knowledge Sharer', description: 'Helped 100+ attendees', earned: false, current: 87, target: 100 },
    { title: 'Master Presenter', description: 'Deliver 50 demo sessions', earned: false, current: 33, target: 50 },
    { title: 'Perfect Score', description: 'Achieve 5.0 rating in a session', earned: false, current: 4.9, target: 5.0 },
  ];

  const upcomingGoals = [
    { title: 'Q1 Demo Target', description: 'Deliver 15 sessions this quarter', progress: 65, current: 10, target: 15 },
    { title: 'New Technology', description: 'Learn and present Vue.js', progress: 30, current: 3, target: 10 },
    { title: 'Engagement Score', description: 'Maintain 4.8+ rating', progress: 95, current: 4.85, target: 4.8 },
  ];

  const recentFeedback = [
    { session: 'React Hooks Workshop', rating: 4.9, comment: 'Excellent explanation of complex concepts!', date: '2024-12-15' },
    { session: 'JavaScript ES6+', rating: 4.8, comment: 'Great examples and hands-on practice.', date: '2024-12-10' },
    { session: 'TypeScript Basics', rating: 4.7, comment: 'Clear and well-structured presentation.', date: '2024-12-05' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">My Progress</h1>
            <p className="text-slate-600 mt-1">Track your demo sessions performance and growth</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Sessions</p>
                  <p className="text-3xl font-bold text-blue-900">33</p>
                  <p className="text-xs text-blue-600 mt-1">+8 this month</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Avg Rating</p>
                  <p className="text-3xl font-bold text-green-900">4.7</p>
                  <p className="text-xs text-green-600 mt-1">+0.2 improvement</p>
                </div>
                <Star className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Total Attendees</p>
                  <p className="text-3xl font-bold text-purple-900">287</p>
                  <p className="text-xs text-purple-600 mt-1">+56 this month</p>
                </div>
                <Users className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Teaching Hours</p>
                  <p className="text-3xl font-bold text-orange-900">78</p>
                  <p className="text-xs text-orange-600 mt-1">+18 this month</p>
                </div>
                <Clock className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Session Progress</span>
                  </CardTitle>
                  <CardDescription>Your demo session activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Rating Trend</span>
                  </CardTitle>
                  <CardDescription>Average session ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Bar dataKey="rating" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Technology Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technology Distribution</CardTitle>
                  <CardDescription>Sessions by technology</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={technologyData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="sessions"
                        label={({ name, sessions }) => `${name}: ${sessions}`}
                      >
                        {technologyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>Latest session feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentFeedback.map((feedback, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{feedback.session}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{feedback.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{feedback.comment}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(feedback.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Skill Development</span>
                </CardTitle>
                <CardDescription>Track your expertise across different technologies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillLevels.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{skill.skill}</h4>
                        <p className="text-sm text-slate-600">{skill.sessions} sessions • {skill.hours} hours</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{skill.level}%</p>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
                <CardDescription>Your milestones and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className={`${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-green-500' : 'bg-slate-400'}`}>
                            <Award className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{achievement.description}</p>
                            {achievement.earned ? (
                              <Badge className="mt-2 bg-green-100 text-green-800">
                                Earned {new Date(achievement.date!).toLocaleDateString()}
                              </Badge>
                            ) : (
                              <div className="mt-2">
                                <div className="flex justify-between text-sm">
                                  <span>{achievement.current}/{achievement.target}</span>
                                  <span>{Math.round((achievement.current! / achievement.target!) * 100)}%</span>
                                </div>
                                <Progress value={(achievement.current! / achievement.target!) * 100} className="mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Current Goals</span>
                </CardTitle>
                <CardDescription>Track your progress towards personal goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {upcomingGoals.map((goal, index) => (
                  <Card key={index} className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{goal.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{goal.current}/{goal.target}</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-3" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyProgress;
