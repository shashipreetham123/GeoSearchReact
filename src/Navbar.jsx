import { NavLink, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const routeCountryCode = location.pathname.match(/^\/country\/([^/]+)$/)?.[1];

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top">
            <div className="container">
                <NavLink className="navbar-brand" to="/">Geo Search</NavLink>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/" end>Search</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={routeCountryCode ? `/country/${routeCountryCode}` : '/'}>
                            Country
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
