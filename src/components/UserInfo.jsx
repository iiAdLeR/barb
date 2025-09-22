import React from 'react';

const UserInfo = ({ userName, setUserName, isPartnerOnline, t, userId }) => {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-12 w-full max-w-sm">
      <div className="relative w-full">
        {userId === 'barbara' ? (
          // Para BARBARA: mostrar solo el nombre sin posibilidad de edición
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-white/30 backdrop-blur-lg text-white p-4 rounded-2xl text-center text-lg sm:text-xl font-medium shadow-2xl border border-white/40">
              {userName}
            </div>
          </div>
        ) : (
          // Para AYHAN: posibilidad de cambiar el nombre
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t.yourName}
              className="relative w-full bg-white/30 backdrop-blur-lg placeholder-white/70 text-white p-4 rounded-2xl text-center outline-none focus:ring-4 focus:ring-white/50 transition-all duration-500 border border-white/40 text-lg sm:text-xl font-medium shadow-2xl"
            />
          </div>
        )}
      </div>
      
      <div className={`flex items-center gap-3 font-semibold text-sm sm:text-lg px-4 py-2 rounded-full ${isPartnerOnline ? 'bg-green-500/40 text-green-200' : 'bg-gray-500/40 text-gray-300'} backdrop-blur-lg border border-white/30 shadow-lg`}>
        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${isPartnerOnline ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-400'}`}></div>
        {isPartnerOnline ? t.online : t.offline}
      </div>
    </div>
  );
};

export default UserInfo;
