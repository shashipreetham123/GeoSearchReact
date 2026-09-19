import { useState } from 'react';

import Card from './Card';

const membershipOptions = [
    ['un', 'United Nations'], ['eu', 'European Union'], ['nato', 'NATO'],
    ['opec', 'OPEC'], ['arab_league', 'Arab League'], ['african_union', 'African Union'],
    ['g20', 'G20'], ['g7', 'G7'], ['brics', 'BRICS'], ['oecd', 'OECD'],
    ['commonwealth', 'Commonwealth'], ['schengen', 'Schengen'],
];

function isWithinRange(value, min, max) {
    const minValue = min === '' || min === undefined ? null : Number(min);
    const maxValue = max === '' || max === undefined ? null : Number(max);

    return (
        (minValue === null || value >= minValue) &&
        (maxValue === null || value <= maxValue)
    );
}

function matchesFilters(country, filters) {
    if (!filters) return true;

    const name = filters.name.trim().toLowerCase();
    const countryNames = [
        country.names?.common,
        country.names?.official,
        ...(country.names?.alternates ?? []),
    ].filter(Boolean);
    const area = country.area?.kilometers ?? 0;
    const population = country.population ?? 0;
    const density = area > 0 ? population / area : 0;
    const selectedMemberships = Object.entries(filters.memberships ?? {})
        .filter(([, selected]) => selected)
        .map(([membership]) => membership);

    return (
        (!name || countryNames.some((countryName) => countryName.toLowerCase().includes(name))) &&
        (!filters.region || country.region === filters.region) &&
        isWithinRange(population, filters.minPopulation, filters.maxPopulation) &&
        isWithinRange(area, filters.minArea, filters.maxArea) &&
        isWithinRange(density, filters.minPopulationDensity, filters.maxPopulationDensity) &&
        selectedMemberships.every((membership) => country.memberships?.[membership] === true)
    );
}

function SearchModal({ onClose, onSubmit }) {
    function handleSubmit(event) {
        event.preventDefault();

        const values = Object.fromEntries(new FormData(event.currentTarget));
        onSubmit({
            ...values,
            memberships: Object.fromEntries(
                membershipOptions.map(([membership]) => [membership, values[membership] === 'on'])
            ),
        });
    }

    return (
        <div className="modal custom-modal fade show d-block" tabIndex="-1" onClick={onClose}>
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(event) => event.stopPropagation()}>
                <form className="modal-content" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h2 className="modal-title fs-5">Search Countries</h2>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label" htmlFor="name">Country Name</label>
                                <input id="name" type="text" className="form-control" name="name" placeholder="e.g. Yemen" />
                            </div>
                            <NumberInput name="minPopulation" label="Min Population" placeholder="e.g. 100000000" />
                            <NumberInput name="maxPopulation" label="Max Population" placeholder="e.g. 300000000" />
                            <NumberInput name="minArea" label="Min Area" placeholder="e.g. 100000" />
                            <NumberInput name="maxArea" label="Max Area" placeholder="e.g. 1000000" />
                            <NumberInput name="minPopulationDensity" label="Min Population Density" placeholder="e.g. 100" />
                            <NumberInput name="maxPopulationDensity" label="Max Population Density" placeholder="e.g. 1000" />
                            <div className="col-12">
                                <label className="form-label" htmlFor="region">Region</label>
                                <select id="region" className="form-select" name="region">
                                    <option value="">All Regions</option>
                                    {['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Polar'].map((region) => (
                                        <option value={region} key={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12">
                                <p className="form-label mb-2">Memberships</p>
                                <div className="d-flex flex-wrap gap-3">
                                    {membershipOptions.map(([membership, label]) => (
                                        <div className="form-check" key={membership}>
                                            <input className="form-check-input" type="checkbox" name={membership} id={membership} />
                                            <label className="form-check-label" htmlFor={membership}>{label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function NumberInput({ name, label, placeholder }) {
    return (
        <div className="col-md-6">
            <label className="form-label" htmlFor={name}>{label}</label>
            <input id={name} type="number" className="form-control" name={name} min="0" placeholder={placeholder} />
        </div>
    );
}

function Search({ countries }) {
    const [showModal, setShowModal] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchFilters, setSearchFilters] = useState(null);
    const filteredCountries = countries.filter((country) => matchesFilters(country, searchFilters));

    return (
        <>
            <main className="container-fluid p-3">
                <h1 className="m-3">Search Results</h1>
                {!hasSearched && (
                    <p className="m-3 text-muted">Click on Search icon to Search for Country</p>
                )}
                <h2 className="h3 m-3 text-muted">Found {filteredCountries.length} countries</h2>
                <div className="row">
                    {filteredCountries.map((country) => (
                        <div className="col-md-4 col-lg-2 col-12" key={country.codes?.alpha_3}>
                            <Card country={country} />
                        </div>
                    ))}
                </div>
            </main>

            {showModal && (
                <SearchModal
                    onClose={() => setShowModal(false)}
                    onSubmit={(formValues) => {
                        setSearchFilters(formValues);
                        setHasSearched(true);
                        setShowModal(false);
                    }}
                />
            )}

            <button
                type="button"
                className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4 shadow"
                style={{ width: '60px', height: '60px' }}
                onClick={() => setShowModal(true)}
                aria-label="Open search filters"
            >
                <i className="bi bi-search" />
            </button>
        </>
    );
}

export default Search;
