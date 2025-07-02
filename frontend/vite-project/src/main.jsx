import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './styles.css'
import { routeTree } from './routeTree.gen';
import { ClerkProvider } from '@clerk/clerk-react'

const router = createRouter({ routeTree });

const rootElement = document.getElementById('root');

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
        <RouterProvider router={router} />
      </ClerkProvider>
    </StrictMode>
  );
}
