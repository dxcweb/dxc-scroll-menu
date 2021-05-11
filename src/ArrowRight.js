import React from "react";

class ArrowRight extends React.PureComponent {
  render() {
    const { arrowRight, disabledRight, onClick } = this.props;
    return arrowRight ? arrowRight(disabledRight, onClick) : null;
  }
}
export default ArrowRight;
