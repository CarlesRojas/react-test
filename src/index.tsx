import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Contexts
import { Provider } from "react-redux";
import { store } from "./redux/index";
import MapsAPIProvider from "./contexts/MapsAPI";

import "./styles/index.scss";

ReactDOM.render(
    <StrictMode>
        <MapsAPIProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </MapsAPIProvider>
    </StrictMode>,

    document.getElementById("root")
);
