import { Link } from 'react-router-dom';

function Card({ country }) {
    return (
        <Link
            to={`/GeoSearchApp/country/${country.codes.alpha_3}`}
            className="text-decoration-none text-reset"
        >
            <div className="card custom-card">
                <img src={country.flag.url_png || country.flag.url_svg || 'https://placehold.co/150'} className="card-img-top" alt={country.names.common} />

                <div className="card-body">
                    <h5 className="card-title">{country.names.common}</h5>
                </div>
            </div>
        </Link>
    )

}

export default Card;
