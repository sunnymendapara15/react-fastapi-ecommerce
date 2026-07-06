import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="logo">Radiant Commerce</div>
          <nav className="main-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Home
            </NavLink>
            <NavLink to="/catalog" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Catalog
            </NavLink>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>Built with React & FastAPI · Demo storefront · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
