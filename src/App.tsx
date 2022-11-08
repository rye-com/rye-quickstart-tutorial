import './App.css';
import Tutorial from './Components/Tutorial';
import { getRyelytics } from './shared-analytics/getRyelytics';

const ryelytics = getRyelytics();

function App() {
  return <Tutorial ryelytics={ryelytics} />;
}

export default App;
