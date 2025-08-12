import { useEffect, useState } from "react";
import { account } from "../lib/appwrite";

export function useAppwriteUser() {
  const [user, setUser] = useState<null | { $id: string; name?: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { const u = await account.get(); if (mounted) setUser(u as any); }
      catch { if (mounted) setUser(null); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  return { user, loading };
}