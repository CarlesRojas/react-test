import { useEffect, useContext } from "react";
import Map from "./components/Map";
import Search from "./components/Search"

// Style
import "./styles/app.scss";

// Contexts
import { MapsAPI } from "./contexts/MapsAPI";

export default function App() {
    console.log("Render App");
    // Contexts
    const { mapsAPILoaded, loadMapsAPI } = useContext(MapsAPI);

    // Load google maps API
    useEffect(() => {
        if (!mapsAPILoaded && loadMapsAPI) loadMapsAPI();
    }, [loadMapsAPI, mapsAPILoaded]);

    return (
        <div className="app">
            {mapsAPILoaded && <Map></Map>}
            {mapsAPILoaded && <Search></Search>}

        </div>
    );
}
