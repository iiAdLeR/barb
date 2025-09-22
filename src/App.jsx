import React from 'react';
import RomanticSite from './RomanticSite';

function App() {
  console.log('App component loaded');
  
  // Add error boundary
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error) => {
      console.error('App error:', error);
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h1>⚠️ خطأ في التطبيق</h1>
          <p>حدث خطأ أثناء تحميل التطبيق</p>
          <p style={{fontSize: '14px', opacity: 0.8}}>{error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'white',
              color: '#8B5CF6',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <RomanticSite />
    </div>
  );
}

export default App;