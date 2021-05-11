import React from 'react';
import { getClientRect, getObjectFirstAttribute } from './utils';
import InnerWrapper from './InnerWrapper';
import ArrowRight from './ArrowRight';
import ArrowLeft from './ArrowLeft';
class ScrollMenu extends React.PureComponent {
  state = {
    mounted: false,
    initTranslate: 0,
    translate: 0,
    dragging: false,
    disabledRight: true,
    disabledLeft: true,
  };
  itemsRef = {};
  menuWidth = 0;
  itemsWidth = 0;
  componentDidMount() {
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragStop);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragStop);
  }

  componentWillReceiveProps(nextProps) {
    const { data, selected } = this.props;
    const { data: nextData, selected: nextSelected } = nextProps;
    if (data !== nextData) {
      this.setState({ mounted: false });
    }
  }
  getPoint = (ev) => {
    if ('touches' in ev) {
      return ev.touches[0].clientX;
    } else if ('clientX' in ev) {
      return ev.clientX;
    } else {
      return 0;
    }
  };
  handleDragStart = (e) => {
    const { translate: startDragTranslate } = this.state;
    this.startPoint = this.getPoint(e);
    this.startDragTranslate = startDragTranslate;
  };
  handleDrag = (e) => {
    if (!this.startPoint) return;
    const point = this.getPoint(e);
    const diff = point - this.startPoint;
    if (Math.abs(diff) > 6) {
      this.setState({ dragging: true });
    }
    this.calculateTranslate(e);
  };
  handleDragStop = (e) => {
    if (!this.startPoint) return;
    this.calculateTranslate(e);
    this.startPoint = false;
    const { initTranslate } = this.state;
    let translate = this.state.translate;
    if (this.itemsWidth < this.menuWidth) {
      translate = initTranslate;
    } else {
      if (this.state.translate > this.maxTranslate) {
        translate = this.maxTranslate;
      } else if (this.minTranslate > translate) {
        translate = this.minTranslate;
      }
    }
    this.setState({ translate, dragging: false });
    this.calculateArrow(translate);
  };
  calculateArrow = (translate) => {
    const disabledRight = translate <= this.minTranslate;
    const disabledLeft = translate >= this.maxTranslate;
    this.setState({ disabledRight, disabledLeft });
  };
  handleWheel = (e) => {
    if (e.deltaY < 0) {
      this.handleArrowClick();
    } else {
      this.handleArrowClick(false);
    }
  };
  handleArrowClick = (left = true) => {
    const firstItem = getObjectFirstAttribute(this.itemsRef);
    if (!firstItem) return;

    if (this.itemsWidth < this.menuWidth) {
      return;
    }

    const itemWidth = firstItem.width;
    const diff = itemWidth > this.menuWidth ? itemWidth : this.menuWidth - itemWidth;
    const { translate } = this.state;

    let newTranslate = left ? translate + diff : translate - diff;
    newTranslate = Math.max(newTranslate, this.minTranslate);
    newTranslate = Math.min(newTranslate, this.maxTranslate);
    this.setState({ translate: newTranslate });
    this.calculateArrow(newTranslate);
  };
  calculateTranslate = (e) => {
    const point = this.getPoint(e);
    const diff = point - this.startPoint;
    this.setState({ translate: this.startDragTranslate + diff });
  };
  setItemRef = (itemsRef, modifySource) => {
    this.itemsRef = itemsRef;
    if (modifySource === 'selected') {
      // this.resize();
    } else {
      this.setState({ mounted: false }, this.resize);
    }
  };
  setMenuWrapperRef = (menuWrapper) => {
    this.menuWrapper = menuWrapper;
  };

  resize = () => {
    const { width: menuWidth } = getClientRect(this.menuWrapper);
    let itemsWidth = 0;
    let offset = 0;
    window.itemsRef = this.itemsRef;
    for (let key in this.itemsRef) {
      const item = this.itemsRef[key];
      item.width = item.ref.scrollWidth;
      item.offset = offset + parseInt((menuWidth - item.width) / 2);
      itemsWidth += item.width;
      offset -= item.width;
    }
    this.menuWidth = menuWidth;
    this.itemsWidth = itemsWidth;

    window.menuWrapper = this.menuWrapper;
    console.log({ menuWidth, itemsWidth });

    const selected = this.findSelectedRef();

    let translate = 0;
    if (itemsWidth < menuWidth) {
      translate = parseInt((menuWidth - itemsWidth) / 2);
      this.minTranslate = translate;
      this.maxTranslate = translate;
    } else if (!selected) {
      this.minTranslate = this.menuWidth - this.itemsWidth;
      this.maxTranslate = 0;
    } else {
      this.minTranslate = this.menuWidth - this.itemsWidth;
      this.maxTranslate = 0;
      translate = selected.offset;
      translate = Math.max(translate, this.minTranslate);
      translate = Math.min(translate, this.maxTranslate);
    }
    this.setState({ initTranslate: translate, translate });
    this.calculateArrow(translate);
    setTimeout(() => {
      this.setState({ mounted: true });
    }, 10);
  };
  findSelectedRef = () => {
    const { selected } = this.props;
    if (!selected || selected === '') return false;
    for (let key in this.itemsRef) {
      if (key == selected) {
        return this.itemsRef[key];
      }
    }
    return false;
  };
  render() {
    const { data, renderItem, arrowRight, arrowLeft, selected } = this.props;
    const { translate, dragging, mounted, disabledLeft, disabledRight } = this.state;
    return (
      <React.Fragment>
        <ArrowLeft arrowLeft={arrowLeft} disabledLeft={disabledLeft} onClick={this.handleArrowClick.bind(this, true)} />
        <div ref={this.setMenuWrapperRef} onWheel={this.handleWheel}>
          <div
            style={{ overflow: 'hidden' }}
            onMouseDown={this.handleDragStart}
            onTouchStart={this.handleDragStart}
            onTouchEnd={this.handleDragStop}
            // onMouseMove={this.handleDrag}
            onTouchMove={this.handleDrag}
          >
            <InnerWrapper
              selected={selected}
              mounted={mounted}
              dragging={dragging}
              translate={translate}
              setItemRef={this.setItemRef}
              data={data}
              renderItem={renderItem}
            />
          </div>
        </div>
        <ArrowRight arrowRight={arrowRight} disabledRight={disabledRight} onClick={this.handleArrowClick.bind(this, false)} />
      </React.Fragment>
    );
  }
}
export default ScrollMenu;
