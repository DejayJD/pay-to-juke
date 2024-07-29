import React from 'react'
import ReactDOM from 'react-dom/client'
import '@audius/harmony/dist/harmony.css'

import './solana_dev.ts'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
