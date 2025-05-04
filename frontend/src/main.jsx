import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
  <Toaster />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
