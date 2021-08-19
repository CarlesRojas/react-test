import { useEffect, useContext } from "react";
import Map from "./components/Map";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "./redux";

// Style
import "./styles/app.scss";

// Contexts
import { MapsAPI } from "./contexts/MapsAPI";

export default function App() {
    console.log("Render App");
    // Contexts
    const { mapsAPILoaded, loadMapsAPI } = useContext(MapsAPI);

    // Redux Marker
    const dispatch = useDispatch();
    const { addMarker } = bindActionCreators(actionCreators, dispatch);
    const markers = useSelector((state: State) => state.maps);

    // Load google maps API
    useEffect(() => {
        if (!mapsAPILoaded && loadMapsAPI) loadMapsAPI();
    }, [loadMapsAPI, mapsAPILoaded]);

    return (
        <div className="app">
            {mapsAPILoaded && <Map></Map>}

            {markers.map(({ name, lat, lon }) => (
                <div className="marker" key={`${lat} ${lon}`}>
                    <p className="name">{name}</p>
                    <p className="coord">{`${lat} ${lon}`}</p>
                </div>
            ))}

            <button onClick={() => addMarker({ name: "Marker", lat: Math.random(), lon: Math.random() })}>Add Marker</button>
        </div>
    );
}
