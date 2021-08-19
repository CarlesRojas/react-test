import { ActionType } from "../actionTypes";
import { Action, Marker } from "../actions";

const initialState: Marker[] = [];

const reducer = (state: Marker[] = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.ADD_MARKER:
            return [...state, action.payload];
        default:
            return state;
    }
};

export default reducer;
