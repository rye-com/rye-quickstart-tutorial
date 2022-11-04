import './App.css';
import Tutorial from './Components/Tutorial';
import { AnalyticsBrowser } from '@segment/analytics-next';

const devKey = 'yv3GSCG8FGnDawBWNCRYbKDRjvLHDqdx';
const prodKey = 'bN1nSWedUvp3WNAB9baPCNG87RrEkrSk';
const writeKey = window.location.origin === 'https://tutorial.rye.com' ? prodKey : devKey;

const analytics = AnalyticsBrowser.load({ writeKey });
analytics.page();

function App() {
  return <Tutorial analytics={analytics} />;
}

export default App;
