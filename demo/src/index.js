import React from "react";
import ReactDOM from "react-dom";
import ScrollMenu from "../../src";

export default class Simple extends React.PureComponent {
  render() {
    return (
      <div>
        <ScrollMenu></ScrollMenu>
      </div>
    );
  }
}

ReactDOM.render(<Simple />, document.querySelector("#demo"));
