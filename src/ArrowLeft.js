import React from "react";

class ArrowLeft extends React.PureComponent {
  render() {
    const { arrowLeft, disabledLeft, onClick } = this.props;
    return arrowLeft ? arrowLeft(disabledLeft, onClick) : null;
  }
}
export default ArrowLeft;
