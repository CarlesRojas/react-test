import React from "react";
import renderer from "react-test-renderer";
import Suggestion from "../Suggestion";

test("Suggestion should render the name with the query part highlighted", () => {
    // Mock Suggestion
    const mockSuggestion = {
        name: "Barcelona",
        lat: 41.386950887735196,
        lng: 2.170084327636621,
        id: "randomID",
    };

    // Create snapshot
    const suggestionJSON = renderer.create(<Suggestion suggestion={mockSuggestion} i={0} selected={true} onMouseEnter={() => null} onSuggestionClick={() => null} query="arcelon" />).toJSON();

    // Compare with previous snapshot
    expect(suggestionJSON).toMatchSnapshot();
});
