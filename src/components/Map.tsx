import React, { useState, useRef, useEffect } from "react";

import "../styles/map.scss";
import mapStyle from "../styles/mapStyle.json";

// Types
type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;

export default function Map() {
    console.log("Render Map");

    // Map container ref
    const mapRef = useRef<HTMLDivElement>(null);

    // Map state
    const [map, setMap] = useState<GoogleMap>();

    // Init map
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

            setMap(map);
        }
    };

    useEffect(() => {
        if (!map) initMap(13, new google.maps.LatLng(41.386950887735196, 2.170084327636621));
    }, [map]);

    return <div className="map" ref={mapRef}></div>;
}
