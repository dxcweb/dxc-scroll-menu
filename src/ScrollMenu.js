import React from "react";
import { getClientRect, getObjectFirstAttribute } from "./utils";
import InnerWrapper from "./InnerWrapper";
import ArrowRight from "./ArrowRight";
import ArrowLeft from "./ArrowLeft";
import { orderBy } from "lodash";

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
    document.addEventListener("mousemove", this.handleDrag);
    document.addEventListener("mouseup", this.handleDragStop);
    window.addEventListener("resize", this.onResize);
  }
  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.handleDragStop);
    window.removeEventListener("resize", this.onResize);
    clearTimeout(this.inertiaTimeout);
    clearTimeout(this.resizeTimeOut);
  }
  onResize = () => {
    clearTimeout(this.resizeTimeOut);
    this.resizeTimeOut = setTimeout(() => {
      this.setRef();
      this.resize();
    }, 300);
  };

  componentWillReceiveProps(nextProps) {
    const { data, selected } = this.props;
    const { data: nextData, selected: nextSelected } = nextProps;
    if (data !== nextData) {
      this.setState({ mounted: false });
    }
  }
  getPoint = (ev) => {
    if ("touches" in ev) {
      return ev.touches[0].clientX;
    } else if ("clientX" in ev) {
      return ev.clientX;
    } else {
      return 0;
    }
  };
  handleDragStart = (e) => {
    const { translate: startDragTranslate } = this.state;
    this.startPoint = this.getPoint(e);
    this.startDragTranslate = startDragTranslate;
    this.startDragTime = Date.now();
    this.isInertia = false;
  };
  handleDrag = (e) => {
    if (!this.startPoint) return;
    const point = this.getPoint(e);
    const diff = point - this.startPoint;
    if (Math.abs(diff) > 6) {
      this.setState({ dragging: true });
    }
    this.setState({ translate: this.startDragTranslate + diff });
  };
  handleDragStop = (e) => {
    if (!this.startPoint) return;
    const { dragging } = this.state;
    this.startPoint = false;
    if (!dragging) return;
    let translate = this.state.translate;

    const speed = (this.startDragTranslate - translate) / (Date.now() - this.startDragTime);
    this.isInertia = true;
    this.inertia(Math.abs(speed) * 1.2, speed > 0 ? "right" : "left");
  };
  inertia = (speed, direction) => {
    if (speed <= 0 || !this.isInertia) {
      this.inertiaStop();
      this.setState({ dragging: false });

      return;
    }
    const interval = 5;
    let { translate } = this.state;
    translate = direction === "right" ? translate - speed * interval : translate + speed * interval;
    this.setState({ translate });
    this.inertiaTimeout = setTimeout(() => {
      let resistance = 0.01;
      if (translate > this.maxTranslate || this.minTranslate > translate) {
        resistance = 0.3;
      }
      this.inertia(speed - resistance, direction);
    }, interval);
  };
  inertiaStop = () => {
    this.isInertia = false;
    let translate = this.state.translate;
    if (this.state.translate > this.maxTranslate) {
      translate = this.maxTranslate;
      this.setState({ translate, dragging: false });
      this.calculateArrow(translate);
    } else if (this.minTranslate > translate) {
      translate = this.minTranslate;
      this.setState({ translate, dragging: false });
      this.calculateArrow(translate);
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

  setItemRef = (itemsRef, modifySource) => {
    this.itemsRef = itemsRef;
    if (modifySource === "selected") {
      this.setRef();
      // this.resize();
    } else {
      this.setState({ mounted: false }, () => {
        this.setRef();
        this.resize();
      });
    }
  };
  setMenuWrapperRef = (menuWrapper) => {
    this.menuWrapper = menuWrapper;
  };
  setRef = () => {
    const { width: menuWidth } = getClientRect(this.menuWrapper);
    if (menuWidth === 0) return;
    let itemsWidth = 0;
    let offset = 0;
    const refArr = orderBy(this.itemsRef, ["index"]);
    for (let i = 0; i < refArr.length; i++) {
      const key = refArr[i].key;
      const item = this.itemsRef[key];
      item.width = item.ref.scrollWidth;
      item.offset = offset + parseInt((menuWidth - item.width) / 2);
      itemsWidth += item.width;
      offset -= item.width;
    }
    this.menuWidth = menuWidth;
    this.itemsWidth = itemsWidth;
  };
  resize = () => {
    const selected = this.findSelectedRef();

    let translate = 0;
    if (this.itemsWidth < this.menuWidth) {
      const { horizontal } = this.props;
      if (horizontal === "left") {
        translate = 0;
      } else {
        translate = parseInt((this.menuWidth - this.itemsWidth) / 2);
      }

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
    if (!selected || selected === "") return false;
    for (let key in this.itemsRef) {
      if (key == selected) {
        return this.itemsRef[key];
      }
    }
    return false;
  };
  render() {
    const { data, renderItem, arrowRight, arrowLeft, selected, itemData } = this.props;
    const { translate, dragging, mounted, disabledLeft, disabledRight } = this.state;
    return (
      <React.Fragment>
        <ArrowLeft arrowLeft={arrowLeft} disabledLeft={disabledLeft} onClick={this.handleArrowClick.bind(this, true)} />
        <div ref={this.setMenuWrapperRef} onWheel={this.handleWheel}>
          <div
            style={{ overflow: "hidden" }}
            onMouseDown={this.handleDragStart}
            onTouchStart={this.handleDragStart}
            onTouchEnd={this.handleDragStop}
            // onMouseMove={this.handleDrag}
            onTouchMove={this.handleDrag}
          >
            <InnerWrapper
              itemData={itemData}
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
