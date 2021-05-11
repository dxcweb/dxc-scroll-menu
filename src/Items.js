import React from 'react';

class Items extends React.PureComponent {
  state = {
    items: [],
  };
  itemsRef = {};

  componentWillReceiveProps(nextProps) {
    const { data, selected } = this.props;
    const { data: nextData, selected: nextSelected } = nextProps;
    if (data !== nextData) {
      this.init('data');
    } else if (nextSelected != selected) {
      this.init('selected');
    }
  }
  setRef = (key, index, ref) => {
    if (!ref) return;
    const { setItemRef, data } = this.props;
    this.itemsRef[key] = { index, key, ref };
    if (Object.keys(this.itemsRef).length === data.length) {
      setItemRef(this.itemsRef, this.modifySource);
    }
  };
  modifySource = 'modifyData';
  init = (modifySource) => {
    this.itemsRef = {};
    this.modifySource = modifySource;
  };

  render() {
    const { data, renderItem } = this.props;
    if (!data || !renderItem) return null;
    return data.map((item, i) => {
      return (
        <div
          style={{ userSelect: 'none' }}
          ref={(inst) => this.setRef(item.id || i, i, inst)}
          // className={`${itemClass} ${Item.props.selected ? itemClassActive : ""}`}
          key={'menuItem-' + item.id}
          // style={itemStyle}
          // tabIndex={disableTabindex ? undefined : 0}
          // role={useButtonRole ? "button" : undefined}
        >
          {renderItem(item, i)}
        </div>
      );
    });
  }
}
export default Items;
