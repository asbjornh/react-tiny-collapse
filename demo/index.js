import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

if (typeof document !== "undefined") {
  ReactDOM.render(<App />, document.getElementById("App"));
}
