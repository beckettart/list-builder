import './App.css';
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.clearList = this.clearList.bind(this);
    this.createInputId = this.createInputId.bind(this);
    this.createUniqueId = this.createUniqueId.bind(this);
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

  uniqueIds = [];
  uniqueKeys = [];

  cleanId(value) {
    value = value.toLowerCase();
    return value.replace(/\W+/g, '-');
  }

  createInputId(props) {
    let genericId;

    if (props.inputName) {
      genericId = props.inputName;
    }
    else if (props.labelValue) {
      genericId = this.props.labelValue;
    }
    else {
      genericId = props.type ? 'input--' + props.type : 'input';
    }

    return this.createUniqueId(props.uniqueIdsArrayName, genericId);
  }

  createUniqueId(arrayName, value) {
    window.console.log(arrayName);
    window.console.log(value);
    const array = this.getPrivateVar(arrayName);
    let baseId = this.cleanId(value);
    let uid = 1;
    let uniqueId = baseId + '--' + uid;

    while (array.includes(uniqueId)) {
      uniqueId = baseId + '--' + uid;
      uid++;
    }

    return uniqueId;
  }

  getPrivateVar(name) {
    switch(name) {
      case 'uniqueIds':
        return this.uniqueIds;
      case 'uniqueKeys':
        return this.uniqueKeys;
      default:
        return null;
    }
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
      disableRedoButton: true,
      disableResetButton: false,
      disableSortButtons: true,
      disableUndoButton: false,
      error: '',
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
      disableRedoButton: true,
      disableResetButton: true,
      disableUndoButton: false,
      error: '',
      items: this.defaultItems,
      redoHistory: []
    });
  }

  reverseItems() {
    this.updateUndoHistory();

    this.setState({
      disableRedoButton: true,
      disableUndoButton: false,
      error: '',
      items: this.state.items.reverse(),
      redoHistory: []
    });
  }

  sortItems() {
    this.updateUndoHistory();

    this.setState({
      disableRedoButton: true,
      disableUndoButton: false,
      error: '',
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
        error: '',
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
        error: '',
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
      <main className={'app'}>
        <div className={'component--list'}>
          <ListHeading
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            listTitle={this.state.listTitle}
            headingClass={'list-heading'}
          />
          <Form
            clearAction={this.clearList}
            createInputId={this.createInputId}
            createUniqueId={this.createUniqueId}
            uniqueIdsArrayName={'uniqueIds'}
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
            createUniqueKey={this.createUniqueId}
            uniqueKeysArrayName={'uniqueKeys'}
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
    <button
      aria-label={props.ariaLabel}
      className={props.className}
      onClick={() => props.onClick(props.target)}
    >
      {props.content}
    </button>
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
          <InputField
            createInputId={this.props.createInputId}
            createUniqueId={this.props.createUniqueId}
            inputName={'first-name'}
            inputValue={this.props.firstName}
            onChange={this.props.itemInputUpdate}
            stateUpdate={'firstName'}
            labelClass={''}
            labelValue={'First Name'}
            type={'text'}
            uniqueIdsArrayName={'uniqueIds'}
            wrapperClass={this.classPrefix + 'first-name'}
          />
          <InputField
            createInputId={this.props.createInputId}
            createUniqueId={this.props.createUniqueId}
            inputName={'last-name'}
            inputValue={this.props.lastName}
            onChange={this.props.itemInputUpdate}
            stateUpdate={'lastName'}
            labelValue={'Last Name'}
            type={'text'}
            uniqueIdsArrayName={'uniqueIds'}
            wrapperClass={this.classPrefix + 'last-name'}
          />
          <InputField
            createInputId={this.props.createInputId}
            createUniqueId={this.props.createUniqueId}
            inputName={'list-title'}
            inputValue={this.props.listTitle}
            onChange={this.props.itemInputUpdate}
            stateUpdate={'listTitle'}
            labelValue={'List Title'} type={'text'}
            uniqueIdsArrayName={'uniqueIds'}
            wrapperClass={this.classPrefix + 'list-title'}
          />
        </fieldset>
        <fieldset className={'fieldset--list-controls'}>
          <fieldset className={'fieldset--add-item'}>
            <InputField
              createInputId={this.props.createInputId}
              createUniqueId={this.props.createUniqueId}
              inputName={'list-item'}
              inputValue={this.props.newItem}
              keyboardCallback={this.props.itemSubmit}
              onChange={this.props.itemInputUpdate}
              onKeyPress={this.props.itemSubmitKeyboard}
              stateUpdate={'newItem'}
              labelValue={'New Item'}
              type={'text'}
              uniqueIdsArrayName={'uniqueIds'}
              wrapperClass={this.classPrefix + 'list-item'}
            />
            <Input
              className={this.inputPrefix + 'add-item'}
              onClick={this.props.itemSubmit}
              type={'button'}
              value={'Add Item'}
            />
          </fieldset>
          <Input
            className={sortAbcClasses}
            onClick={this.props.sortAction}
            type={'button'}
            value={'Sort Alphabetically'}
          />
          <Input
            className={reverseClasses}
            onClick={this.props.reverseAction}
            type={'button'}
            value={'Reverse Order'}
          />
          <Input
            ariaDisabled={this.props.disableUndoButton}
            className={undoClasses}
            clickDisabled={this.props.disableUndoButton}
            onClick={this.props.undoAction}
            type={'button'}
            value={'Undo'}
          />
          <Input
            ariaDisabled={this.props.disableRedoButton}
            className={redoClasses}
            clickDisabled={this.props.disableRedoButton}
            onClick={this.props.redoAction}
            type={'button'}
            value={'Redo'}
          />
          <Input
            ariaDisabled={this.props.disableClearButton}
            className={clearClasses}
            clickDisabled={this.props.disableClearButton}
            onClick={this.props.clearAction}
            type={'button'}
            value={'Clear List'}
          />
          <Input
            ariaDisabled={this.props.disableResetButton}
            className={resetClasses}
            clickDisabled={this.props.disableResetButton}
            onClick={this.props.resetAction}
            type={'button'}
            value={'Reset List'}
          />
        </fieldset>
        <div className={'message'}>
          <Text className={'message--error'} value={this.props.error} />
        </div>
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
  let id;

  if (props.id) {
    id = props.id;
  }
  else if (props.createInputId) {
    id = props.createInputId(props);
  }

  return (
    <input
      aria-disabled={props.ariaDisabled}
      className={props.className}
      id={id}
      name={props.inputName}
      onChange={props.onChange ?
        (e) => props.onChange(props.stateUpdate, e.target.value) :
        null
      }
      onClick={props.onClick && !props.clickDisabled ?
        (e) => props.onClick() :
        null
      }
      onKeyPress={props.onKeyPress ?
        (e) => props.onKeyPress(props.keyboardCallback, e) :
        null
      }
      type={props.type}
      value={props.value}
    />
  );
}

function InputField(props) {
  const wrapperClasses = 'input-field ' + props.wrapperClass;
  const labelClasses = 'input-label' + props.labelClass;
  let label;
  let uniqueId = props.createInputId ? props.createInputId(props) : '';

  label = props.labelValue ?
    <Label
      className={labelClasses.trim()}
      htmlFor={uniqueId}
      value={props.labelValue}
    /> :
    '';

  return (
    <div className={wrapperClasses.trim()}>
      {label}
      <Input
        keyboardCallback={props.keyboardCallback}
        id={uniqueId}
        inputName={props.inputName}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
        stateUpdate={props.stateUpdate}
        type={props.type}
        value={props.inputValue}
      />
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

  createItem(item) {
    let itemKey = this.props.createUniqueKey(this.props.uniqueKeysArrayName, item);
    return <ListItem
      className={'list-item list-item--' + itemKey}
      itemId={itemKey}
      key={itemKey}
      removeAction={this.props.removeAction}
      value={item}
    />
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
      <Button
        ariaLabel={'Remove ' + props.value}
        className={'button--remove-item'}
        content={'X'}
        onClick={props.removeAction}
        target={props.value}
      />
      <Text value={props.value} />
    </li>
  );
}

function Text(props) {
  return (
    <span className={props.className}>{props.value}</span>
  );
}

export default App;
