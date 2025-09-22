import React from 'react';

const Counters = ({ myCount, partnerCount, t, userId }) => {
  // Determinar nombres según el usuario
  const getNames = () => {
    if (userId === 'ayhan') {
      return {
        myName: 'AYHAN',
        partnerName: 'BARBARA'
      };
    } else {
      return {
        myName: 'BARBARA',
        partnerName: 'AYHAN'
      };
    }
  };

  const { myName, partnerName } = getNames();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
      <div className="relative group">
        {/* تأثير الهالة */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
        <div className="relative bg-white/25 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/40 shadow-2xl text-center hover:bg-white/30 transition-all duration-300">
          <p className="text-pink-100 text-xs sm:text-sm mb-1 font-medium">{myName}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{myCount}</p>
        </div>
      </div>
      <div className="relative group">
        {/* تأثير الهالة */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
        <div className="relative bg-white/25 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/40 shadow-2xl text-center hover:bg-white/30 transition-all duration-300">
          <p className="text-pink-100 text-xs sm:text-sm mb-1 font-medium">{partnerName}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{partnerCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Counters;
