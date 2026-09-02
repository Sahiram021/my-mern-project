import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MainLayout from './MainLayout.jsx'
import './api/axiosConfig.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainLayout>
    <App />
    </MainLayout>
  </StrictMode>
)
