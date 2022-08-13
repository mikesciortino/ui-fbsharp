import { Link } from 'react-router-dom';
import logo from './shared/football.svg';

function Home() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="text-3xl font-bold mt-10">
                Welcome Home
                </h1>
            </header>
        </div>
    );
};

export default Home;