import React from "react";

class Arrow extends React.PureComponent {
  //   shouldComponentUpdate(nextProps, nextState) {
  //     const { disabledLeftNext, dragging } = nextProps;
  //     const { disabledLeft } = this.props;
  //     if (dragging) {
  //       return false;
  //     }
  //     // if (disabledLeft !== disabledLeftNext) {
  //     //   console.log();
  //     //   return true;
  //     // }
  //     // if (disabledLeft !== disabledLeftNext) {
  //     //   return true;
  //     // }
  //     return true;
  //   }
  render() {
    const { arrowRight, disabledLeft, disabledRight } = this.props;
    console.log({ disabledLeft, disabledRight });
    return (
      <React.Fragment>
        {arrowRight()}
        {arrowRight()}
      </React.Fragment>
    );
  }
}
export default Arrow;
