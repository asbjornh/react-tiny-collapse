import React, { Component } from "react";
import ReactDOM from "react-dom";

require("./style.css");

import Collapse from "../src";

class App extends Component {
  state = {
    content: true,
    innerVisible: false,
    visible: true
  };

  toggle = () => {
    this.setState(state => ({ visible: !state.visible }));
  };

  toggleContent = () => {
    this.setState(state => ({ content: !state.content }));
  };

  toggleInner = () => {
    this.setState(state => ({ innerVisible: !state.innerVisible }));
  };

  render() {
    return (
      <div className="page">
        <h1>TinyCollapse</h1>
        <button onClick={this.toggle}>Toggle open</button>
        <button onClick={this.toggleContent}>Toggle content</button>
        <button onClick={this.toggleInner}>Toggle inner collapse</button>
        <Collapse
          className="collapse"
          isOpen={this.state.visible}
          animateChildren={false}
          forceInitialAnimation={true}
        >
          <div className="component">
            {this.state.content ? (
              <h2>Content</h2>
            ) : (
              <div>
                <h2>More content</h2>
                <p>Lorem ipsum</p>
                <Collapse className="collapse" isOpen={this.state.innerVisible}>
                  <div>Dolor sit amet</div>
                </Collapse>
              </div>
            )}
          </div>
        </Collapse>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("App"));
