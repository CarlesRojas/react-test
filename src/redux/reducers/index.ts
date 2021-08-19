import { combineReducers } from "redux";
import mapsReducer from "./mapsReducer";

const reducers = combineReducers({
    maps: mapsReducer,
});

export default reducers;
export type State = ReturnType<typeof reducers>;
