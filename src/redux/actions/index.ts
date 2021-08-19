import { ActionType } from "../actionTypes";

export interface Marker {
    name: string;
    lat: number;
    lon: number;
}

export interface AddMarkerAction {
    type: ActionType.ADD_MARKER;
    payload: Marker;
}

export type Action = AddMarkerAction;
