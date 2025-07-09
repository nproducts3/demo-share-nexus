import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { Calendar as BigCalendar, momentLocalizer, View, Event } from 'react-big-calendar';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '../services/sessionApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Users, Clock, MapPin } from 'lucide-react';
import { CreateSessionModal } from '../components/CreateSessionModal';
import { useToast } from '@/hooks/use-toast';
import { DemoSession } from '../types/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  resource: DemoSession;
}

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onView: (view: string) => void;
}

interface CustomEventProps {
  event: CalendarEvent;
}

const Calendar: React.FC = () => {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();

  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => sessionApi.getAll(),
  });

  const sessionsList = useMemo(() => {
    return Array.isArray(sessions) ? sessions : sessions.data || [];
  }, [sessions]);

  const events = useMemo(() => {
    return sessionsList.map((session) => {
      const sessionDate = new Date(session.date);
      const [hours, minutes] = session.time.split(':').map(Number);
      sessionDate.setHours(hours, minutes);
      
      const endDate = new Date(sessionDate);
      endDate.setHours(hours + (session.duration || 1), minutes);

      return {
        id: session.id,
        title: session.title,
        start: sessionDate,
        end: endDate,
        resource: session,
      };
    });
  }, [sessionsList]);

  const handleCreateSession = async (sessionData: Partial<DemoSession>) => {
    try {
      await sessionApi.create(sessionData);
      toast({
        title: "Success",
        description: "Demo session created successfully!",
      });
      setShowCreateModal(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const session = event.resource;
    let backgroundColor = '#3174ad';
    
    switch (session.status) {
      case 'completed':
        backgroundColor = '#10b981';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
      case 'upcoming':
        backgroundColor = '#3b82f6';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 6px',
      },
    };
  };

  const CustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, onView }) => (
    <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{label}</h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex bg-slate-100 rounded-lg p-1">
          {['month', 'week', 'day'].map((viewName) => (
            <Button
              key={viewName}
              variant={view === viewName ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onView(viewName)}
              className={`h-8 px-3 text-sm capitalize ${
                view === viewName 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {viewName}
            </Button>
          ))}
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>
    </div>
  );

  const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
    const session = event.resource;
    return (
      <div className="p-1">
        <div className="font-medium text-xs truncate">{event.title}</div>
        <div className="text-xs opacity-90 flex items-center mt-1">
          <Clock className="h-3 w-3 mr-1" />
          {moment(event.start).format('HH:mm')}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-slate-200 rounded-lg"></div>
            <div className="h-96 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
            <p className="text-slate-600 mt-1">Manage your demo sessions and events</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-slate-900">{sessionsList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">This Month</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {sessionsList.filter(s => moment(s.date).isSame(moment(), 'month')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Upcoming</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {sessionsList.filter(s => moment(s.date).isAfter(moment())).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Today</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {sessionsList.filter(s => moment(s.date).isSame(moment(), 'day')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
            onSelectEvent={(event) => setSelectedEvent(event)}
            formats={{
              timeGutterFormat: 'HH:mm',
              eventTimeRangeFormat: ({ start, end }) => 
                `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
              dayHeaderFormat: 'ddd M/D',
              monthHeaderFormat: 'MMMM YYYY',
            }}
          />
        </div>

        {/* Create Session Modal */}
        <CreateSessionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSession}
        />
      </div>
    </Layout>
  );
};

export default Calendar;
