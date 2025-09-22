import React, { useRef } from 'react';

const PressButton = ({ onClick, t }) => {
  const pulseRef = useRef(null);

  return (
    <div className="relative">
      {/* شموع مشتعلة حول الزر - محسنة للجوال */}
      <div className="absolute -top-6 -left-6 w-3 h-5 sm:w-4 sm:h-6 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-t-full animate-flicker"></div>
      <div className="absolute -top-4 -right-4 w-2 h-4 sm:w-3 sm:h-5 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-t-full animate-flicker" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute -bottom-4 -left-4 w-3 h-5 sm:w-4 sm:h-6 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-t-full animate-flicker" style={{animationDelay: '1s'}}></div>
      <div className="absolute -bottom-6 -right-6 w-2 h-4 sm:w-3 sm:h-5 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-t-full animate-flicker" style={{animationDelay: '1.5s'}}></div>
      
      <button
        onClick={onClick}
        className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-white/50 to-pink-300/50 backdrop-blur-lg text-white text-lg sm:text-2xl font-bold flex flex-col items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-3xl active:scale-95 border-2 border-white/40 group z-10 touch-manipulation"
      >
        <span className="mb-1 sm:mb-2 relative z-20 text-center px-2">{t.pressButton}</span>
        <span className="text-3xl sm:text-4xl relative z-20">💖</span>
        
        {/* تأثير القلب النابض - خلف الزر */}
        <div ref={pulseRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-full h-full rounded-full bg-white/20 animate-ping"></div>
        </div>
        
        {/* تأثيرات إضافية - خلف الزر */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
      </button>
      
      {/* حلقة خارجية متحركة */}
      <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-spin" style={{animationDuration: '10s'}}></div>
    </div>
  );
};

export default PressButton;
