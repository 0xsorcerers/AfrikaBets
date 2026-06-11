import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThirdwebProvider } from 'thirdweb/react'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
)
