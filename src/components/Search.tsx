import React, { useState, useRef, useEffect, useContext, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux";
import { Suggestion as SuggestionType } from "../contexts/MapsAPI";
import Suggestion from "./Suggestion";
import SVG from "react-inlinesvg";

// Contexts
import { MapsAPI } from "../contexts/MapsAPI";

// Style
import "../styles/search.scss";

// Icons
import CrossIcon from "../resources/cross.svg";
import SearchIcon from "../resources/search.svg";

interface SearchState {
    suggestions: SuggestionType[];
    selected: number;
    query: string;
}

// Types
type InputEvent = React.FormEvent<HTMLInputElement>;

export default function Search() {
    // Contexts
    const { getSuggestions, map } = useContext(MapsAPI);

    // #################################################
    //   STATE
    // #################################################

    // Redux Marker
    const dispatch = useDispatch();
    const { addMarker } = bindActionCreators(actionCreators, dispatch);

    // Search state
    const [searchState, setSearchState] = useState<SearchState>({ suggestions: [], selected: 0, query: "" });

    // #################################################
    //   EVENTS
    // #################################################

    // Click outside ref
    const wrapperRef = useRef<HTMLDivElement>(null);
    const onClickOutside = () => {
        setSearchState({ suggestions: [], selected: 0, query: "" });
    };
    useOutsideAlerter(wrapperRef, onClickOutside);

    // Get suggestions timeout
    const suggestionsTimeout = useRef<NodeJS.Timeout | null>(null);

    // On search query change
    const onInputChange = (event: InputEvent) => {
        const value = event.currentTarget.value;

        // Set value
        setSearchState((prev) => ({ ...prev, query: value }));

        // Clear timeout
        if (suggestionsTimeout.current) clearTimeout(suggestionsTimeout.current);

        // Get suggestions
        if (value && value.length >= 4) {
            suggestionsTimeout.current = setTimeout(async () => {
                if (getSuggestions) {
                    const suggestionResult = await getSuggestions(value);
                    setSearchState((prev) => ({ ...prev, suggestions: suggestionResult, selected: 0 }));
                }
            }, 500);
        }

        // Clear suggestions
        else setSearchState((prev) => ({ ...prev, suggestions: [], selected: 0 }));
    };

    // On hover over suggestion
    const onMouseEnter = (i: number) => {
        setSearchState((prev) => ({ ...prev, selected: i }));
    };

    // Use arrows to navigate suggestions
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].indexOf(event.code) > -1) {
            // Prevent scroll
            event.preventDefault();

            // Move up
            if (event.code === "ArrowUp") {
                setSearchState((prev) => ({ ...prev, selected: prev.selected === 0 ? prev.suggestions.length - 1 : prev.selected - 1 }));
            }

            // Move down
            else if (event.code === "ArrowDown") {
                setSearchState((prev) => ({ ...prev, selected: (prev.selected + 1) % prev.suggestions.length }));
            }

            // Select suggestion
            else if (event.code === "Enter" && searchState.selected < searchState.suggestions.length) {
                onSuggestionClick(searchState.suggestions[searchState.selected]);
            }
        }
    };

    // Input ref
    const inputRef = useRef<HTMLInputElement>(null);

    // On clear button clicked
    const onClearClicked = () => {
        setSearchState({ suggestions: [], selected: 0, query: "" });
        inputRef.current?.focus();
    };

    // On suggestion clicked
    const onSuggestionClick = (suggestion: SuggestionType) => {
        setSearchState({ suggestions: [], selected: 0, query: suggestion.name });

        if (map) {
            // Add new marker to the map
            new google.maps.Marker({
                position: new google.maps.LatLng(suggestion.lat, suggestion.lng),
                map,
                title: suggestion.name,
            });

            // Pan to the marker
            map.panTo(new google.maps.LatLng(suggestion.lat, suggestion.lng));

            // Dispatch action
            addMarker(suggestion);
        }
    };

    // #################################################
    //   COMPONENT MOUNT & UNMOUNT
    // #################################################

    // On component mount and unmount
    useEffect(() => {
        const timeoutRef = suggestionsTimeout.current;

        return () => {
            // Clear timeout on unmount
            if (timeoutRef) clearTimeout(timeoutRef);
        };
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Suggestions
    const suggestionDOM =
        searchState.suggestions && searchState.suggestions.length ? (
            <div className="suggestions">
                {searchState.suggestions.map((suggestion, i) => {
                    return (
                        <Suggestion
                            key={suggestion.id}
                            suggestion={suggestion}
                            i={i}
                            selected={searchState.selected === i}
                            onMouseEnter={onMouseEnter}
                            onSuggestionClick={onSuggestionClick}
                            query={searchState.query}
                        ></Suggestion>
                    );
                })}
            </div>
        ) : null;

    return (
        <div className="search" onKeyDown={onKeyDown} ref={wrapperRef}>
            <div className="inputContainer">
                <input type="text" placeholder="Search places..." value={searchState.query} onChange={onInputChange} ref={inputRef} />
                {searchState.query.length <= 0 && <SVG className="icon" src={SearchIcon} onClick={() => inputRef.current?.focus()} />}
                {searchState.query.length > 0 && <SVG className="icon" src={CrossIcon} onClick={onClearClicked} />}
            </div>

            {suggestionDOM}
        </div>
    );
}

// #################################################
//   HOOKS
// #################################################

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
