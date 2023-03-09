import './App.css';
import Tutorial from './Components/Tutorial/index';
import { queryParameters } from './utils/getParams.utils';

function App() {
  const compact = !!Number(queryParameters.get('compact'));

  return <Tutorial compact={compact} />;
}

export default App;
