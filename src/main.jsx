import { StrictMode } from 'react'
import {HeroUIProvider} from "@heroui/react";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <HeroUIProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </HeroUIProvider>
  ,
)
