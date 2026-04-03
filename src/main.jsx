import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1f2028',
            color: '#fff',
            border: '1px solid #2e303a'
          }
        }}/>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
