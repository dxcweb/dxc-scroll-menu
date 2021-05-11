import React from 'react';
import styles from '../assets/InnerWrapper.css';
import classNames from 'classnames/bind';
import Block from 'dxc-flex';
import { getClientRect } from './utils';
import Items from './Items';
const cx = classNames.bind(styles);
class InnerWrapper extends React.PureComponent {
  state = {
    items: [],
  };
  componentDidMount() {
    const { children } = this.props;
    this.setState({ items: children });
  }

  setMenuInnerRef = (menuInner) => {
    const { width: menuInnerWidth } = getClientRect(menuInner);
  };
  render() {
    const { translate, data, renderItem, setItemRef, dragging, mounted, selected } = this.props;
    let transition = 0.1;
    const wrapperStyles = {
      transform: `translate3d(${translate}px, 0, 0)`,
      transition: `transform ${dragging || !mounted ? '0' : transition}s  ease-out`,
    };
    return (
      <Block className={cx('innerWrapperClass')} style={wrapperStyles} ref={(inst) => this.setMenuInnerRef(inst)}>
        <Items selected={selected} renderItem={renderItem} data={data} setItemRef={setItemRef} />
      </Block>
    );
  }
}
export default InnerWrapper;
