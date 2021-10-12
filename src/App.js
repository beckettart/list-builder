import './App.css';
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.clearList = this.clearList.bind(this);
    this.defaultItems = ['Bread', 'Milk', 'Eggs'];
    this.redo = this.redo.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.resetList = this.resetList.bind(this);
    this.reverseItems = this.reverseItems.bind(this);
    this.sortItems = this.sortItems.bind(this);
    this.undo = this.undo.bind(this);
    this.updateUndoHistory = this.updateUndoHistory.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.state = {
      disableClearButton: false,
      disableSortButtons: false,
      disableRedoButton: true,
      disableResetButton: true,
      disableUndoButton: true,
      error: '',
      firstName: '',
      heading: '',
      items: this.defaultItems,
      lastName: '',
      listTitle: '',
      newItem: '',
      redoHistory: [],
      undoHistory: []
    };
  }

  addItem() {
    if (this.state.newItem) {
      const newItem = this.state.newItem.trim();

      if (this.state.items.indexOf(newItem) === -1) {
        this.updateUndoHistory();

        this.setState({
          disableClearButton: false,
          disableSortButtons: !this.state.items.length,
          disableRedoButton: true,
          disableResetButton: false,
          disableUndoButton: false,
          error: '',
          items: [...this.state.items, newItem],
          newItem: '',
          redoHistory: []
        });
      }
      else {
        this.setState({
          error: 'This item is already on the list.'
        });
      }
    }
    else {
      this.setState({
        error: 'The new list item must be at least one character long.'
      });
    }
  }

  clearList() {
    this.updateUndoHistory();

    this.setState({
      disableClearButton: true,
      disableResetButton: false,
      disableSortButtons: true,
      items: [],
      redoHistory: []
    });
  }

  keyboardSubmit(callback, e) {
    if (e.key === 'Enter') {
      callback();
    }
  }

  removeItem(id) {
    const index = this.state.items.indexOf(id);
    let itemsState;

    if (index > -1) {
      this.updateUndoHistory();
      itemsState = this.state.items.slice(0)
      itemsState.splice(index, 1);

      this.setState({
        disableClearButton: false,
        disableSortButtons: !this.state.items.length,
        disableRedoButton: true,
        disableResetButton: false,
        disableUndoButton: false,
        error: '',
        items: itemsState,
        redoHistory: []
      });
    }
  }

  resetList() {
    this.updateUndoHistory();

    this.setState({
      disableClearButton: false,
      disableResetButton: true,
      items: this.defaultItems,
      redoHistory: []
    });
  }

  reverseItems() {
    this.updateUndoHistory();

    this.setState({
      disableRedoButton: true,
      disableUndoButton: false,
      items: this.state.items.reverse(),
      redoHistory: []
    });
  }

  sortItems() {
    this.updateUndoHistory();

    this.setState({
      disableRedoButton: true,
      disableUndoButton: false,
      items: this.state.items.sort(),
      redoHistory: []
    });
  }

  redo() {
    if (this.state.redoHistory.length) {
      const oldList = this.state.items.slice(0);
      let newList = this.state.redoHistory.slice(0);
      let newListLength;
      let redoHistory = this.state.redoHistory.slice(0);
      newList = newList.pop();
      newListLength = newList.length;
      redoHistory.pop();

      this.setState({
        disableClearButton: !newListLength,
        disableSortButtons: !newListLength,
        disableRedoButton: !redoHistory.length,
        disableUndoButton: false,
        items: newList,
        redoHistory: redoHistory,
        undoHistory: [...this.state.undoHistory, oldList]
      });
    }
  }

  undo() {
    if (this.state.undoHistory.length) {
      const oldList = this.state.items.slice(0);
      let newList = this.state.undoHistory.slice(0);
      let newListLength;
      let undoHistory = this.state.undoHistory.slice(0);
      newList = newList.pop();
      newListLength = newList.length;
      undoHistory.pop();

      this.setState({
        disableClearButton: !newListLength,
        disableSortButtons: !newListLength,
        disableRedoButton: false,
        disableUndoButton: !undoHistory.length,
        items: newList,
        redoHistory: [...this.state.redoHistory, oldList],
        undoHistory: undoHistory
      });
    }
  }

  updateUndoHistory() {
    this.setState({
      undoHistory: [...this.state.undoHistory, this.state.items.slice(0)]
    });
  }

  updateInput(state, value) {
    this.setState({
      error: '',
      [state]: value
    });
  }

  render() {
    return (
      <main className='app'>
        <div className={'component--list'}>
          <ListHeading
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            listTitle={this.state.listTitle}
            headingClass={'list-heading'}
          />
          <Form
            clearAction={this.clearList}
            disableClearButton={this.state.disableClearButton}
            disableRedoButton={this.state.disableRedoButton}
            disableResetButton={this.state.disableResetButton}
            disableUndoButton={this.state.disableUndoButton}
            error={this.state.error}
            itemInputUpdate={this.updateInput}
            itemSubmit={this.addItem}
            itemSubmitKeyboard={this.keyboardSubmit}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            newItem={this.state.newItem}
            redoAction={this.redo}
            resetAction={this.resetList}
            reverseAction={this.reverseItems}
            sortAction={this.sortItems}
            undoAction={this.undo}
          />
          <List
            items={this.state.items}
            removeAction={this.removeItem}
          />
        </div>
      </main>
    );
  }
}

