import React from 'react'
import ReactDOM from 'react-dom/client'
import { BeforeApp } from './BeforeApp.tsx'
import '@audius/harmony/dist/harmony.css'

import './solana_dev.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BeforeApp />
  </React.StrictMode>
)
