import logo from './logo.svg';
import Start from './components/Start';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Start />
      </header>
    </div>
  );
}

export default App;
