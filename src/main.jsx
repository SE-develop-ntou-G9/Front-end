import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './header.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />

    {/* 把上面的標題固定，不會往下滑就不見 */}
    <div className="pt-14">
      <App />
    </div>
  </StrictMode>,
)
