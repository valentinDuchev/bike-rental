import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import client from '../api/client';

type Status = 'loading' | 'online' | 'error';

const ServerStatusContext = createContext<Status>('loading');

export function ServerStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    client
      .get('/settings/default-price')
      .then(() => setStatus('online'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <ServerStatusContext.Provider value={status}>
      {children}
    </ServerStatusContext.Provider>
  );
}

export function useServerStatus() {
  return useContext(ServerStatusContext);
}
