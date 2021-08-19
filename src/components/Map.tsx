import { useRef, useEffect, useContext } from "react";

import "../styles/map.scss";
import mapStyle from "../styles/mapStyle.json";

// Contexts
import { MapsAPI } from "../contexts/MapsAPI";

// Types
type GoogleLatLng = google.maps.LatLng;

export default function Map() {
    console.log("Render Map");
    // Contexts
    const { map, setMap } = useContext(MapsAPI);

    // Map container ref
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = (zoomLevel: number, adress: GoogleLatLng): void => {
            if (mapRef.current) {
                console.log("Init Map");
                const map = new google.maps.Map(mapRef.current, {
                    zoom: zoomLevel,
                    center: adress,
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: JSON.parse(JSON.stringify(mapStyle)),
                });

                if (setMap) setMap(map);
            }
        };

        if (!map) initMap(6, new google.maps.LatLng(41.386950887735196, 2.170084327636621));
    }, [map, setMap]);

    return <div className="map" ref={mapRef}></div>;
}
