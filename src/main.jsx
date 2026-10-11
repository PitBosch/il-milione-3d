import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Nota: niente StrictMode, perché il doppio montaggio in sviluppo interferisce con le etichette HTML di drei sulla scena 3D.
createRoot(document.getElementById('root')).render(<App />)
