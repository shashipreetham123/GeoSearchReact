import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './Navbar';
import Search from './Search';
import Viewer from './Viewer';

const fields = 'names.alternates,names.common,names.official,codes.alpha_3,capitals.coordinates,captals.name,flag.description,flag.emoji,flag.url_png,flag.url_svg,region,subregion,area,calling_codes,continents,coordinates,currencies,descriptions,government_type,links,memberships,population,timezones';
const apiKey = 'rc_live_1d4eeea2b9ab46fcb9581ab4bdced59b';

function App() {
    const [allCountries, setAllCountries] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function loadCountries() {
            const offsets = [
                { limit: 100, offset: 0 },
                { limit: 100, offset: 100 },
                { limit: 54, offset: 200 },
            ];

            const responses = await Promise.all(
                offsets.map(({ limit, offset }) =>
                    fetch(`https://api.restcountries.com/countries/v5?${fields}&limit=${limit}&offset=${offset}`, {
                        headers: { Authorization: `Bearer ${apiKey}` },
                    }).then((response) => response.json())
                )
            );

            setAllCountries(responses.flatMap((response) => response.data.objects));
            setLoaded(true);
        }

        loadCountries();
    }, []);

    if (!loaded) {
        return <p className="center-text">Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Search countries={allCountries} />} />
                <Route path="/country/:code" element={<Viewer countries={allCountries} />} />
            </Routes>
        </>
    );
}

export default App;
