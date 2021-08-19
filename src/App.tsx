import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "./redux";

export default function App() {
    const dispatch = useDispatch();

    const { addMarker } = bindActionCreators(actionCreators, dispatch);
    const markers = useSelector((state: State) => state.maps);

    return (
        <div className="app">
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
