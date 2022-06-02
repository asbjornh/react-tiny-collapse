import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOMServer from "react-dom/server";

import App from "./app";

if (typeof document !== "undefined") {
	const root = createRoot(document.getElementById("mount-point"));
	root.createRoot(<App />);
}

export default ({ webpackStats }) => {
  const files = Object.keys(webpackStats.compilation.assets);
  const css = files.filter(value => value.match(/\.css$/));
  const js = files.filter(value => value.match(/\.js$/));

  return `<!doctype html>${ReactDOMServer.renderToString(
    <html>
      <head>
        {css.map((file, index) => (
          <link key={index} rel="stylesheet" href={`/${file}`} />
        ))}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <script src="/webpack-dev-server.js" />
        <title>TinyCollapse</title>
      </head>
      <body>
        <div id="mount-point">
          <App />
        </div>
        {js.map((file, index) => <script key={index} src={`/${file}`} />)}
      </body>
    </html>
  )}`;
};
