import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import logo from './logo.svg';
import './App.css';

// const endpoint = 'wss://7l4l94f8rc.execute-api.us-east-1.amazonaws.com/dev'; // 'ws://localhost:3001'
const endpoint = 'ws://localhost:3001';

const client = new W3CWebSocket(endpoint);

class App extends Component {
  state = {
    username: '',
    inputValue: '',
    messages: null,
  };

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      // this.logInUser('someUsername');
    };
    client.onmessage = (message) => {
      console.log('recibido', message);
      this.setState({ lastMessage: `${message.data} (${message.timeStamp})` });
      if (this.state.messages) {
        const newMessage = {
          data: message.data,
          timeStamp: message.timeStamp
        };
        this.setState({ messages: [...this.state.messages, newMessage] });
      } else {
        const messages = [];
        messages.push({
          data: message.data,
          timeStamp: message.timeStamp
        });
        this.setState({ messages });
      }
      // const dataFromServer = JSON.parse(message.data);
      /*
      const stateToChange = {};
      if (dataFromServer.type === "userevent") {
        stateToChange.currentUsers = Object.values(dataFromServer.data.users);
      } else if (dataFromServer.type === "contentchange") {
        stateToChange.text = dataFromServer.data.editorContent || 'contentDefaultMessage';
      }
      stateToChange.userActivity = dataFromServer.data.userActivity;
      this.setState({
        ...stateToChange
      });
      */
    };
  }

  /* When a user joins, I notify the
  server that a new user has joined to edit the document. */
  logInUser = (username) => {
    if (username.trim()) {
      const data = {
        username
      };
      this.setState({
        ...data
      }, () => {
        client.send(JSON.stringify({
          ...data,
          action: 'hello'
        }));
      });
    }
  }

  sendMessage = () => {
    client.send(JSON.stringify({
      data: 'some message',
      action: 'message'
    }));
  }

  handleChange = (event) => {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    client.send(JSON.stringify({
      data: this.state.inputValue,
      action: 'message'
    }));

    // Clear input
    this.setState({ inputValue: '' });
  }

  render() {
    let messages = '';
    if (this.state.messages) {
      messages = this.state.messages.map((message) => {
        return <li key={message.timeStamp}>{message.data}</li>;
      })
    }

    return (
      <div className="App">
        <ul id="messages">
        {messages}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <input
              id="message" name="message" type="text"
              value={this.state.inputValue} onChange={this.handleChange} autoComplete="off" />
          <input id="input-submit" type="submit" value="Send" />
        </form>
      </div>
    );
  }
}

export default App;
