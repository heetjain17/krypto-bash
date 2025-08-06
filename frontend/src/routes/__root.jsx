import {
  createRootRoute,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import '../styles.css';
import { ClerkProvider } from '@clerk/clerk-react';
import ClerkZustandSyncer from '@/components/auth/ClerkZustandSyncer';

export const Route = createRootRoute({
  component: RootComponent,
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

function RootComponent() {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate({ to })}
    >
      <ClerkZustandSyncer />
      <Outlet />
      <TanStackRouterDevtools />
    </ClerkProvider>
  );
}
