import { StrictMode } from 'react'
import { createRoot } from 'react-dom/frontend'
import './Styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
)
