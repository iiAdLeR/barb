import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Add debugging for mobile
console.log('Main.jsx loaded successfully');
console.log('React version:', React.version);
console.log('User agent:', navigator.userAgent);

// Check if root element exists
const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Error: Root element not found</div>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    console.log('React root created successfully');
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <h1>خطأ في تحميل التطبيق</h1>
        <p>Error: ${error.message}</p>
        <button onclick="window.location.reload()">إعادة المحاولة</button>
      </div>
    `;
  }
}