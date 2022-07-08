import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import rootReducer from "../src/redux/rootReducer";
// import { createStore, applyMiddleware } from "redux";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // <-- New code

import thunk from "redux-thunk";

let store = createStore(rootReducer, applyMiddleware(thunk));
//edit to redeploy
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
