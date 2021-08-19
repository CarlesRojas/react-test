import React, { useState, useRef, useEffect, useContext, MouseEvent, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux";
import { Suggestion } from "../contexts/MapsAPI";
import SVG from "react-inlinesvg";

// Contexts
import { MapsAPI } from "../contexts/MapsAPI";

// Style
import "../styles/search.scss";

// Icons
import CrossIcon from "../resources/cross.svg";

interface SearchState {
    suggestions: Suggestion[];
    selected: number;
    query: string;
}

// Types
type InputEvent = React.FormEvent<HTMLInputElement>;

export default function Search() {
    // Contexts
    const { getSuggestions, map } = useContext(MapsAPI);

    // Redux Marker
    const dispatch = useDispatch();
    const { addMarker } = bindActionCreators(actionCreators, dispatch);

    // Search state
    const [searchState, setSearchState] = useState<SearchState>({ suggestions: [], selected: 0, query: "" });

    // Get suggestions timeout
    const suggestionsTimeout = useRef<NodeJS.Timeout | null>(null);

    // Click outside ref
    const wrapperRef = useRef<HTMLDivElement>(null);
    const onClickOutside = () => {
        setSearchState({ suggestions: [], selected: 0, query: "" });
    };
    useOutsideAlerter(wrapperRef, onClickOutside);

    // On search query change
    const onInputChange = (event: InputEvent) => {
        const value = event.currentTarget.value;

        // Set value
        setSearchState((prev) => {
            return { ...prev, query: value };
        });

        // Clear timeout
        if (suggestionsTimeout.current) clearTimeout(suggestionsTimeout.current);

        // Get suggestions
        if (value && value.length >= 4) {
            suggestionsTimeout.current = setTimeout(async () => {
                if (getSuggestions) {
                    const suggestionResult = await getSuggestions(value);
                    console.log(value);
                    console.log(suggestionResult);

                    setSearchState((prev) => {
                        return { ...prev, suggestions: suggestionResult, selected: 0 };
                    });
                }
            }, 500);
        }

        // Clear suggestions
        else
            setSearchState((prev) => {
                return { ...prev, suggestions: [], selected: 0 };
            });
    };

    // On hover over suggestion
    const onMouseEnter = (event: MouseEvent<HTMLParagraphElement>, i: number) => {
        setSearchState((prev) => {
            return { ...prev, selected: i };
        });
    };

    // Use arrows to navigate suggestions
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].indexOf(event.code) > -1) {
            // Prevent scroll
            event.preventDefault();

            // Move up
            if (event.code === "ArrowUp") {
                setSearchState((prev) => {
                    return { ...prev, selected: prev.selected === 0 ? prev.suggestions.length - 1 : prev.selected - 1 };
                });
            }

            // Move down
            else if (event.code === "ArrowDown") {
                setSearchState((prev) => {
                    return { ...prev, selected: (prev.selected + 1) % prev.suggestions.length };
                });
            }

            // Select suggestion
            else if (event.code === "Enter" && searchState.selected < searchState.suggestions.length) {
                onSuggestionClick(searchState.suggestions[searchState.selected]);
            }
        }
    };

    // On clear button clicked
    const onClearClicked = () => {
        setSearchState({ suggestions: [], selected: 0, query: "" });
    };

    // On suggestion clicked
    const onSuggestionClick = (suggestion: Suggestion) => {
        console.log(suggestion);
        setSearchState({ suggestions: [], selected: 0, query: suggestion.name });

        if (map) {
            new google.maps.Marker({
                position: new google.maps.LatLng(suggestion.lat, suggestion.lng),
                map,
                title: suggestion.name,
            });

            map.panTo(new google.maps.LatLng(suggestion.lat, suggestion.lng));

            addMarker(suggestion);
        }
    };

    // On component mount and unmount
    useEffect(() => {
        const timeoutRef = suggestionsTimeout.current;

        return () => {
            // Clear timeout on unmount
            if (timeoutRef) clearTimeout(timeoutRef);
        };
    }, []);

    // Suggestions
    const suggestionDOM =
        searchState.suggestions && searchState.suggestions.length ? (
            <div className="suggestions">
                {searchState.suggestions.map((suggestion, i) => {
                    const queryIndex = suggestion.name.toLowerCase().indexOf(searchState.query.toLowerCase());

                    return (
                        <p
                            className={searchState.selected === i ? "selected" : ""}
                            key={suggestion.id}
                            onMouseEnter={(event: MouseEvent<HTMLParagraphElement>) => onMouseEnter(event, i)}
                            onClick={() => onSuggestionClick(suggestion)}
                        >
                            {suggestion.name.slice(0, queryIndex)}
                            <span>{suggestion.name.slice(queryIndex, queryIndex + searchState.query.length)}</span>
                            {suggestion.name.slice(queryIndex + searchState.query.length, suggestion.name.length)}
                        </p>
                    );
                })}
            </div>
        ) : null;

    return (
        <div className="search" onKeyDown={onKeyDown} ref={wrapperRef}>
            <div className="inputContainer">
                <input type="text" value={searchState.query} onChange={onInputChange} />
                {searchState.query.length > 0 && <SVG className="clear" src={CrossIcon} onClick={onClearClicked} />}
            </div>

            {suggestionDOM}
        </div>
    );
}

// Hook to alert of a click outside of the component
function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>, callback: () => any) {
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            if (ref.current && event && !ref.current.contains(event.target as Node)) callback();
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}