function Button(props) {
  return (
    <button aria-label={props.ariaLabel} className={props.className} onClick={() => props.onClick(props.target)}>{props.content}</button>
  );
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.createClasses = this.createClasses.bind(this);
  }

  classPrefix = 'field--';
  inputPrefix = 'input-button input-button--';

  createClasses(suffix, disableProp = null) {
    let classes = this.inputPrefix + suffix;

    if (disableProp && this.props[disableProp]) {
      classes += ' disabled';
    }

    return classes;
  }

  render() {
    let clearClasses = this.createClasses('clear-list', 'disableClearButton');
    let redoClasses = this.createClasses('redo', 'disableRedoButton');
    let resetClasses = this.createClasses('reset-list', 'disableResetButton');
    let reverseClasses = this.createClasses('reverse-order', 'disableSortButtons');
    let sortAbcClasses = this.createClasses('sort-abc', 'disableSortButtons');
    let undoClasses = this.createClasses('undo', 'disableUndoButton');

    return (
      <form>
        <fieldset>
          <InputField inputName={'first-name'} inputValue={this.props.firstName} onChange={this.props.itemInputUpdate} stateUpdate={'firstName'} labelClass={''} labelValue={'First Name'} type={'text'} wrapperClass={this.classPrefix + 'first-name'} />
          <InputField inputName={'last-name'} inputValue={this.props.lastName} onChange={this.props.itemInputUpdate} stateUpdate={'lastName'} labelValue={'Last Name'} type={'text'} wrapperClass={this.classPrefix + 'last-name'} />
          <InputField inputName={'list-title'} inputValue={this.props.listTitle} onChange={this.props.itemInputUpdate} stateUpdate={'listTitle'} labelValue={'List Title'} type={'text'} wrapperClass={this.classPrefix + 'list-title'} />
        </fieldset>
        <fieldset className={'fieldset--list-controls'}>
          <fieldset className={'fieldset--add-item'}>
            <InputField inputName={'list-item'} inputValue={this.props.newItem} keyboardCallback={this.props.itemSubmit} onChange={this.props.itemInputUpdate} onKeyPress={this.props.itemSubmitKeyboard} stateUpdate={'newItem'} labelValue={'New Item'} type={'text'} wrapperClass={this.classPrefix + 'list-item'} />
            <Input className={this.inputPrefix + 'add-item'} onClick={this.props.itemSubmit} type={'button'} value={'Add Item'} />
          </fieldset>
          <Input className={sortAbcClasses} onClick={this.props.sortAction} type={'button'} value={'Sort Alphabetically'} />
          <Input className={reverseClasses} onClick={this.props.reverseAction} type={'button'} value={'Reverse Order'} />
          <Input ariaDisabled={this.props.disableUndoButton} className={undoClasses} onClick={this.props.undoAction} type={'button'} value={'Undo'} />
          <Input ariaDisabled={this.props.disableRedoButton} className={redoClasses} onClick={this.props.redoAction} type={'button'} value={'Redo'} />
          <Input ariaDisabled={this.props.disableClearButton} className={clearClasses} onClick={this.props.clearAction} type={'button'} value={'Clear List'} />
          <Input ariaDisabled={this.props.disableResetButton} className={resetClasses} onClick={this.props.resetAction} type={'button'} value={'Reset List'} />
        </fieldset>
        <div className={'message'}><Text className={'message--error'} value={this.props.error} /></div>
      </form>
    );
  }
}

function Heading(props) {
  return (
    <h1 className={props.className}>{props.content}</h1>
  );
}

function Input(props) {
  return (
    <input aria-disabled={props.ariaDisabled} className={props.className} onChange={props.onChange ? (e) => props.onChange(props.stateUpdate, e.target.value): null} onClick={props.onClick} onKeyPress={props.onKeyPress ? (e) => props.onKeyPress(props.keyboardCallback, e) : null} type={props.type} value={props.value} />
  );
}

function InputField(props) {
  const labelClasses = 'input-label' + props.labelClass;
  const label = props.labelValue ? <Label className={labelClasses.trim()} htmlFor={props.inputName} value={props.labelValue}/> : '';
  const wrapperClasses = 'input-field ' + props.wrapperClass;

  return (
    <div className={wrapperClasses.trim()}>
      {label}
      <Input keyboardCallback={props.keyboardCallback} name={props.inputName} onChange={props.onChange} onKeyPress={props.onKeyPress} stateUpdate={props.stateUpdate} type={props.type} value={props.inputValue} />
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
      <Button className={'button--remove-item'} content={'X'} ariaLabel={'Remove ' + props.value} onClick={props.removeAction} target={props.value} />
    </li>
  );
}

function Text(props) {
  return (
    <span className={props.className}>{props.value}</span>
  );
}

export default App;
