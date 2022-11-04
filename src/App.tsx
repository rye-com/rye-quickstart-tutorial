import './App.css';
import Tutorial from './Components/Tutorial';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { getRyeAnalytics } from './shared-analytics/getRyeAnalytics';

const devKey = 'yv3GSCG8FGnDawBWNCRYbKDRjvLHDqdx';
const prodKey = 'bN1nSWedUvp3WNAB9baPCNG87RrEkrSk';
const writeKey = window.location.origin === 'https://tutorial.rye.com' ? prodKey : devKey;

const analytics = AnalyticsBrowser.load({ writeKey });
analytics.page();

function App() {
  return <Tutorial ryelytics={getRyeAnalytics(analytics)} />;
}

export default App;
