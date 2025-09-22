import React from 'react';

const VisualEffects = ({ floatingHearts }) => {
  return (
    <>
      {/* دوائر متحركة محسنة للجوال */}
      <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/15 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full animate-ping"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 sm:w-20 sm:h-20 bg-pink-400/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* نجوم متلألئة محسنة */}
      <div className="absolute top-20 left-1/4 w-1 h-1 sm:w-2 sm:h-2 bg-white/90 rounded-full animate-twinkle"></div>
      <div className="absolute top-32 right-1/3 w-1 h-1 bg-white/70 rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-40 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-white/80 rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-1/5 w-1 h-1 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-32 right-1/4 w-1 h-1 bg-white/90 rounded-full animate-twinkle" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute top-1/4 right-1/5 w-1 h-1 bg-pink-300/80 rounded-full animate-twinkle" style={{animationDelay: '2.5s'}}></div>
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-300/80 rounded-full animate-twinkle" style={{animationDelay: '3s'}}></div>
      
      {/* قلوب متطايرة محسنة */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-pink-400 text-xl sm:text-2xl pointer-events-none animate-float drop-shadow-lg"
          style={{
            left: heart.x,
            top: heart.y,
            transform: `rotate(${heart.rotation}deg) scale(${heart.scale})`,
            animation: 'floatHeart 3s ease-out forwards'
          }}
        >
          💖
        </div>
      ))}
      
      {/* تأثيرات إضافية للجوال */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-32 h-32 sm:w-40 sm:h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 sm:w-24 sm:h-24 bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </>
  );
};

export default VisualEffects;
