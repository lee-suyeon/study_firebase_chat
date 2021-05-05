import React, { Component } from 'react';
import styled from 'styled-components'

import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';

import Message from './Message';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';

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
    typingRef: firebase.database().ref("typing"),
    messagesLoading: true,
    searchTerm: "",
    searchLoading: true,
    searchResults: [],
    typingUsers: [],
  }

  componentDidMount() {
    const { chatRoom } = this.props;
    
    if(chatRoom) {
      this.addMessagesListeners(chatRoom.id);
      this.addTypingListeners(chatRoom.id);
    }
  }

  addTypingListeners = (chatRoomId) => {
    const { typingRef } = this.state;

    let typingUsers = [];
    // 타이핑이 새로 들어올 때
    typingRef.child(chatRoomId).on("child_added", DataSnapshot => {
      if(DataSnapshot.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          id: DataSnapshot.key,
          name: DataSnapshot.val()
        });
        this.setState({ typingUsers })
      }
    })

    // 타이핑을 지워줄 때
    typingRef.child(chatRoomId).on("child_removed", DataSnapshot => {
      const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
      if(index !== -1){
        typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
        this.setState({ typingUsers });
      }
    })
  }

  handleSearchMessages = () => {
    const chatRoomMessages = [ ...this.state.messages ];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if(
        message.content && message.content.match(regex) ||
        (message.user.name.match(regex))
      ){
        acc.push(message)
      }
      return acc;
    }, [])
    this.setState({ searchResults })
  }

  handleSearchChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages())
    
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
      this.userPostsCount(messagesArray)
    })
  }

  userPostsCount = (messagesArray) => {
    let userPosts = messagesArray.reduce(( acc, message ) => {
      if(message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        }
      }
      return acc;
    }, {})
    this.props.dispatch(setUserPosts(userPosts));
  }

  renderMessages = (messages) => 
    messages.length > 0 &&
    messages.map((message) => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.props.user}
        />
  ))
  

  render () {
    const { messages, searchTerm, searchResults } = this.state;
    return (
      <MainWrapper>
        <MessageHeader 
          handleSearchChange={this.handleSearchChange}
        />
        <MessageWrapper>
          {searchTerm ?
            this.renderMessages(searchResults) :
            this.renderMessages(messages)
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