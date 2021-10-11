import './App.css';
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.removeItem = this.removeItem.bind(this);
    this.submitValue = this.submitValue.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.state = {
      error: '',
      firstName: '',
      heading: '',
      items: ['Bread', 'Eggs', 'Milk'],
      lastName: '',
      listTitle: '',
      newItem: ''
    };
  }

  removeItem(id) {
    const index = this.state.items.indexOf(id);
    let itemsState = this.state.items.slice(0);

    if (index > -1) {
      itemsState.splice(index, 1);
      this.setState({
        error: '',
        items: itemsState
      });
    }
  }

  submitValue() {
    if (this.state.newItem) {
      this.setState({
        error: '',
        items: [...this.state.items, this.state.newItem],
        newItem: ''
      });
    }
    else {
      this.setState({
        error: 'The new list item must be at least one character long.'
      });
    }
  }

  updateInput(state, value) {

    this.setState({
      error: '',
      [state]: value
    });
  }

  render() {
    return (
      <main className="App">
        <ListHeading firstName={this.state.firstName} lastName={this.state.lastName} listTitle={this.state.listTitle} headingClass={'list-heading'} />
        <Form error={this.state.error} itemInputUpdate={this.updateInput} itemSubmit={this.submitValue} firstName={this.state.firstName} lastName={this.state.lastName} newItem={this.state.newItem} />
        <List items={this.state.items} removeAction={this.removeItem} />
      </main>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <Form />
//       <List items={['Bread', 'Eggs', 'Milk']} />
//     </div>
//   );
// }

function Button(props) {
  return (
    <button aria-label={props.ariaLabel} className={props.className} onClick={() => props.onClick(props.target)}>{props.content}</button>
  );
}

function Form(props) {
  const classPrefix = 'field--';

  return (
    <form>
      <InputField inputName={'first-name'} inputUpdate={props.itemInputUpdate} inputValue={props.firstName} stateUpdate={'firstName'} labelClass={''} labelValue={'First Name'} type={'text'} wrapperClass={classPrefix + 'first-name'} />
      <InputField inputName={'last-name'} inputUpdate={props.itemInputUpdate} inputValue={props.lastName} stateUpdate={'lastName'} labelValue={'Last Name'} type={'text'} wrapperClass={classPrefix + 'last-name'} />
      <InputField inputName={'list-title'} inputUpdate={props.itemInputUpdate} inputValue={props.listTitle} stateUpdate={'listTitle'} labelValue={'List Title'} type={'text'} wrapperClass={classPrefix + 'list-title'} />
      <InputField inputName={'list-item'} inputUpdate={props.itemInputUpdate} inputValue={props.newItem} stateUpdate={'newItem'} labelValue={'New Item'} type={'text'} wrapperClass={classPrefix + 'list-item'} />
      <Input onClick={props.itemSubmit} type={'button'} value={'Add Item'} />
      <div className={'message'}><Text className={'message--error'} value={props.error} /></div>
    </form>
  );
}

// class Form extends React.Component {
//   // constructor(props) {
//   //   super(props);
//   // }
//
//   render() {
//     return (
//       <form>
//         <InputField inputName={'first-name'} labelClass={''} labelValue={'First Name'} type={'text'} wrapperClass={'field--first-name'} value={this.props.firstName} />
//         <InputField inputName={'last-name'} labelValue={'Last Name'} type={'text'} wrapperClass={'field--last-name'} value={this.props.lastName} />
//         <InputField inputName={'list-item'} labelValue={'List Item'} type={'text'} wrapperClass={'field--list-item'} value={this.props.itemText} />
//         <Input type={'button'} value={'Enter'} />
//       </form>
//     );
//   }
// }

function Heading(props) {
  return (
    <h1 className={props.className}>{props.content}</h1>
  );
}

function Input(props) {
  return (
    <input onChange={(e) => props.onChange(props.stateUpdate, e.target.value)} onClick={props.onClick} type={props.type} value={props.value} />
  );
}

function InputField(props) {
  const labelClasses = 'input-label' + props.labelClass;
  const label = props.labelValue ? <Label className={labelClasses.trim()} htmlFor={props.inputName} value={props.labelValue}/> : '';
  const wrapperClasses = 'input-field ' + props.wrapperClass;

  return (
    <div className={wrapperClasses.trim()}>
      {label}
      <Input name={props.inputName} onChange={props.inputUpdate} stateUpdate={props.stateUpdate} type={props.type} value={props.inputValue} />
    </div>
  );
}

function Label(props) {
  return (
    <label htmlFor={props.htmlFor}>{props.value}</label>
  );
}

class List extends React.Component {
  uniqueKeys = [];

  cleanKey(value) {
    value = value.toLowerCase();
    return value.replace(/\W+/g, '-');
  }

  createItem(item) {
    let itemKey = this.createUniqueKey(item);
    return <ListItem className={'list-item list-item--' + itemKey} itemId={itemKey} key={itemKey} removeAction={this.props.removeAction} value={item} />
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

  render() {
    return (
      <div className={'list'}>
        <div className={'list-title'}><Text value={''} /></div>
        <ul>
          {this.props.items.map((item) => this.createItem(item))}
        </ul>
      </div>
    );
  }
}

function ListHeading(props) {
  const listTitle = props.listTitle ? props.listTitle : '';
  let heading = 'List';
  let listOwner = props.firstName + ' ' + props.lastName;
  listOwner = listOwner.trim();

  if (listOwner) {
    heading = listTitle ?
      listOwner + '’s ' + listTitle :
      listOwner + '’s ' + heading;
  }
  else if (listTitle) {
    heading = listTitle;
  }

  return (
    <Heading className={props.className} content={heading}/>
  );
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
    <span className={props.className}>{props.value}</span>
  );
}

export default App;
