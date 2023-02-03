import './App.css';
import Tutorial from './Components/Tutorial';
import type { ThemeEnum } from './Components/Tutorial/types';

function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const compact = !!Number(queryParameters.get("compact"));
  const theme = queryParameters.get("theme") as ThemeEnum;

  return <Tutorial isInIFrame={compact} theme={theme} />;
}

export default App;
