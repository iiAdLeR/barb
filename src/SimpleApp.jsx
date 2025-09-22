import React from 'react';

const SimpleApp = () => {
  console.log('SimpleApp loaded successfully!');
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        🎉 AYHAN & BARBARA 💕
      </h1>
      
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        مرحباً! التطبيق يعمل الآن على الجوال! 🚀
      </p>
      
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2>✅ تم إصلاح المشكلة!</h2>
        <p>الصفحة البيضاء تم حلها</p>
      </div>
      
      <button
        onClick={() => {
          alert('زر يعمل! 🎉');
          console.log('Button clicked successfully!');
        }}
        style={{
          background: 'white',
          color: '#8B5CF6',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '25px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        اضغط هنا للاختبار 🎯
      </button>
      
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'red',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        DEBUG: ✅ يعمل
      </div>
    </div>
  );
};

export default SimpleApp;
