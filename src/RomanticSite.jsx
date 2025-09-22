import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, onDisconnect, serverTimestamp, push, child } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import './index.css';

// Components
import LoveMessages from './components/LoveMessages';
import MusicPlaylist from './components/MusicPlaylist';
import PressButton from './components/PressButton';
import PressLog from './components/PressLog';
import VisualEffects from './components/VisualEffects';
import Counters from './components/Counters';
import UserInfo from './components/UserInfo';
import PhotoSharing from './components/PhotoSharing';
import EventCalendar from './components/EventCalendar';
import MiniGames from './components/MiniGames';
import Notifications from './components/Notifications';

// Firebase configuration with fallback values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com/",
};

// Initialize Firebase with error handling
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Create a mock database for development
  db = null;
}

// Language settings
const language = 'es'; // 'en' or 'es'
const translations = {
  en: {
    welcome: "Welcome, my love!",
    names: "Ahmed & Sarah",
    yourName: "Your Name",
    pressButton: "Longing Press",
    yourCount: "Your Presses:",
    partnerCount: "Partner's Presses:",
    totalCount: "Total Presses:",
    online: "Online",
    offline: "Offline",
    logTitle: "Press History",
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    loveMessages: "Love Messages",
    sendMessage: "Send Love Message",
    writeMessage: "Write your message...",
    send: "Send 💖",
    messages: "Messages",
    noMessages: "No messages yet...",
    musicPlaylist: "Love Songs",
    addSong: "Add Song",
    songTitle: "Song Title",
    songArtist: "Artist",
    songLink: "YouTube Link (optional)",
    add: "Add 🎵",
    noSongs: "No songs yet...",
    play: "Play",
  },
  es: {
    welcome: "¡Bienvenido, mi amor!",
    names: "AYHAN & BARBARA",
    yourName: "Tu Nombre",
    pressButton: "Botón de Anhelo",
    yourCount: "Tus Pulsaciones:",
    partnerCount: "Pulsaciones de tu pareja:",
    totalCount: "Pulsaciones Totales:",
    online: "Conectado",
    offline: "Desconectado",
    logTitle: "Historial de Pulsaciones",
    justNow: "Ahora mismo",
    minutesAgo: "m hace",
    hoursAgo: "h hace",
    loveMessages: "Mensajes de Amor",
    sendMessage: "Enviar Mensaje de Amor",
    writeMessage: "Escribe tu mensaje...",
    send: "Enviar 💖",
    messages: "Mensajes",
    noMessages: "Aún no hay mensajes...",
    musicPlaylist: "Canciones de Amor",
    addSong: "Agregar Canción",
    songTitle: "Título de la Canción",
    songArtist: "Artista",
    songLink: "Enlace de YouTube (opcional)",
    add: "Agregar 🎵",
    noSongs: "Aún no hay canciones...",
    play: "Reproducir",
    sharedPhotos: "Fotos Compartidas",
    addPhoto: "Agregar Foto 📸",
    imageUrlPlaceholder: "URL de Imagen (Instagram, Google Photos, etc.)",
    photoCaption: "Agregar una descripción...",
    share: "Compartir 📸",
    noPhotos: "Aún no hay fotos compartidas...",
    eventCalendar: "Calendario de Eventos",
    addEvent: "Agregar Evento 📅",
    eventTitle: "Título del Evento (ej: Cumpleaños de Barbara)",
    noUpcomingEvents: "No hay eventos próximos...",
    miniGames: "Mini Juegos",
    notifications: "Notificaciones",
    noNotifications: "Aún no hay notificaciones...",
  }
};

const t = translations[language];

