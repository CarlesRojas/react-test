import React, { createContext, useState, useRef } from "react";

// Suggestion interface
export interface Suggestion {
    name: string;
    lat: number;
    lng: number;
    id: string;
}

// Context interface
interface MapsAPIInterface {
    map?: GoogleMap;
    setMap?: React.Dispatch<React.SetStateAction<GoogleMap | undefined>>;
    mapsAPILoaded?: boolean;
    loadMapsAPI?: () => Promise<void>;
    getSuggestions?: (query: string) => Promise<Suggestion[]>;
}

// Types
type GoogleMap = google.maps.Map;
type Geocoder = google.maps.Geocoder;
type Place = google.maps.places.QueryAutocompletePrediction;

// API Context
export const MapsAPI = createContext<MapsAPIInterface>({});

const MapsAPIProvider: React.FC = ({ children }) => {
    // #################################################
    //   STATE
    // #################################################

    const [mapsAPILoaded, setMapsAPILoaded] = useState(false);
    const [map, setMap] = useState<GoogleMap>();
    const geocoder = useRef<Geocoder>();

    // #################################################
    //   LOAD MAPS
    // #################################################

    // Load Maps API
    const loadMapsAPI = async () => {
        // Create google api script
        const mapsScript = document.createElement("script");
        mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
        mapsScript.async = true;
        mapsScript.defer = true;

        // Add script to body
        window.document.body.appendChild(mapsScript);

        // On api load
        mapsScript.addEventListener("load", function () {
            setMapsAPILoaded(true);
        });
    };

    // #################################################
    //   GET SUGGESTIONS
    // #################################################

    // Get suggestions for a query
    const getSuggestions = async (query: string): Promise<Suggestion[]> => {
        if (!geocoder.current) geocoder.current = new google.maps.Geocoder();

        // Function to get lat and lng of a place
        const getPlaceInfo = async (place: Place): Promise<Suggestion> => {
            return new Promise((resolve, reject) => {
                if (!geocoder.current) return reject();

                const result = {
                    name: place.description,
                    id: place.place_id,
                };

                geocoder.current.geocode({ placeId: place.place_id }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK && results) {
                        resolve({
                            ...result,
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                            id: results[0].place_id,
                        });
                    } else reject();
                });
            });
        };

        return new Promise((resolve) => {
            // Get service
            const service = new google.maps.places.AutocompleteService();

            // Search
            service.getQueryPredictions({ input: query }, (results, status) => {
                // Results Ok
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    Promise.all(results.map((result) => getPlaceInfo(result)))
                        .then((values) => {
                            resolve(values);
                        })
                        .catch(() => {
                            resolve([]);
                        });
                }

                // Error
                else {
                    resolve([]);
                }
            });
        });
    };

    // Return the context
    return (
        <MapsAPI.Provider
            value={{
                map,
                setMap,
                mapsAPILoaded,
                loadMapsAPI,
                getSuggestions,
            }}
        >
            {children}
        </MapsAPI.Provider>
    );
};

export default MapsAPIProvider;
