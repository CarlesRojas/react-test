import { useRef, useEffect, useContext } from "react";

import "../styles/map.scss";
import mapStyle from "../styles/mapStyle.json";

// Contexts
import { MapsAPI } from "../contexts/MapsAPI";

// Types
type GoogleLatLng = google.maps.LatLng;

export default function Map() {
    // Contexts
    const { map, setMap } = useContext(MapsAPI);

    // #################################################
    //   INIT MAP
    // #################################################

    // Map container ref
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = (zoomLevel: number, adress: GoogleLatLng): void => {
            if (mapRef.current) {
                // Create new map
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

                // Save map in context
                if (setMap) setMap(map);
            }
        };

        // Create map centered in Barcelona
        if (!map) initMap(6, new google.maps.LatLng(41.386950887735196, 2.170084327636621));
    }, [map, setMap]);

    // #################################################
    //   RENDER
    // #################################################

    return <div className="map" ref={mapRef}></div>;
}
