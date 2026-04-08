// Test if JS is executing
console.log("React app starting...");

// Check if React and ReactDOM are available
import React from 'react';
import { createRoot } from 'react-dom/client';

console.log("React version:", React.version);

const root = createRoot(document.getElementById('root'));
console.log("Root created");

root.render(
  <React.StrictMode>
    <div style={{ padding: '20px', background: 'yellow' }}>
      <h1>TEST: If you see this, React works!</h1>
    </div>
  </React.StrictMode>
);

console.log("Render called");
