import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import Header from './Header.tsx'
import SubHeaders from './SubHeaders.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Header />
    <SubHeaders />
  </React.StrictMode>,
)
