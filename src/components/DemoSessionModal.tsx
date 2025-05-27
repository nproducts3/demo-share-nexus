
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DemoSession {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  createdBy: string;
  attendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface DemoSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: Omit<DemoSession, 'id' | 'createdBy' | 'attendees' | 'status'>) => void;
  editingSession?: DemoSession;
}

const technologies = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'TypeScript', 
  'JavaScript', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure'
];

export const DemoSessionModal: React.FC<DemoSessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingSession
}) => {
  const [formData, setFormData] = useState({
    title: '',
    technology: '',
    date: '',
    time: '',
    description: ''
  });

  useEffect(() => {
    if (editingSession) {
      setFormData({
        title: editingSession.title,
        technology: editingSession.technology,
        date: editingSession.date,
        time: editingSession.time,
        description: editingSession.description
      });
    } else {
      setFormData({
        title: '',
        technology: '',
        date: '',
        time: '',
        description: ''
      });
    }
  }, [editingSession, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      technology: '',
      date: '',
      time: '',
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingSession ? 'Edit Demo Session' : 'Create New Demo Session'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g., React Hooks Deep Dive"
            />
          </div>

          <div>
            <Label htmlFor="technology">Technology</Label>
            <select
              id="technology"
              value={formData.technology}
              onChange={(e) => setFormData(prev => ({ ...prev, technology: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Technology</option>
              {technologies.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              placeholder="Describe what will be covered in this session..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSession ? 'Update Session' : 'Create Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
