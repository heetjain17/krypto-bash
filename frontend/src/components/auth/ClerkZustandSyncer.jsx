import { useUserStore } from '@/store/useAuth';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

const ClerkZustandSyncer = () => {
  const { user, isLoaded } = useUser();
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(user, isLoaded);
  }, []);
  return null;
};

export default ClerkZustandSyncer;
