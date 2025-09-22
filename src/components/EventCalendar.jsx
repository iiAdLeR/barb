import React, { useState, useEffect } from 'react';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

const EventCalendar = ({ db, userId, userName, t, playHeartBeatSound }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'birthday' });
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Obtener y sincronizar eventos
  useEffect(() => {
    const eventsRef = ref(db, 'events');
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val() || {};
      const eventArray = Object.values(eventsData).sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventArray);
    });
  }, [db]);

  // Agregar nuevo evento
  const addEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date.trim()) return;
    
    const eventsRef = ref(db, 'events');
    push(eventsRef, {
      title: newEvent.title.trim(),
      date: newEvent.date,
      type: newEvent.type,
      addedBy: userName || 'Guest',
      timestamp: serverTimestamp(),
      userId: userId
    });
    
    setNewEvent({ title: '', date: '', type: 'birthday' });
    setShowAddEvent(false);
    
    // Play success sound
    playHeartBeatSound();
  };

  // Get upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const next30Days = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= next30Days;
    }).slice(0, 5); // Show only next 5 events
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get event icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'holiday': return '🎉';
      case 'date': return '💕';
      default: return '📅';
    }
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="w-full max-w-md bg-white/15 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-white drop-shadow-lg">{t.eventCalendar || 'Event Calendar'}</h3>
        <button
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          {t.addEvent || 'Add Event 📅'}
        </button>
      </div>
      
      {/* Caja de agregar evento mejorada */}
      {showAddEvent && (
        <div className="mb-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              📅 Agregar Evento Nuevo
            </label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              placeholder="Título del evento (ej: Cumpleaños de Barbara)"
              className="w-full bg-white/20 backdrop-blur-sm placeholder-white/70 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 mb-3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-white text-xs font-medium mb-1">Fecha</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="w-full bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-white text-xs font-medium mb-1">Tipo</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                className="w-full bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="birthday" style={{color: 'black'}}>🎂 Cumpleaños</option>
                <option value="holiday" style={{color: 'black'}}>🎉 Vacaciones</option>
                <option value="date" style={{color: 'black'}}>💕 Cita especial</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={addEvent}
            disabled={!newEvent.title.trim() || !newEvent.date.trim()}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
          >
            <span className="text-lg">📅</span>
            {t.add || 'Agregar Evento'}
          </button>
        </div>
      )}
      
      {/* Lista de eventos próximos mejorada */}
      <div className="max-h-64 overflow-y-auto space-y-3">
        {upcomingEvents.length === 0 ? (
          <div className="text-center text-green-200 py-8">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-lg">{t.noUpcomingEvents || 'No hay eventos próximos...'}</div>
            <div className="text-sm text-green-300 mt-1">¡Agrega el primer evento importante! 💕</div>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-300 bg-green-500/20 px-2 py-1 rounded-full">
                        {formatDate(event.date)}
                      </span>
                      <span className="text-green-200">por {event.addedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
