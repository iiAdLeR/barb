import React, { useState, useEffect } from 'react';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

const LoveMessages = ({ db, userId, userName, t, playHeartBeatSound, createFloatingHeart }) => {
  const [loveMessages, setLoveMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);

  // Obtener y sincronizar mensajes de amor
  useEffect(() => {
    const messagesRef = ref(db, 'loveMessages');
    onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val() || {};
      const messageArray = Object.values(messages).sort((a, b) => b.timestamp - a.timestamp);
      setLoveMessages(messageArray.slice(0, 10)); // Keep only the latest 10
    });
  }, [db]);

  // Enviar mensaje de amor
  const sendLoveMessage = async () => {
    if (!newMessage.trim()) return;
    
    const messagesRef = ref(db, 'loveMessages');
    push(messagesRef, {
      from: userName || 'Guest',
      message: newMessage.trim(),
      timestamp: serverTimestamp(),
      userId: userId
    });
    
    setNewMessage('');
    setShowMessageBox(false);
    
    // Reproducir sonido de amor
    playHeartBeatSound();
    
    // Crear corazones flotantes para el mensaje
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createFloatingHeart(
          window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          window.innerHeight / 2 + (Math.random() - 0.5) * 200
        );
      }, i * 200);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return t.justNow;
    const seconds = (Date.now() - timestamp) / 1000;
    if (seconds < 60) return t.justNow;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}${t.minutesAgo}`;
    const hours = Math.floor(minutes / 60);
    return `${hours}${t.hoursAgo}`;
  };

  return (
    <div className="w-full max-w-md bg-white/15 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-white drop-shadow-lg">{t.loveMessages}</h3>
        <button
          onClick={() => setShowMessageBox(!showMessageBox)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          {t.sendMessage}
        </button>
      </div>
      
      {/* صندوق إرسال الرسالة */}
      {showMessageBox && (
        <div className="mb-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t.writeMessage}
            className="w-full bg-white/20 backdrop-blur-sm placeholder-white/70 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 resize-none"
            rows="3"
            maxLength="1000"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-pink-200 text-sm">{newMessage.length}/1000</span>
            <button
              onClick={sendLoveMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.send}
            </button>
          </div>
        </div>
      )}
      
      {/* قائمة الرسائل */}
      <div className="max-h-48 overflow-y-auto space-y-3">
        {loveMessages.length === 0 ? (
          <div className="text-center text-pink-200 py-4">
            {t.noMessages}
          </div>
        ) : (
          loveMessages.map((msg, index) => (
            <div key={index} className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex justify-between items-start mb-2">
                <span className="text-pink-300 font-medium text-sm">{msg.from}</span>
                <span className="text-pink-200 text-xs">{getTimeAgo(msg.timestamp)}</span>
              </div>
              <p className="text-white text-sm leading-relaxed">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoveMessages;
