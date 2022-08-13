import logo from './logo.svg';
import './App.css';
import NavBar from './navbar';
import Ranks from './ranks';
import { Navigate, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <NavBar />
      <Ranks />
      
    </div>
  );
}

export default App;
