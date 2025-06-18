
import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '../services/sessionApi';
import { DemoSession } from '../types/api';
import { Layout } from '../components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, MapPin, Users, Plus } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/calendar-styles.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: DemoSession;
}

const Calendar: React.FC = () => {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => sessionApi.getAll(),
  });

  const sessionsList = Array.isArray(sessions) ? sessions : sessions.data || [];

  const events: CalendarEvent[] = useMemo(() => {
    return sessionsList.map(session => {
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
        fontSize: '13px',
        padding: '2px 6px'
      }
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log('Selected event:', event);
    // TODO: Open event details modal
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    console.log('Selected slot:', start, end);
    // TODO: Open create session modal
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
              <p className="text-sm text-slate-600">View and manage demo sessions</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('day')}
            >
              Day
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-slate-800">
              {moment(date).format('MMMM YYYY')}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDate(moment(date).subtract(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate())}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDate(moment(date).add(1, view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toDate())}
              >
                →
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 calendar-container" style={{ height: '600px' }}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            views={['month', 'week', 'day']}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            style={{ height: '100%' }}
            popup
            popupOffset={30}
            formats={{
              monthHeaderFormat: 'MMMM YYYY',
              dayHeaderFormat: 'dddd MMM DD',
              dayRangeHeaderFormat: ({ start, end }) => 
                `${moment(start).format('MMM DD')} - ${moment(end).format('MMM DD')}`,
              timeGutterFormat: 'HH:mm',
              eventTimeRangeFormat: ({ start, end }) => 
                `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            }}
            components={{
              toolbar: () => null, // Hide default toolbar since we have custom controls
              event: ({ event }) => (
                <div className="flex flex-col h-full">
                  <div className="font-medium text-xs truncate">{event.title}</div>
                  <div className="flex items-center space-x-1 text-xs opacity-90">
                    <Clock className="h-3 w-3" />
                    <span>{moment(event.start).format('HH:mm')}</span>
                  </div>
                </div>
              ),
            }}
          />
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{events.length}</div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {events.filter(e => e.resource.status === 'upcoming').length}
                </div>
                <div className="text-sm text-slate-600">Upcoming</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Badge className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {events.filter(e => e.resource.status === 'completed').length}
                </div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {events.filter(e => e.resource.status === 'cancelled').length}
                </div>
                <div className="text-sm text-slate-600">Cancelled</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
