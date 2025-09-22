import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';

const PressLog = ({ db, t }) => {
  const [pressLog, setPressLog] = useState([]);

  // Get and sync the last 20 presses
  useEffect(() => {
    const logRef = ref(db, 'logs');
    onValue(logRef, (snapshot) => {
      const logs = snapshot.val() || {};
      const logArray = Object.values(logs).sort((a, b) => b.timestamp - a.timestamp);
      setPressLog(logArray.slice(0, 20));
    });
  }, [db]);

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
    <div className="w-full max-w-md bg-white/15 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20">
      <h3 className="text-2xl font-semibold mb-4 text-center text-white drop-shadow-lg">{t.logTitle}</h3>
      <div className="max-h-48 overflow-y-auto space-y-3">
        {pressLog.map((log, index) => (
          <div key={index} className="flex justify-between items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
            <span className="text-white font-medium">{`${log.name} pressed`}</span>
            <span className="text-pink-200 text-sm font-light">{getTimeAgo(log.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PressLog;
