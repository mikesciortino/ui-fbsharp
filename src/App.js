import logo from './logo.svg';
import './App.css';
import NavBar from './navbar';
import Ranks from './ranks';
import Home from './Home'
import About from './About';
import NotFound from './NotFound';
import ComingSoon from './ComingSoon';
import DraftTool from './DraftTool';
import { Navigate, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ranks" element={<Ranks />} />
        <Route path="/drafttool" element={<DraftTool />} />
        <Route path="/blog" element={<ComingSoon />} />
        <Route path="/hypehub" element={<ComingSoon />} />
        <Route path="/tradecalculator" element={<ComingSoon />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
