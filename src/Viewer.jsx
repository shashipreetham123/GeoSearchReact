import { useParams } from 'react-router-dom';

function DetailItem({ label, children }) {
    return (
        <div className="col-md-6">
            <dt className="text-muted small text-uppercase">{label}</dt>
            <dd className="mb-3">{children || 'Not available'}</dd>
        </div>
    );
}

function formatMembershipName(name) {
    const abbreviations = ['un', 'eu', 'g20', 'g7', 'nato', 'oecd', 'opec', 'brics', 'asean'];

    if (abbreviations.includes(name)) return name.toUpperCase();

    return name.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Viewer({ countries }) {
    const { code } = useParams();
    const country = countries.find((item) => item.codes?.alpha_3 === code);

    if (!country) {
        return (
            <main className="container py-4">
                <p>Country not found.</p>
            </main>
        );
    }

    const memberships = Object.entries(country.memberships ?? {})
        .filter(([, isMember]) => isMember);
    const capitals = country.capitals ?? [];
    const currencies = country.currencies ?? [];

    return (
        <main className="container py-5">
            <section className="row g-4 align-items-center mb-5">
                <div className="col-md-4 col-lg-3">
                    <img
                        src={country.flag?.url_png || country.flag?.url_svg}
                        className="img-fluid rounded shadow-sm border"
                        alt={country.flag?.description || `Flag of ${country.names?.common}`}
                    />
                </div>
                <div className="col-md-8 col-lg-9">
                    <p className="text-uppercase text-muted mb-1">{country.names?.common}</p>
                    <h1 className="display-5">{country.names?.official}</h1>
                    <span className="badge text-bg-primary fs-6">{country.codes?.alpha_3}</span>
                    {country.flag?.description && <p className="mt-3 mb-0">{country.flag.description}</p>}
                </div>
            </section>

            {country.descriptions?.long && (
                <section className="mb-5">
                    <h2 className="h4">About</h2>
                    <p className="lead">{country.descriptions.long}</p>
                </section>
            )}

            <section className="mb-5">
                <h2 className="h4 mb-3">Country details</h2>
                <dl className="row">
                    <DetailItem label="Common name">{country.names?.common}</DetailItem>
                    <DetailItem label="Alternate names">{country.names?.alternates?.join(', ')}</DetailItem>
                    <DetailItem label="Region">{country.region}</DetailItem>
                    <DetailItem label="Subregion">{country.subregion}</DetailItem>
                    <DetailItem label="Continents">{country.continents?.join(', ')}</DetailItem>
                    <DetailItem label="Government type">{country.government_type}</DetailItem>
                    <DetailItem label="Population">{country.population?.toLocaleString()}</DetailItem>
                    <DetailItem label="Area">
                        {country.area && `${country.area.kilometers?.toLocaleString()} km² (${country.area.miles?.toLocaleString()} mi²)`}
                    </DetailItem>
                    <DetailItem label="Country coordinates">
                        {country.coordinates && `${country.coordinates.lat}, ${country.coordinates.lng}`}
                    </DetailItem>
                    <DetailItem label="Timezones">{country.timezones?.join(', ')}</DetailItem>
                    <DetailItem label="Calling codes">{country.calling_codes?.join(', ')}</DetailItem>
                    <DetailItem label="Flag emoji">{country.flag?.emoji}</DetailItem>
                </dl>
            </section>

            <section className="mb-5">
                <h2 className="h4 mb-3">Capitals</h2>
                {capitals.length ? (
                    <ul className="list-group">
                        {capitals.map((capital, index) => (
                            <li className="list-group-item" key={index}>
                                {capital.name || 'Capital'}
                                {capital.coordinates && ` — ${capital.coordinates.lat}, ${capital.coordinates.lng}`}
                            </li>
                        ))}
                    </ul>
                ) : <p>Not available</p>}
            </section>

            <section className="mb-5">
                <h2 className="h4 mb-3">Currencies</h2>
                {currencies.length ? (
                    <div className="row g-3">
                        {currencies.map((currency) => (
                            <div className="col-md-6" key={currency.code}>
                                <div className="border rounded p-3">
                                    <strong>{currency.code}</strong> — {currency.name} {currency.symbol && `(${currency.symbol})`}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>Not available</p>}
            </section>

            <section className="mb-5">
                <h2 className="h4 mb-3">Memberships</h2>
                {memberships.length ? (
                    <ul className="list-group">
                        {memberships.map(([membership]) => (
                            <li className="list-group-item" key={membership}>
                                {formatMembershipName(membership)}
                            </li>
                        ))}
                    </ul>
                ) : <p>Not a member of the listed organizations.</p>}
            </section>

            <section>
                <h2 className="h4 mb-3">Links</h2>
                <div className="d-flex flex-wrap gap-2">
                    {Object.entries(country.links ?? {}).map(([label, url]) => (
                        <a className="btn btn-outline-primary" href={url} target="_blank" rel="noreferrer" key={label}>
                            {label.replaceAll('_', ' ')}
                        </a>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Viewer;
