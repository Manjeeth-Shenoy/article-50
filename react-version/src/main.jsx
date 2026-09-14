import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'brandsync-tokens/tokens.css'
import './brandsync/brandsync-components.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
