import { useEffect, useState } from 'react';
import { account, Models } from '@/lib/appwrite';

type User = Models.User<Models.Preferences>;

export default function useAppwriteUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const current = await account.get<User>();
        if (mounted) setUser(current);
      } catch (e) {
        if (mounted) setUser(null), setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { user, loading, error };
}