const RomanticSite = () => {
  // Add error state
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add debugging
  console.log('RomanticSite component loaded');
  console.log('Current error state:', error);
  console.log('Current loading state:', isLoading);
  
  // Sistema de inicio de sesión oculto
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(() => {
    try {
      // Si el usuario es AYHAN (inicio de sesión oculto)
      const urlParams = new URLSearchParams(window.location.search);
      const secretKey = urlParams.get('key');
      
      if (secretKey === 'ayhan2024') {
        localStorage.setItem('isAyhan', 'true');
        return 'ayhan';
      }
      
      // Si no es AYHAN, es BARBARA automáticamente
      return 'barbara';
    } catch (err) {
      console.error('Error setting userId:', err);
      return 'barbara';
    }
  });
  
  const [userName, setUserName] = useState(() => {
    if (userId === 'ayhan') {
      return 'AYHAN';
    } else {
      return 'BARBARA';
    }
  });
  
  const [myCount, setMyCount] = useState(0);
  const [partnerCount, setPartnerCount] = useState(0);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const pulseRef = useRef(null);

  // Set up real-time listeners and initial data
  useEffect(() => {
    try {
      console.log('Initializing app...', { userId, userName });
      localStorage.setItem('userId', userId);

      // Register Service Worker for PWA
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      }
    } catch (err) {
      console.error('Error in initialization:', err);
      setError(err.message);
    }

    // Check if Firebase is available
    if (!db) {
      console.warn('Firebase not available, using demo mode');
      console.log('Setting error state for Firebase not available');
      setError('Firebase not configured. Please check your environment variables.');
      setIsLoading(false);
      return;
    }

    const userRef = ref(db, `presses/${userId}`);
    const partnerRef = ref(db, 'presses');

    try {
      // Handle user online/offline status
      onDisconnect(child(userRef, 'online')).set(false);
      onDisconnect(child(userRef, 'last_seen')).set(serverTimestamp());

      // Get and sync all user data
      onValue(partnerRef, (snapshot) => {
        try {
          const usersData = snapshot.val() || {};
          const partnerId = Object.keys(usersData).find(key => key !== userId);

          if (usersData[userId]) {
            setMyCount(usersData[userId].count || 0);
            setUserName(usersData[userId].name || 'Guest');
          }

          if (partnerId && usersData[partnerId]) {
            setPartnerCount(usersData[partnerId].count || 0);
            setIsPartnerOnline(usersData[partnerId].online || false);
          } else {
            setPartnerCount(0);
            setIsPartnerOnline(false);
          }
        } catch (err) {
          console.error('Error processing Firebase data:', err);
        }
      });

      // Update user's online status
      set(child(userRef, 'online'), true);
      set(child(userRef, 'name'), userName || 'Guest');
      
      setIsLoading(false);
    } catch (err) {
      console.error('Firebase operation failed:', err);
      setError('Failed to connect to database');
      setIsLoading(false);
    }

  }, [userId, userName]);

  // Update name in DB whenever it changes
  useEffect(() => {
    if (userName) {
      set(ref(db, `presses/${userId}/name`), userName);
    }
  }, [userName, userId]);

  // Create floating hearts animation
  const createFloatingHeart = (x, y) => {
    const heartId = Date.now() + Math.random();
    const heart = {
      id: heartId,
      x: x,
      y: y,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    };
    
    setFloatingHearts(prev => [...prev, heart]);
    
    // Remove heart after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
    }, 3000);
  };

  // Play heart beat sound
  const playHeartBeatSound = () => {
    // Create audio context for heart beat sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator for heart beat
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Heart beat pattern
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Function to handle the "Longing Press"
  const handlePress = async (event) => {
    try {
      console.log('🔥 ¡Botón de anhelo presionado!', { userId, userName, event });
      
      // Get button position for heart animation
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Create floating hearts
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createFloatingHeart(
            x + (Math.random() - 0.5) * 100,
            y + (Math.random() - 0.5) * 100
          );
        }, i * 100);
      }
      
      // Play heart beat sound
      playHeartBeatSound();
      
      // Animate the heart pulse
      const buttonElement = event.currentTarget;
      buttonElement.classList.add('animate-pulse');
      setTimeout(() => buttonElement.classList.remove('animate-pulse'), 500);

      // Only update Firebase if available
      if (db) {
        const userRef = ref(db, `presses/${userId}`);
        const logsRef = ref(db, 'logs');
        
        // Get current count and update it
        let currentCount = 0;
        onValue(child(userRef, 'count'), (snapshot) => {
          currentCount = snapshot.val() || 0;
        }, { onlyOnce: true });

        const newCount = currentCount + 1;
        set(child(userRef, 'count'), newCount);

        // Add a new log entry
        push(logsRef, {
          name: userName || 'Guest',
          timestamp: serverTimestamp(),
          press_count: newCount,
        });
      } else {
        // Demo mode - just update local state
        setMyCount(prev => prev + 1);
        console.log('Demo mode: Press count updated locally');
      }
    } catch (err) {
      console.error('Error in handlePress:', err);
      setError('Error processing press. Please try again.');
    }
  };

  // Show error screen if there's an error
  if (error) {
    console.log('Showing error screen:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-600 to-red-500">
        <div className="text-center text-white p-8">
          <h1 className="text-2xl font-bold mb-4">⚠️ خطأ في التحميل</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-purple-900 px-6 py-2 rounded-lg font-semibold"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen
  if (isLoading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-600 to-red-500">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">جاري التحميل... 💕</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main app content');
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Debug button for mobile */}
      <button
        onClick={() => {
          console.log('Debug button clicked');
          alert('Check console for debugging info!');
        }}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          background: 'red',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        🔧 DEBUG
      </button>
      {/* Fondo degradado profesional محسن */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-600 to-red-500"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/30 via-transparent to-purple-900/30"></div>
      
      {/* Efectos visuales محسنة */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* نجوم متلألئة في الخلفية */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Los efectos visuales */}
      <VisualEffects floatingHearts={floatingHearts} />
      
      {/* Contenido principal محسن للجوال */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start text-white font-sans px-4 py-6 sm:py-8">
        
        {/* Sección de bienvenida محسنة للجوال */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative">
            {/* تأثير الهالة حول العنوان */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl scale-110"></div>
            <h1 className="relative text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent animate-fade-in">
              {userId === 'barbara' ? '¡Hola Barbara! 💕' : t.welcome}
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-light text-pink-100 drop-shadow-lg mb-2">
            {userId === 'barbara' ? 'AYHAN & BARBARA 💖' : t.names}
          </p>
          {userId === 'barbara' && (
            <div className="flex items-center justify-center gap-2 text-lg text-pink-200 mt-2 animate-pulse">
              <span>🌹</span>
              <span>¡Bienvenida a nuestro mundo romántico!</span>
              <span>🌹</span>
            </div>
          )}
        </div>

        {/* Información del usuario */}
        <UserInfo 
          userName={userName} 
          setUserName={setUserName} 
          isPartnerOnline={isPartnerOnline} 
          t={t}
          userId={userId}
        />

        {/* Contadores y botón principal محسن للجوال */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mb-8 sm:mb-12 w-full max-w-sm sm:max-w-md">
          {/* Contadores محسنة */}
          <div className="w-full">
            <Counters myCount={myCount} partnerCount={partnerCount} t={t} userId={userId} />
          </div>
          
          {/* Botón de anhelo principal مع تأثيرات محسنة */}
          <div className="relative">
            {/* تأثير الهالة حول الزر */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-2xl scale-125 animate-pulse"></div>
            <PressButton onClick={(e) => {
              console.log('PressButton onClick called!', e);
              handlePress(e);
            }} t={t} />
          </div>
        </div>

        {/* Notificaciones */}
        <Notifications 
          isPartnerOnline={isPartnerOnline} 
          userName={userName} 
          t={t} 
        />

        {/* Grid محسن للجوال - ترتيب الأقسام */}
        <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
          {/* الصف الأول - الرسائل والصور */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="order-1">
              <LoveMessages 
                db={db} 
                userId={userId} 
                userName={userName} 
                t={t} 
                playHeartBeatSound={playHeartBeatSound} 
                createFloatingHeart={createFloatingHeart} 
              />
            </div>
            <div className="order-2">
              <PhotoSharing 
                db={db} 
                userId={userId} 
                userName={userName} 
                t={t} 
                playHeartBeatSound={playHeartBeatSound} 
              />
            </div>
          </div>

          {/* الصف الثاني - الموسيقى والأحداث */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="order-1">
              <MusicPlaylist 
                db={db} 
                userId={userId} 
                userName={userName} 
                t={t} 
                playHeartBeatSound={playHeartBeatSound} 
              />
            </div>
            <div className="order-2">
              <EventCalendar 
                db={db} 
                userId={userId} 
                userName={userName} 
                t={t} 
                playHeartBeatSound={playHeartBeatSound} 
              />
            </div>
          </div>

          {/* الصف الثالث - الألعاب والسجل */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="order-1">
              <MiniGames 
                db={db} 
                userId={userId} 
                userName={userName} 
                t={t} 
                playHeartBeatSound={playHeartBeatSound} 
              />
            </div>
            <div className="order-2">
              <PressLog db={db} t={t} />
            </div>
          </div>
        </div>
        
        {/* Mensaje secreto para AYHAN */}
        {userId === 'ayhan' && (
          <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg text-sm border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-green-400">🔒</span>
              <span>Inicio de sesión oculto - AYHAN</span>
            </div>
          </div>
        )}
      </div>

      {/* تأثيرات حركية احترافية */}
      <style>{`
        .animate-fade-in { 
          animation: fadeIn 1.5s ease-in-out; 
        }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
        
        /* Estrellas brillantes محسنة */
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.5) rotate(180deg); 
          }
        }
        
        /* تأثيرات إضافية للجوال */
        @media (max-width: 640px) {
          .animate-twinkle {
            animation-duration: 1.5s;
          }
        }
        
        /* Corazones voladores */
        .animate-float {
          animation: floatHeart 3s ease-out forwards;
        }
        @keyframes floatHeart {
          0% { 
            opacity: 1; 
            transform: translateY(0) rotate(0deg) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-200px) rotate(360deg) scale(0.5); 
          }
        }
        
        /* Velas encendidas */
        .animate-flicker {
          animation: flicker 1.5s ease-in-out infinite alternate;
        }
        @keyframes flicker {
          0% { 
            opacity: 0.8; 
            transform: scaleY(1) scaleX(0.9);
          }
          100% { 
            opacity: 1; 
            transform: scaleY(1.1) scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default RomanticSite;