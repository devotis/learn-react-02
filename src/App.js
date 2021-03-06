import React, { Component } from 'react';
import PropTypes from 'prop-types'
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo'
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from './lib/todoHelpers'
import {partial, pipe} from './lib/utils'
import {loadTodos, createTodo, saveTodo, destroyTodo} from './lib/todoService'

class App extends Component {
  state = {
    todos: [],
    currentTodo: ''
  }

  static contextTypes = {
    route: PropTypes.string
  }

  componentDidMount() {
    loadTodos()
      .then(todos => this.setState({todos}))
  }

  handleRemove = (id, evt) => {
    evt.preventDefault()
    const updatedTodos = removeTodo(this.state.todos, id)

    this.setState({
      todos: updatedTodos
    })

    destroyTodo(id)
      .then(() => this.showTempMessage('Todo removed'))
  }

  handleToggle = (id) => {
    const pipeline = pipe(findById, toggleTodo)
    const updated = pipeline(id, this.state.todos)
    const updatedTodos = updateTodo (this.state.todos, updated)

    this.setState({
      todos: updatedTodos
    })

    saveTodo(updated)
      .then(() => this.showTempMessage('Todo updated'))
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const newTodo = {
      name: this.state.currentTodo,
      isComplete: false,
      id: generateId()
    }

    const updatedTodos = addTodo(this.state.todos, newTodo)

    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMessage: ''
    })

    createTodo(newTodo)
      .then(() => this.showTempMessage('Todo added'))
  }

  showTempMessage = (msg) => {
    this.setState({message: msg})
    setTimeout(() => this.setState({message: ''}), 2500)
  }

  handleEmptySubmit = (e) => {
    e.preventDefault()

    this.setState({
      errorMessage: 'Please supply a todo name'
    })
  }

  handleInputChange = (e, todo) => {
    this.setState({
      currentTodo: e.target.value

    })
  }

  render() {
    console.log('render app')
    const submitHandler = this.state.currentTodo  ? this.handleSubmit : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React todos</h2>
        </div>
        <div className="Todo-App">
          {this.state.errorMessage && <span className='error'>{this.state.errorMessage}</span>}
          {this.state.message && <span className='success'>{this.state.message}</span>}
          <TodoForm
            handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}
          />
          <TodoList
            handleToggle={this.handleToggle}
            handleRemove={this.handleRemove}
            todos={displayTodos}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
