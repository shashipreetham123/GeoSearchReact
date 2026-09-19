import { NavLink, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const routeCountryCode = location.pathname.match(/^\/GeoSearchApp\/country\/([^/]+)$/)?.[1];

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top">
            <div className="container">
                <NavLink className="navbar-brand" to="/GeoSearchApp/">Geo Search</NavLink>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/GeoSearchApp/" end>Search</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={routeCountryCode ? `/GeoSearchApp/country/${routeCountryCode}` : '/GeoSearchApp/'}>
                            Country
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
