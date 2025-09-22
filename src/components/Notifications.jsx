import React, { useState, useEffect } from 'react';

const Notifications = ({ isPartnerOnline, userName, t }) => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  useEffect(() => {
    // Request notification permission only once on first visit
    if (Notification.permission === 'default' && !hasRequestedPermission) {
      // Check if this is the first visit
      const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
      
      if (isFirstVisit) {
        // Mark as visited
        localStorage.setItem('hasVisitedBefore', 'true');
        
        // Request permission after a short delay
        setTimeout(() => {
          Notification.requestPermission().then(permission => {
            setPermission(permission);
            setHasRequestedPermission(true);
          });
        }, 2000); // 2 seconds delay
      } else {
        setHasRequestedPermission(true);
      }
    }
  }, [hasRequestedPermission]);

  useEffect(() => {
    if (isPartnerOnline && permission === 'granted') {
      // Partner came online
      showNotification(`${userName || 'Your partner'} is now online! 💕`, {
        body: 'Your beloved is connected and ready to share love!',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRjY5QkQiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDIxLjM1TDEwLjU1IDE5LjkwQzUuNCAxNS4zNSAyIDEyLjI3IDIgOC41QzIgNS40MSA0LjQyIDMgNy41IDNDOS4yNCAzIDEwLjkxIDMuODEgMTIgNS4wOEMxMy4wOSAzLjgxIDE0Ljc2IDMgMTYuNSAzQzE5LjU4IDMgMjIgNS40MSAyMiA4LjVDMjIgMTIuMjcgMTguNiAxNS4zNSAxMy40NSAxOS45MEwxMiAyMS4zNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRjY5QkQiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDIxLjM1TDEwLjU1IDE5LjkwQzUuNCAxNS4zNSAyIDEyLjI3IDIgOC41QzIgNS40MSA0LjQyIDMgNy41IDNDOS4yNCAzIDEwLjkxIDMuODEgMTIgNS4wOEMxMy4wOSAzLjgxIDE0Ljc2IDMgMTYuNSAzQzE5LjU4IDMgMjIgNS40MSAyMiA4LjVDMjIgMTIuMjcgMTguNiAxNS4zNSAxMy40NSAxOS45MEwxMiAyMS4zNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
        tag: 'partner-online',
        requireInteraction: true
      });
    }
  }, [isPartnerOnline, userName, permission]);

  const showNotification = (title, options = {}) => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        ...options,
        vibrate: [200, 100, 200],
        timestamp: Date.now()
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Add to notifications list
      setNotifications(prev => [{
        id: Date.now(),
        title,
        body: options.body || '',
        timestamp: Date.now()
      }, ...prev.slice(0, 9)]); // Keep only last 10
    }
  };

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setPermission(permission);
    
    if (permission === 'granted') {
      showNotification('Notifications enabled! 🔔', {
        body: 'You\'ll now receive notifications when your partner comes online!',
        tag: 'permission-granted'
      });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Hidden component - only handles notification logic
  return null;
};

export default Notifications;
