import React, { Component } from 'react';
import styled from 'styled-components'

import { connect } from 'react-redux';
import firebase from '../../../firebase';

import Message from './Message';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import { FiMessageSquare } from 'react-icons/fi';


const MainWrapper = styled.div`
  padding: 2rem 2rem 0 2rem;
`

const MessageWrapper = styled.div`
  width: 100%;
  height: 450px;
  border: 0.2rem solid #eae3c8;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-y: auto;
`

export class MainPanel extends Component {

  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
    messagesLoading: true,
  }

  componentDidMount() {
    const { chatRoom } = this.props;
    
    if(chatRoom) {
      this.addMessagesListeners(chatRoom.id)
    }
  }
  
  addMessagesListeners = (chatRoomId) => {
    const { messagesRef } = this.state;
    let messagesArray = [];

    messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
      messagesArray.push(DataSnapshot.val());
      this.setState({ 
        messages: messagesArray,
        messagesLoading: false
      });
    })
  }

  renderMessages = (messages) => {
    const { user } = this.props;

    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={user}
      />
    ))
  }

  render () {
    const { user } = this.props;
    const { messages } = this.state;
    return (
      <MainWrapper>
        <MessageHeader />
        <MessageWrapper>
          {messages.length > 0 && 
            messages.map((message) => (
              <Message
                key={message.timestamp}
                message={message}
                user={user}
              />
            ))
          }
        </MessageWrapper>
          <MessageForm />
      </MainWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  }
}

export default connect(mapStateToProps)(MainPanel)