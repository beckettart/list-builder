import './App.css';
import React from "react";

function Button(props) {
  return (
    <button aria-label={props.ariaLabel} className={props.className} onClick={(e) => props.onClick(props.target)}>{props.content}</button>
  );
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.firstName,
      item: props.item,
      lastName: props.lastName
    };
  }

  render() {
    return (
      <form>
        <InputField inputName={'first-name'} labelClass={''} labelValue={'First Name'} type={'text'} wrapperClass={'field--first-name'} value={this.state.firstName} />
        <InputField inputName={'last-name'} labelValue={'Last Name'} type={'text'} wrapperClass={'field--last-name'} value={this.state.lastName} />
        <InputField inputName={'list-item'} labelValue={'List Item'} type={'text'} wrapperClass={'field--list-item'} value={this.state.item} />
        <Input type={'button'} value={'Enter'} />
      </form>
    );
  }
}

function Input(props) {
  return (
    <input onChange={props.onChange} onClick={props.onClick} type={props.type} value={props.value} />
  );
}

function InputField(props) {
  const labelClasses = 'input-label' + props.labelClass;
  const label = props.labelValue ? <Label className={labelClasses.trim()} htmlFor={props.inputName} value={props.labelValue}/> : '';
  const wrapperClasses = 'input-field ' + props.wrapperClass;

  return (
    <div className={wrapperClasses.trim()}>
      {label}
      <Input type={props.type} name={props.inputName} value={props.inputValue} />
    </div>
  );
}

function Label(props) {
  return (
    <label htmlFor={props.htmlFor}>{props.value}</label>
  );
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: props.items};
    this.handleClick = this.handleClick.bind(this);
  }

  uniqueKeys = [];

  cleanKey(value) {
    value = value.toLowerCase();
    return value.replace(/\W+/g, '-');
  }

  createItem(item) {
    let itemKey = this.createUniqueKey(item);
    return <ListItem className={'list-item list-item--' + itemKey} itemId={itemKey} key={itemKey} removeAction={this.handleClick} value={item} />
  }

  createUniqueKey(value) {
    let baseKey = this.cleanKey(value);
    let uk = 2;
    let uniqueKey = baseKey;

    while (this.uniqueKeys.includes(uniqueKey)) {
      uniqueKey = baseKey + '--' + uk;
      uk++;
    }

    return uniqueKey;
  }

  handleClick(id) {
    const index = this.state.items.indexOf(id);
    let itemsState = this.state.items.slice(0);

    if (index > -1) {
      itemsState.splice(index, 1);
      this.setState({
        items: itemsState
      });
    }
  }

  render() {
    return (
      <ul>
        {this.state.items.map((item) => this.createItem(item))}
      </ul>
    );
  }
}

function ListItem(props) {
  return (
    <li className={props.className} key={props.itemId}>
      <Text value={props.value} />
      <Button className={'button-remove-item js-button-remove-item'} content={'X'} ariaLabel={'Remove ' + props.value} onClick={props.removeAction} target={props.value} />
    </li>
  );
}

function Text(props) {
  return (
    <span>{props.value}</span>
  );
}

function App() {
  return (
    <div className="App">
      <Form />
      <List items={['Bread', 'Eggs', 'Milk']} />
    </div>
  );
}

export default App;
