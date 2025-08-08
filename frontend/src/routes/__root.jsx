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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar2 from '@/components/Navbar';
import Navbar3 from '@/components/Navbar';

export const Route = createRootRoute({
  component: RootComponent,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

function RootComponent() {
  const navigate = useNavigate();
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        navigate={(to) => navigate({ to })}
      >
        <ClerkZustandSyncer />
        <div className="max-w-7xl mx-auto">
          <Navbar3 />
          <main>
            <Outlet />
          </main>
        </div>
      </ClerkProvider>
      <TanStackRouterDevtools position="bottom-right" />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
