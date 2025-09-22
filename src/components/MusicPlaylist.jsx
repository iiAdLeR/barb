import React, { useState, useEffect } from 'react';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

const MusicPlaylist = ({ db, userId, userName, t, playHeartBeatSound }) => {
  const [musicPlaylist, setMusicPlaylist] = useState([]);
  const [newSong, setNewSong] = useState({ title: '', artist: '', link: '', platform: 'youtube' });
  const [showAddSong, setShowAddSong] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);

  // Obtener y sincronizar lista de música
  useEffect(() => {
    const playlistRef = ref(db, 'musicPlaylist');
    onValue(playlistRef, (snapshot) => {
      const songs = snapshot.val() || {};
      const songArray = Object.values(songs).sort((a, b) => b.timestamp - a.timestamp);
      setMusicPlaylist(songArray);
    });
  }, [db]);

  // Validar y detectar plataforma
  const validateAndDetectPlatform = (link) => {
    if (!link.trim()) {
      setIsValidLink(false);
      return 'youtube';
    }

    const spotifyRegex = /(?:https?:\/\/)?(?:open\.|play\.)?spotify\.com\/(?:track|album|playlist)\/[a-zA-Z0-9]+/;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/;
    
    if (spotifyRegex.test(link)) {
      setIsValidLink(true);
      return 'spotify';
    } else if (youtubeRegex.test(link)) {
      setIsValidLink(true);
      return 'youtube';
    } else {
      setIsValidLink(false);
      return 'youtube';
    }
  };

  // Handle link change
  const handleLinkChange = (link) => {
    const platform = validateAndDetectPlatform(link);
    setNewSong(prev => ({ ...prev, link, platform }));
  };

  // Add song to playlist
  const addSongToPlaylist = async () => {
    if (!newSong.link.trim() || !isValidLink) return;
    
    // Extraer título y artista del enlace
    const getSongInfo = (link, platform) => {
      if (platform === 'spotify') {
        return {
          title: 'Canción de Spotify',
          artist: 'Spotify'
        };
      } else if (platform === 'youtube') {
        return {
          title: 'Canción de YouTube',
          artist: 'YouTube'
        };
      }
      return {
        title: 'Canción',
        artist: 'No especificado'
      };
    };

    const songInfo = getSongInfo(newSong.link, newSong.platform);
    
    const playlistRef = ref(db, 'musicPlaylist');
    push(playlistRef, {
      title: songInfo.title,
      artist: songInfo.artist,
      link: newSong.link.trim(),
      platform: newSong.platform,
      addedBy: userName || 'Guest',
      timestamp: serverTimestamp(),
      userId: userId
    });
    
    setNewSong({ title: '', artist: '', link: '', platform: 'youtube' });
    setShowAddSong(false);
    setIsValidLink(false);
    
    // Play success sound
    playHeartBeatSound();
  };

  // Play song (open link)
  const playSong = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'spotify': return '🎵';
      case 'youtube': return '📺';
      default: return '🎵';
    }
  };

  // Get platform color
  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'spotify': return 'from-green-500 to-green-600';
      case 'youtube': return 'from-red-500 to-red-600';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  // Convert Spotify link to embed format
  const getSpotifyEmbedUrl = (link) => {
    if (!link) return '';
    
    // Extract track/album/playlist ID from Spotify URL
    const match = link.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
    if (match) {
      const [, type, id] = match;
      return `https://open.spotify.com/embed/${type}/${id}`;
    }
    return link;
  };

  return (
    <div className="w-full max-w-md bg-white/15 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-white drop-shadow-lg">{t.musicPlaylist}</h3>
        <button
          onClick={() => setShowAddSong(!showAddSong)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          {t.addSong}
        </button>
      </div>
      
      {/* Caja de agregar canción simplificada */}
      {showAddSong && (
        <div className="mb-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              🔗 Enlace de la canción (Spotify o YouTube)
            </label>
            <div className="relative">
              <input
                type="url"
                value={newSong.link}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://open.spotify.com/track/... o https://youtube.com/watch?v=..."
                className={`w-full bg-white/20 backdrop-blur-sm placeholder-white/70 text-white p-3 rounded-xl outline-none focus:ring-2 transition-all duration-300 pr-10 ${
                  newSong.link ? (isValidLink ? 'focus:ring-green-400' : 'focus:ring-red-400') : 'focus:ring-purple-400'
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {newSong.link && (
                  <span className="text-lg">
                    {getPlatformIcon(newSong.platform)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Indicador de validez del enlace */}
            {newSong.link && (
              <div className="mt-2 text-xs">
                {isValidLink ? (
                  <span className="text-green-300 flex items-center gap-1">
                    ✓ Enlace válido - {newSong.platform === 'spotify' ? 'Spotify' : 'YouTube'}
                  </span>
                ) : (
                  <span className="text-red-300 flex items-center gap-1">
                    ✗ Enlace inválido - Por favor usa Spotify o YouTube
                  </span>
                )}
              </div>
            )}

            {/* Ejemplos de enlaces */}
            <div className="mt-2 text-xs text-purple-200">
              <div className="mb-1">Ejemplos:</div>
              <div className="text-xs space-y-1">
                <div>• Spotify: open.spotify.com/track/...</div>
                <div>• YouTube: youtube.com/watch?v=...</div>
              </div>
            </div>
          </div>

          <button
            onClick={addSongToPlaylist}
            disabled={!newSong.link.trim() || !isValidLink}
            className={`w-full text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              newSong.platform === 'spotify' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
          >
            <span className="text-lg">{getPlatformIcon(newSong.platform)}</span>
            {t.add || 'Agregar canción'}
          </button>
        </div>
      )}
      
      {/* Lista de canciones mejorada */}
      <div className="max-h-80 overflow-y-auto space-y-3">
        {musicPlaylist.length === 0 ? (
          <div className="text-center text-pink-200 py-8">
            <div className="text-4xl mb-2">🎵</div>
            <div className="text-lg">{t.noSongs || 'Aún no hay canciones...'}</div>
            <div className="text-sm text-pink-300 mt-1">¡Comparte la primera canción de amor! 💕</div>
          </div>
        ) : (
          <div className="space-y-3">
            {musicPlaylist.map((song, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                {/* Información de la canción */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getPlatformIcon(song.platform || 'youtube')}</span>
                      <h4 className="text-white font-medium text-sm">{song.title}</h4>
                    </div>
                    <p className="text-pink-300 text-xs mb-1">{song.artist}</p>
                    <p className="text-pink-200 text-xs">por {song.addedBy}</p>
                  </div>
                  
                  {/* Botón de reproducción */}
                  {song.link && (
                    <button
                      onClick={() => playSong(song.link)}
                      className={`text-white px-4 py-2 rounded-full text-xs font-medium hover:scale-105 transition-transform duration-200 flex items-center gap-1 ${
                        song.platform === 'spotify' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                    >
                      <span>{song.platform === 'spotify' ? '🎵' : '📺'}</span>
                      {t.play || 'Reproducir'}
                    </button>
                  )}
                </div>

                {/* Spotify Embed (si es Spotify) */}
                {song.platform === 'spotify' && song.link && (
                  <div className="mt-3">
                    <iframe
                      src={getSpotifyEmbedUrl(song.link)}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allowtransparency="true"
                      allow="encrypted-media"
                      className="rounded-lg"
                      style={{ minHeight: '152px' }}
                    ></iframe>
                  </div>
                )}

                {/* Vista previa de YouTube (si es YouTube) */}
                {song.platform === 'youtube' && song.link && (
                  <div className="mt-3">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-white text-sm mb-2">📺 YouTube</div>
                      <button
                        onClick={() => playSong(song.link)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                      >
                        Abrir en YouTube
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlaylist;
