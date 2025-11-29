import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import './lib/leaflet-setup.ts';
import { queryClient } from './QueryClient/queryClient.ts'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux';
import { store } from './store/store.ts'
import ErrorBoundary from './Boundary/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <QueryClientProvider client={queryClient}>
        <Router>
            <ErrorBoundary>
          <App />
            </ErrorBoundary>
        </Router>
      </QueryClientProvider>
    </Provider>
   </StrictMode>,
)
