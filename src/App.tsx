import { useEffect, useContext } from "react";
import Map from "./components/Map";
import Search from "./components/Search"

// Style
import "./styles/app.scss";

// Contexts
import { MapsAPI } from "./contexts/MapsAPI";

export default function App() {
    // Contexts
    const { mapsAPILoaded, loadMapsAPI } = useContext(MapsAPI);

    // #################################################
    //   LOAD MAPS
    // #################################################

    // Load google maps API
    useEffect(() => {
        if (!mapsAPILoaded && loadMapsAPI) loadMapsAPI();
    }, [loadMapsAPI, mapsAPILoaded]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="app">
            {mapsAPILoaded && <Map></Map>}
            {mapsAPILoaded && <Search></Search>}

        </div>
    );
}
