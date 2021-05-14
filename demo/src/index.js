import Block from 'dxc-flex';
import React from 'react';
import ReactDOM from 'react-dom';
import ScrollMenu from '../../src';
import './index.css';
export default class Simple extends React.PureComponent {
  state = {
    number: 20,
    items: [],
    width: 300,
    selected: 5,
  };
  componentDidMount() {
    this.onChangeNumber({ target: { value: 20 } });
  }
  onClick = (id) => {
    this.setState({ selected: id });
  };
  renderItem = ({ id }) => {
    return (
      <div onClick={this.onClick.bind(this, id)} className='item'>
        {id}
      </div>
    );
  };
  onClickOk = () => {};
  renderArrowRight = (disable, onClick) => {
    if (disable) return null;
    return (
      <Block
        onClick={onClick}
        horizontal='center'
        vertical='center'
        style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 20 }}
      >
        &gt;
      </Block>
    );
  };
  renderArrowLeft = (disable, onClick) => {
    if (disable) return null;
    return (
      <Block
        onClick={onClick}
        horizontal='center'
        vertical='center'
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 20 }}
      >
        &lt;
      </Block>
    );
  };
  onChange = (key, e) => {
    const { value } = e.target;
    this.setState({ [key]: value });
  };
  onChangeWidth = (e) => {
    const { value } = e.target;
    this.setState({ width: value }, () => {
      this.menu.resize();
    });
  };
  onChangeNumber = (e) => {
    const { value } = e.target;
    const items = [];
    for (let i = 1; i <= value; i++) {
      items.push({ id: i });
    }
    this.setState({ items, number: value });
  };
  render() {
    const { number, width, selected } = this.state;
    return (
      <div>
        <div
          style={{ width: parseInt(width), padding: 20, background: '#000', color: 'red', boxSizing: 'border-box', position: 'relative' }}
        >
          <ScrollMenu
            selected={selected}
            ref={(me) => (this.menu = me)}
            arrowRight={this.renderArrowRight}
            arrowLeft={this.renderArrowLeft}
            data={this.state.items}
            renderItem={this.renderItem}
          ></ScrollMenu>
        </div>
        <Block style={{ marginTop: 20 }}>
          <div>item数量: </div>
          <input value={number} onChange={this.onChangeNumber} />
        </Block>
        <Block style={{ marginTop: 20 }}>
          <div>菜单宽度: </div>
          <input value={width} onChange={this.onChangeWidth} />
        </Block>
        <Block style={{ marginTop: 20 }}>
          <div>选择id: </div>
          <input value={selected} onChange={this.onChange.bind(this, 'selected')} />
        </Block>
        {/* <Block onClick={this.onClickOk} horizontal='center' vertical='center' className='okBtn'>
          确认
        </Block> */}
      </div>
    );
  }
}

ReactDOM.render(<Simple />, document.querySelector('#demo'));
