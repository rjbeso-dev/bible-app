import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SettingsProvider } from './context/SettingsProvider'
import { AudioProvider } from './context/AudioProvider'
import './styles/globals.css'
import './styles/reader.css'
import './styles/dashboard.css'
import './styles/shell.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
