import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '../services/sessionApi';
import { DemoSession } from '../types/api';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-styles.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: DemoSession;
}

interface SidebarCalendarProps {
  onDateSelect?: (date: Date, sessions: DemoSession[]) => void;
}

export const SidebarCalendar: React.FC<SidebarCalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    const dayEvents = events.filter(event => 
      moment(event.start).isSame(moment(start), 'day')
    );
    onDateSelect?.(start, dayEvents.map(e => e.resource));
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedDate(event.start);
    const dayEvents = events.filter(e => 
      moment(e.start).isSame(moment(event.start), 'day')
    );
    onDateSelect?.(event.start, dayEvents.map(e => e.resource));
  };

  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      moment(event.start).isSame(moment(date), 'day')
    );
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
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="text-sm font-semibold text-slate-700 mb-3">Calendar</div>
      
      {/* Mini Calendar */}
      <div className="bg-white rounded-lg border border-slate-200 p-2" style={{ height: '280px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          views={['month']}
          defaultView="month"
          eventPropGetter={eventStyleGetter}
          style={{ height: '100%', fontSize: '11px' }}
          formats={{
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'ddd',
            dayRangeHeaderFormat: ({ start, end }) => 
              `${moment(start).format('MMM DD')} - ${moment(end).format('MMM DD')}`,
          }}
          components={{
            toolbar: ({ label, onNavigate }) => (
              <div className="flex items-center justify-between mb-2 px-1">
                <button 
                  onClick={() => onNavigate('PREV')}
                  className="text-xs p-1 hover:bg-slate-100 rounded"
                >
                  ←
                </button>
                <span className="text-xs font-medium text-slate-700">{label}</span>
                <button 
                  onClick={() => onNavigate('NEXT')}
                  className="text-xs p-1 hover:bg-slate-100 rounded"
                >
                  →
                </button>
              </div>
            ),
          }}
        />
      </div>

      {/* Selected Date Sessions */}
      {selectedDate && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-600">
            {moment(selectedDate).format('MMMM D, YYYY')}
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {getDayEvents(selectedDate).map(event => (
              <div 
                key={event.id}
                className="bg-slate-50 rounded-lg p-2 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-slate-800 truncate">
                  {event.title}
                </div>
                <div className="flex items-center space-x-2 mt-1 text-xs text-slate-600">
                  <Clock className="h-3 w-3" />
                  <span>{moment(event.start).format('HH:mm')}</span>
                  <Users className="h-3 w-3 ml-1" />
                  <span>{event.resource.attendees}</span>
                </div>
                {event.resource.location && (
                  <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{event.resource.location}</span>
                  </div>
                )}
                <Badge 
                  variant={event.resource.status === 'completed' ? 'default' : 'secondary'}
                  className="mt-1 text-xs"
                >
                  {event.resource.status}
                </Badge>
              </div>
            ))}
            {getDayEvents(selectedDate).length === 0 && (
              <div className="text-xs text-slate-500 text-center py-2">
                No sessions scheduled
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
