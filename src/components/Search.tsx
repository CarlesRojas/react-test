import React, { useState, useRef, useEffect, useContext } from "react";

// Contexts
import { MapsAPI } from "../contexts/MapsAPI";

// Style
import "../styles/search.scss";

// Types
type InputEvent = React.FormEvent<HTMLInputElement>;
export default function Search() {
    console.log("Render Search");

    // Contexts
    const { getSuggestions } = useContext(MapsAPI);

    // Current search query
    const [query, setQuery] = useState("");

    // Get suggestions timeout
    const suggestionsTimeout = useRef<NodeJS.Timeout | null>(null);

    // On search query change
    const onInputChange = (event: InputEvent) => {
        const value = event.currentTarget.value;

        // Set value
        setQuery(value);

        // Clear timeout
        if (suggestionsTimeout.current) clearTimeout(suggestionsTimeout.current);

        // Get suggestions
        suggestionsTimeout.current = setTimeout(async () => {
            if (getSuggestions && value) console.log(await getSuggestions(value));
        }, 500);
    };

    // On component mount and unmount
    useEffect(() => {
        const timeoutRef = suggestionsTimeout.current;

        return () => {
            // Clear timeout on unmount
            if (timeoutRef) clearTimeout(timeoutRef);
        };
    }, []);

    return (
        <div className="search">
            <input type="text" value={query} onChange={onInputChange} />
        </div>
    );
}
