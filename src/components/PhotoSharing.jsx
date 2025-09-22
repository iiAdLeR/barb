import React, { useState, useEffect } from 'react';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

const PhotoSharing = ({ db, userId, userName, t, playHeartBeatSound }) => {
  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ caption: '', imageFile: null, imageUrl: '' });
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Obtener y sincronizar fotos compartidas
  useEffect(() => {
    const photosRef = ref(db, 'sharedPhotos');
    onValue(photosRef, (snapshot) => {
      const photos = snapshot.val() || {};
      const photoArray = Object.values(photos).sort((a, b) => b.timestamp - a.timestamp);
      setSharedPhotos(photoArray.slice(0, 20)); // Keep only the latest 20
    });
  }, [db]);

  // Convertir archivo de imagen a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Manejar selección de archivo
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('¡El tamaño de la imagen es muy grande! Máximo 5 MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      setNewPhoto(prev => ({ ...prev, imageFile: file }));
      
      try {
        const base64 = await convertToBase64(file);
        setNewPhoto(prev => ({ ...prev, imageUrl: base64 }));
      } catch (error) {
        console.error('Error converting image:', error);
        alert('Error al convertir la imagen');
      }
    }
  };

  // Add photo to gallery
  const addPhotoToGallery = async () => {
    if (!newPhoto.caption.trim() || !newPhoto.imageUrl.trim()) return;
    
    setUploading(true);
    
    try {
      const photosRef = ref(db, 'sharedPhotos');
      push(photosRef, {
        caption: newPhoto.caption.trim(),
        imageUrl: newPhoto.imageUrl.trim(),
        sharedBy: userName || 'Guest',
        timestamp: serverTimestamp(),
        userId: userId,
        isBase64: true // Mark as base64 image
      });
      
      setNewPhoto({ caption: '', imageFile: null, imageUrl: '' });
      setShowAddPhoto(false);
      
      // Play success sound
      playHeartBeatSound();
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return t.justNow;
    const seconds = (Date.now() - timestamp) / 1000;
    if (seconds < 60) return t.justNow;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}${t.minutesAgo}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}${t.hoursAgo}`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="w-full max-w-md bg-white/15 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-white drop-shadow-lg">{t.sharedPhotos || 'Shared Photos'}</h3>
        <button
          onClick={() => setShowAddPhoto(!showAddPhoto)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200"
        >
          {t.addPhoto || 'Add Photo 📸'}
        </button>
      </div>
      
      {/* Caja de agregar foto */}
      {showAddPhoto && (
        <div className="mb-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          {/* Selección de imagen del dispositivo */}
          <div className="mb-3">
            <label className="block text-white text-sm font-medium mb-2">
              Selecciona una imagen de tu dispositivo 📸
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            {newPhoto.imageFile && (
              <div className="mt-2 text-green-300 text-sm">
                ✓ Seleccionado: {newPhoto.imageFile.name}
              </div>
            )}
          </div>
          
          {/* Vista previa de la imagen */}
          {newPhoto.imageUrl && (
            <div className="mb-3">
              <img
                src={newPhoto.imageUrl}
                alt="Vista previa de la imagen"
                className="w-full h-32 object-cover rounded-lg border border-white/20"
              />
            </div>
          )}
          
          {/* Leyenda */}
          <textarea
            value={newPhoto.caption}
            onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})}
            placeholder={t.photoCaption || 'Agrega una descripción para la imagen...'}
            className="w-full bg-white/20 backdrop-blur-sm placeholder-white/70 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 resize-none"
            rows="2"
            maxLength="150"
          />
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-blue-200 text-sm">{newPhoto.caption.length}/150</span>
            <button
              onClick={addPhotoToGallery}
              disabled={!newPhoto.caption.trim() || !newPhoto.imageUrl.trim() || uploading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  {t.share || 'Compartir 📸'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Galería de fotos - optimizada para móvil */}
      <div className="max-h-80 overflow-y-auto space-y-3">
        {sharedPhotos.length === 0 ? (
          <div className="text-center text-blue-200 py-8">
            <div className="text-4xl mb-2">📸</div>
            <div className="text-lg">{t.noPhotos || 'Aún no hay fotos...'}</div>
            <div className="text-sm text-blue-300 mt-1">¡Comparte la primera foto con tu amada! 💕</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sharedPhotos.map((photo, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                {/* Información del remitente */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {photo.sharedBy.charAt(0)}
                    </div>
                    <span className="text-blue-300 font-medium text-sm">{photo.sharedBy}</span>
                  </div>
                  <span className="text-blue-200 text-xs">{getTimeAgo(photo.timestamp)}</span>
                </div>
                
                {/* Imagen - optimizada para móvil */}
                <div className="mb-3 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                    onClick={() => {
                      // Abrir imagen en nueva ventana para vista completa
                      window.open(photo.imageUrl, '_blank');
                    }}
                  />
                </div>
                
                {/* Leyenda */}
                {photo.caption && (
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-white text-sm leading-relaxed">{photo.caption}</p>
                  </div>
                )}
                
                {/* Interacción adicional */}
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => {
                      // Copiar enlace de la imagen
                      navigator.clipboard.writeText(photo.imageUrl);
                      alert('¡Enlace de la imagen copiado!');
                    }}
                    className="text-blue-300 hover:text-blue-200 text-xs transition-colors duration-200"
                  >
                    📋 Copiar enlace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSharing;
