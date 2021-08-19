import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/index";

import "./styles/index.scss";

ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,

    document.getElementById("root")
);
