import { ActionType } from "../actionTypes";
import { Marker } from "../actions";
import { Action, Dispatch } from "redux";

export const addMarker = (marker: Marker) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionType.ADD_MARKER,
            payload: marker,
        });
    };
};
