import { Suggestion as SuggestionType } from "../contexts/MapsAPI";

interface Props {
    suggestion: SuggestionType;
    i: number;
    selected: boolean;
    onMouseEnter: (i: number) => any;
    onSuggestionClick: (suggestion: SuggestionType) => any;
    query: string;
}

export default function Suggestion({ suggestion, i, selected, onMouseEnter, onSuggestionClick, query }: Props) {
    // Normalize string
    const normalizeString = (value: string) => {
        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "");
    };

    // Get index where the query is found in the description
    const queryIndex = normalizeString(suggestion.name).indexOf(normalizeString(query));

    // #################################################
    //   RENDER
    // #################################################

    return (
        <p className={selected ? "selected" : ""} onMouseEnter={() => onMouseEnter(i)} onClick={() => onSuggestionClick(suggestion)}>
            {suggestion.name.slice(0, queryIndex)}
            <span>{suggestion.name.slice(queryIndex, queryIndex + query.length)}</span>
            {suggestion.name.slice(queryIndex + query.length, suggestion.name.length)}
        </p>
    );
}
