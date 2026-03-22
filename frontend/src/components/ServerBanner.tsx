import { useServerStatus } from '../hooks/useServerStatus';
import '../styles/banner.css';

function ServerBanner() {
  const status = useServerStatus();

  if (status === 'online') return null;

  return (
    <div className={`server-banner ${status}`}>
      {status === 'loading' && (
        <>
          <div className="spinner" />
          <span>Waking up the server — free tier sleeps after inactivity, this can take up to 50 seconds...</span>
        </>
      )}
      {status === 'error' && (
        <span>Could not reach the server. Please try refreshing the page.</span>
      )}
    </div>
  );
}

export default ServerBanner;
