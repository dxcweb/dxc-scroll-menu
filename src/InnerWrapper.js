import React from "react";
import styles from "../assets/InnerWrapper.css";
import classNames from "classnames/bind";
// import Block from "dxc-flex";
import Items from "./Items";
const cx = classNames.bind(styles);
class InnerWrapper extends React.PureComponent {
  state = {
    items: [],
  };
  componentDidMount() {
    const { children } = this.props;
    this.setState({ items: children });
  }

  render() {
    const { translate, data, renderItem, setItemRef, dragging, mounted, selected, itemData, setItemsWpRef } = this.props;
    let transition = 0.1;
    const wrapperStyles = {
      transform: `translate3d(${translate}px, 0, 0)`,
      transition: `transform ${dragging || !mounted ? "0" : transition}s  ease-out`,
      pointerEvents: "all",
    };
    return (
      <div className={cx("innerWrapperClass")} style={wrapperStyles}>
        <div className={cx("itemsWp")} ref={setItemsWpRef}>
          <Items itemData={itemData} selected={selected} renderItem={renderItem} data={data} setItemRef={setItemRef} />
        </div>
      </div>
    );
  }
}
export default InnerWrapper;
