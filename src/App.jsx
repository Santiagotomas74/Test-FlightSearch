
import './App.css';
import FlightsApp from './home/view/View';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <FlightsApp />
    </BrowserRouter>
  );
}
export default App;
